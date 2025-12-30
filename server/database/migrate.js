import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "studentenathome",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

// Helper function to read JSON files
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
    return [];
  }
}

async function createSchema() {
  console.log("📋 Creating database schema...");
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  try {
    await pool.query(schema);
    console.log("✅ Schema created successfully");
  } catch (error) {
    console.error("❌ Error creating schema:", error);
    throw error;
  }
}

async function migrateUsers() {
  console.log("\n👥 Migrating users...");
  const usersPath = path.join(__dirname, "../data/users.json");
  const users = readJsonFile(usersPath);

  if (users.length === 0) {
    console.log("⚠️  No users to migrate");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      await pool.query(
        `INSERT INTO users (
          id, email, password, name, is_verified, is_admin,
          verification_token, verification_expiry, last_login,
          verified_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING`,
        [
          user.id,
          user.email,
          user.password,
          user.name,
          user.isVerified || false,
          user.isAdmin || false,
          user.verificationToken || null,
          user.verificationExpiry || null,
          user.lastLogin || null,
          user.verifiedAt || null,
          user.createdAt || new Date().toISOString(),
        ]
      );
      successCount++;
      console.log(`  ✓ Migrated user: ${user.email}`);
    } catch (error) {
      errorCount++;
      console.error(`  ✗ Failed to migrate user ${user.email}:`, error.message);
    }
  }

  console.log(
    `✅ Users migration complete: ${successCount} success, ${errorCount} errors`
  );
}

async function migratePosts() {
  console.log("\n📝 Migrating posts...");
  const postsPath = path.join(__dirname, "../data/posts.json");
  const posts = readJsonFile(postsPath);

  if (posts.length === 0) {
    console.log("⚠️  No posts to migrate");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    try {
      await pool.query(
        `INSERT INTO posts (
          id, slug, title, excerpt, content, category, author,
          date, read_time, status, submitted_at, published_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO NOTHING`,
        [
          post.id,
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          post.category,
          post.author,
          post.date || null,
          post.readTime || "5 Min",
          post.status || "pending",
          post.submittedAt || null,
          post.publishedAt || null,
          post.updatedAt || new Date().toISOString(),
        ]
      );
      successCount++;
      console.log(`  ✓ Migrated post: ${post.title}`);
    } catch (error) {
      errorCount++;
      console.error(`  ✗ Failed to migrate post ${post.title}:`, error.message);
    }
  }

  console.log(
    `✅ Posts migration complete: ${successCount} success, ${errorCount} errors`
  );
}

async function verifyMigration() {
  console.log("\n🔍 Verifying migration...");

  try {
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const postsResult = await pool.query("SELECT COUNT(*) FROM posts");

    console.log(`  Users in database: ${usersResult.rows[0].count}`);
    console.log(`  Posts in database: ${postsResult.rows[0].count}`);

    // Show admin users
    const adminResult = await pool.query(
      "SELECT email FROM users WHERE is_admin = true"
    );
    console.log(
      `  Admin users: ${
        adminResult.rows.map((r) => r.email).join(", ") || "none"
      }`
    );

    // Show post statuses
    const statusResult = await pool.query(
      "SELECT status, COUNT(*) FROM posts GROUP BY status"
    );
    console.log("  Post statuses:");
    statusResult.rows.forEach((row) => {
      console.log(`    ${row.status}: ${row.count}`);
    });
  } catch (error) {
    console.error("❌ Error verifying migration:", error);
  }
}

async function runMigration() {
  console.log("🚀 Starting database migration...\n");

  try {
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful\n");

    // Run migrations
    await createSchema();
    await migrateUsers();
    await migratePosts();
    await verifyMigration();

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration();
