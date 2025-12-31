import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Database helper functions
export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

// User queries
export const userQueries = {
  findByEmail: async (email) => {
    const result = await query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },

  findByVerificationToken: async (token) => {
    const result = await query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );
    return result.rows[0];
  },

  create: async (user) => {
    const result = await query(
      `INSERT INTO users (
        email, password, name, is_verified, is_admin,
        verification_token, verification_expiry
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '24 hours')
      RETURNING *`,
      [
        user.email.toLowerCase(),
        user.password,
        user.name,
        user.is_verified || false,
        user.is_admin || false,
        user.verification_token,
      ]
    );
    return result.rows[0];
  },

  verifyEmail: async (userId) => {
    const result = await query(
      `UPDATE users 
       SET is_verified = true, 
           verification_token = NULL, 
           verification_expiry = NULL,
           verified_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  updateVerificationToken: async (userId, token) => {
    const result = await query(
      `UPDATE users 
       SET verification_token = $1,
           verification_expiry = NOW() + INTERVAL '24 hours'
       WHERE id = $2
       RETURNING *`,
      [token, userId]
    );
    return result.rows[0];
  },

  updateLastLogin: async (userId, ipAddress) => {
    const result = await query(
      `UPDATE users 
       SET last_login = NOW(),
           last_login_ip = $1
       WHERE id = $2
       RETURNING *`,
      [ipAddress, userId]
    );
    return result.rows[0];
  },

  incrementFailedLogin: async (userId) => {
    const result = await query(
      `UPDATE users 
       SET failed_login_attempts = failed_login_attempts + 1,
           is_locked = CASE 
             WHEN failed_login_attempts >= 4 THEN true 
             ELSE false 
           END
       WHERE id = $1
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  resetFailedLogin: async (userId) => {
    const result = await query(
      `UPDATE users 
       SET failed_login_attempts = 0,
           is_locked = false
       WHERE id = $1
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  isTokenRevoked: async (token) => {
    const result = await query(
      "SELECT EXISTS(SELECT 1 FROM revoked_tokens WHERE token = $1) as revoked",
      [token]
    );
    return result.rows[0]?.revoked || false;
  },

  revokeToken: async (token, userId) => {
    const result = await query(
      `INSERT INTO revoked_tokens (token, user_id)
       VALUES ($1, $2)
       ON CONFLICT (token) DO NOTHING
       RETURNING *`,
      [token, userId]
    );
    return result.rows[0];
  },

  // Password Reset
  setPasswordResetToken: async (userId, token) => {
    const result = await query(
      `UPDATE users 
       SET password_reset_token = $1,
           password_reset_expiry = NOW() + INTERVAL '1 hour',
           password_reset_attempts = 0,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [token, userId]
    );
    return result.rows[0];
  },

  findByPasswordResetToken: async (token) => {
    const result = await query(
      `SELECT * FROM users 
       WHERE password_reset_token = $1 
       AND password_reset_expiry > NOW()`,
      [token]
    );
    return result.rows[0];
  },

  resetPassword: async (userId, hashedPassword) => {
    const result = await query(
      `UPDATE users 
       SET password = $1,
           password_reset_token = NULL,
           password_reset_expiry = NULL,
           password_reset_attempts = 0,
           password_changed_at = NOW(),
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [hashedPassword, userId]
    );
    return result.rows[0];
  },

  incrementPasswordResetAttempts: async (userId) => {
    const result = await query(
      `UPDATE users 
       SET password_reset_attempts = password_reset_attempts + 1
       WHERE id = $1
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },
};

// Post queries
export const postQueries = {
  findAll: async (status = null) => {
    let queryText = "SELECT * FROM posts";
    let params = [];

    if (status) {
      queryText += " WHERE status = $1 ORDER BY published_at DESC";
      params = [status];
    } else {
      queryText += " ORDER BY updated_at DESC";
    }

    const result = await query(queryText, params);
    return result.rows;
  },

  findById: async (id) => {
    const result = await query("SELECT * FROM posts WHERE id = $1", [id]);
    return result.rows[0];
  },

  findBySlug: async (slug) => {
    const result = await query("SELECT * FROM posts WHERE slug = $1", [slug]);
    return result.rows[0];
  },

  create: async (post) => {
    const result = await query(
      `INSERT INTO posts (
        slug, title, excerpt, content, category, author, read_time, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.author,
        post.read_time || "5 Min",
        post.status || "pending",
      ]
    );
    return result.rows[0];
  },

  updateStatus: async (id, status) => {
    const result = await query(
      `UPDATE posts 
       SET status = $1::VARCHAR, 
           published_at = CASE 
             WHEN $1::VARCHAR = 'approved' AND published_at IS NULL 
             THEN NOW() 
             ELSE published_at 
           END,
           updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await query("DELETE FROM posts WHERE id = $1 RETURNING *", [
      id,
    ]);
    return result.rows[0];
  },
};

// Failed login attempt queries
export const failedLoginQueries = {
  record: async ({ email, ip_address, user_agent }) => {
    const result = await query(
      `INSERT INTO failed_login_attempts (email, ip_address, user_agent)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email.toLowerCase(), ip_address, user_agent]
    );
    return result.rows[0];
  },

  getRecentAttempts: async (email, minutes = 15) => {
    const result = await query(
      `SELECT COUNT(*) as count 
       FROM failed_login_attempts 
       WHERE email = $1 
       AND attempted_at > NOW() - INTERVAL '${minutes} minutes'`,
      [email.toLowerCase()]
    );
    return parseInt(result.rows[0]?.count || 0);
  },

  clearOldAttempts: async (days = 30) => {
    const result = await query(
      `DELETE FROM failed_login_attempts 
       WHERE attempted_at < NOW() - INTERVAL '${days} days'
       RETURNING COUNT(*) as deleted`,
      []
    );
    return result.rows[0];
  },
};

// Audit log queries
export const auditQueries = {
  log: async ({ user_id, action, ip_address, user_agent, details = {} }) => {
    const result = await query(
      `INSERT INTO audit_log (user_id, action, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, action, ip_address, user_agent, JSON.stringify(details)]
    );
    return result.rows[0];
  },

  getByUser: async (userId, limit = 100) => {
    const result = await query(
      `SELECT * FROM audit_log 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  getByAction: async (action, limit = 100) => {
    const result = await query(
      `SELECT * FROM audit_log 
       WHERE action = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [action, limit]
    );
    return result.rows;
  },

  clearOldLogs: async (days = 90) => {
    const result = await query(
      `DELETE FROM audit_log 
       WHERE created_at < NOW() - INTERVAL '${days} days'
       RETURNING COUNT(*) as deleted`,
      []
    );
    return result.rows[0];
  },
};

// Job queries
export const jobQueries = {
  findAll: async (includeInactive = false) => {
    let queryText = "SELECT * FROM jobs";
    let params = [];

    if (!includeInactive) {
      queryText += " WHERE status = 'active' AND is_published = true ORDER BY published_at DESC";
    } else {
      queryText += " ORDER BY created_at DESC";
    }

    const result = await query(queryText, params);
    return result.rows;
  },

  findById: async (id) => {
    const result = await query("SELECT * FROM jobs WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (job) => {
    const result = await query(
      `INSERT INTO jobs (
        title, type, location, description, requirements, benefits, status, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        job.title,
        job.type,
        job.location,
        job.description,
        JSON.stringify(job.requirements || []),
        JSON.stringify(job.benefits || []),
        job.status || "active",
        job.is_published !== undefined ? job.is_published : true,
      ]
    );
    return result.rows[0];
  },

  update: async (id, job) => {
    const result = await query(
      `UPDATE jobs 
       SET title = $1,
           type = $2,
           location = $3,
           description = $4,
           requirements = $5,
           benefits = $6,
           status = $7,
           is_published = $8,
           updated_at = NOW()
       WHERE id = $9 
       RETURNING *`,
      [
        job.title,
        job.type,
        job.location,
        job.description,
        JSON.stringify(job.requirements || []),
        JSON.stringify(job.benefits || []),
        job.status,
        job.is_published,
        id,
      ]
    );
    return result.rows[0];
  },

  updateStatus: async (id, status) => {
    const result = await query(
      `UPDATE jobs 
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await query("DELETE FROM jobs WHERE id = $1 RETURNING *", [
      id,
    ]);
    return result.rows[0];
  },
};

export default pool;
