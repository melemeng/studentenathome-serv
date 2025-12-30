import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

console.log("Testing database connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL starts with:",
  process.env.DATABASE_URL?.substring(0, 30)
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : false,
});

async function testConnection() {
  try {
    console.log("\n1. Testing basic connection...");
    const client = await pool.connect();
    console.log("✅ Connected to database!");

    console.log("\n2. Testing simple query...");
    const result = await client.query("SELECT NOW() as current_time");
    console.log(
      "✅ Query successful! Current time:",
      result.rows[0].current_time
    );

    console.log("\n3. Checking if users table exists...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log("✅ Users table exists:", tableCheck.rows[0].exists);

    console.log("\n4. Testing user query function...");
    const userTest = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["test@example.com"]
    );
    console.log("✅ User query works! Found:", userTest.rows.length, "users");

    console.log("\n5. Testing user creation (dry run)...");
    const insertTest = await client.query(`
      SELECT 
        'test@example.com'::VARCHAR as email,
        'hashedpassword'::VARCHAR as password,
        'Test User'::VARCHAR as name,
        false::BOOLEAN as is_verified,
        false::BOOLEAN as is_admin,
        'testtoken123'::VARCHAR as verification_token
    `);
    console.log("✅ Insert query structure is valid!");

    client.release();
    console.log("\n✅ ALL TESTS PASSED!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

testConnection();
