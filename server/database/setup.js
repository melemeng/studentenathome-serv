import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

// Force IPv4 resolution
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection - use DATABASE_URL directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  console.log("🚀 Setting up secure database...\n");

  try {
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful\n");

    // Read and execute schema
    console.log("📋 Creating secure database schema...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);
    console.log("✅ Schema created successfully\n");

    // Verify tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("📊 Created tables:");
    tablesResult.rows.forEach((row) => {
      console.log(`  ✓ ${row.table_name}`);
    });

    console.log("\n✅ Database setup complete!");
    console.log("\n📝 Next steps:");
    console.log("  1. Start server: npm run start:server");
    console.log("  2. Register first admin user at /register");
    console.log("  3. Test login and blog creation");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("  1. Check DB credentials in .env");
    console.error("  2. Verify Supabase project is active");
    console.error("  3. Ensure DB_PASSWORD is correct");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
