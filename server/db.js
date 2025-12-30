import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "studentenathome",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

// Initialize database schema
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log("🔄 Initializing database schema...");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        verification_expiry BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        verified_at TIMESTAMP,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP
      );
    `);

    // Create posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        excerpt VARCHAR(1000) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        date VARCHAR(50),
        read_time VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    `);

    // Create activity logs table for monitoring
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create failed login attempts table for security
    await client.query(`
      CREATE TABLE IF NOT EXISTS failed_logins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        ip_address VARCHAR(50) NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Database query helpers
export const db = {
  query: (text, params) => pool.query(text, params),

  // User queries
  async createUser(user) {
    const query = `
      INSERT INTO users (id, email, password, name, is_verified, is_admin, verification_token, verification_expiry, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      user.id,
      user.email,
      user.password,
      user.name,
      user.isVerified || false,
      user.isAdmin || false,
      user.verificationToken,
      user.verificationExpiry,
      new Date(),
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email.toLowerCase()]);
    return result.rows[0];
  },

  async getUserById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async updateUser(id, updates) {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(", ");
    const query = `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [id, ...Object.values(updates)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async verifyEmail(token) {
    const query = `
      UPDATE users 
      SET is_verified = TRUE, verification_token = NULL, verification_expiry = NULL, verified_at = CURRENT_TIMESTAMP
      WHERE verification_token = $1 AND verification_expiry > $2
      RETURNING *
    `;
    const result = await pool.query(query, [token, Date.now()]);
    return result.rows[0];
  },

  // Post queries
  async createPost(post) {
    const query = `
      INSERT INTO posts (id, slug, title, excerpt, content, category, author, date, read_time, status, submitted_at, published_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      post.id,
      post.slug,
      post.title,
      post.excerpt,
      post.content,
      post.category,
      post.author,
      post.date,
      post.readTime,
      post.status || "pending",
      new Date(),
      post.status === "approved" ? new Date() : null,
      new Date(),
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAllPosts(includeAll = false) {
    const query = includeAll
      ? "SELECT * FROM posts ORDER BY submitted_at DESC"
      : "SELECT * FROM posts WHERE status = $1 ORDER BY published_at DESC";
    const result = includeAll
      ? await pool.query(query)
      : await pool.query(query, ["approved"]);
    return result.rows;
  },

  async getPostById(id) {
    const query = "SELECT * FROM posts WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async updatePostStatus(id, status) {
    const query = `
      UPDATE posts 
      SET status = $2, published_at = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const publishedAt = status === "approved" ? new Date() : null;
    const result = await pool.query(query, [id, status, publishedAt]);
    return result.rows[0];
  },

  async deletePost(id) {
    const query = "DELETE FROM posts WHERE id = $1";
    await pool.query(query, [id]);
  },

  // Activity logging
  async logActivity(userId, action, ipAddress, userAgent, details = {}) {
    const query = `
      INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [
      userId,
      action,
      ipAddress,
      userAgent,
      JSON.stringify(details),
    ]);
  },

  // Failed login tracking
  async recordFailedLogin(email, ipAddress) {
    const query = `
      INSERT INTO failed_logins (email, ip_address)
      VALUES ($1, $2)
    `;
    await pool.query(query, [email, ipAddress]);
  },

  async getFailedLoginCount(email, minutes = 15) {
    const query = `
      SELECT COUNT(*) as count 
      FROM failed_logins 
      WHERE email = $1 AND attempted_at > NOW() - INTERVAL '${minutes} minutes'
    `;
    const result = await pool.query(query, [email]);
    return parseInt(result.rows[0].count);
  },

  async incrementFailedLoginAttempts(email) {
    const query = `
      UPDATE users 
      SET failed_login_attempts = failed_login_attempts + 1
      WHERE email = $1
      RETURNING failed_login_attempts
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0]?.failed_login_attempts || 0;
  },

  async resetFailedLoginAttempts(email) {
    const query = `
      UPDATE users 
      SET failed_login_attempts = 0, locked_until = NULL
      WHERE email = $1
    `;
    await pool.query(query, [email]);
  },

  async lockAccount(email, minutes = 30) {
    const query = `
      UPDATE users 
      SET locked_until = NOW() + INTERVAL '${minutes} minutes'
      WHERE email = $1
    `;
    await pool.query(query, [email]);
  },
};

export default pool;
