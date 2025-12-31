import dotenv from "dotenv";
dotenv.config();

import { query, userQueries, postQueries, jobQueries } from "./db.js";

console.log("🔍 Verifying database configuration and data...\n");

async function verifyDatabase() {
  try {
    // Test connection
    console.log("1. Testing database connection...");
    const connectionTest = await query("SELECT NOW() as current_time");
    console.log(
      `✅ Connected to database at ${connectionTest.rows[0].current_time}`
    );
    console.log("");

    // Check tables exist
    console.log("2. Checking tables...");
    const tablesQuery = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = tablesQuery.rows.map((r) => r.table_name);
    console.log(`   Found ${tables.length} tables:`);
    tables.forEach((t) => console.log(`   - ${t}`));
    console.log("");

    // Required tables
    const requiredTables = [
      "users",
      "posts",
      "jobs",
      "audit_log",
      "failed_login_attempts",
      "revoked_tokens",
    ];
    const missingTables = requiredTables.filter((t) => !tables.includes(t));

    if (missingTables.length > 0) {
      console.log(
        `⚠️  Missing tables: ${missingTables.join(", ")}`
      );
      console.log(
        "   Run: npm run db:setup to create missing tables\n"
      );
    } else {
      console.log("✅ All required tables exist\n");
    }

    // Check users
    console.log("3. Checking users table...");
    const usersCount = await query("SELECT COUNT(*) FROM users");
    const adminCount = await query(
      "SELECT COUNT(*) FROM users WHERE is_admin = true"
    );
    console.log(`   Total users: ${usersCount.rows[0].count}`);
    console.log(`   Admin users: ${adminCount.rows[0].count}`);

    if (parseInt(adminCount.rows[0].count) === 0) {
      console.log(
        "   ⚠️  No admin users found. Register an admin at /register"
      );
    }
    console.log("");

    // Check posts
    console.log("4. Checking posts table...");
    const postsCount = await query("SELECT COUNT(*) FROM posts");
    const postsByStatus = await query(`
      SELECT status, COUNT(*) as count 
      FROM posts 
      GROUP BY status
    `);
    console.log(`   Total posts: ${postsCount.rows[0].count}`);
    if (postsByStatus.rows.length > 0) {
      console.log("   Posts by status:");
      postsByStatus.rows.forEach((row) => {
        console.log(`   - ${row.status}: ${row.count}`);
      });
    } else {
      console.log("   No posts yet. Create one at /blog");
    }
    console.log("");

    // Check jobs
    console.log("5. Checking jobs table...");
    const jobsCount = await query("SELECT COUNT(*) FROM jobs");
    const activeJobs = await query(
      "SELECT COUNT(*) FROM jobs WHERE status = 'active' AND is_published = true"
    );
    console.log(`   Total jobs: ${jobsCount.rows[0].count}`);
    console.log(`   Active/published: ${activeJobs.rows[0].count}`);

    if (parseInt(jobsCount.rows[0].count) === 0) {
      console.log(
        "   ⚠️  No jobs found. Run: node server/database/seed-jobs.js"
      );
    } else {
      const jobTitles = await query(
        "SELECT title FROM jobs WHERE status = 'active' ORDER BY created_at"
      );
      console.log("   Job listings:");
      jobTitles.rows.forEach((job, idx) => {
        console.log(`   ${idx + 1}. ${job.title}`);
      });
    }
    console.log("");

    // Check audit log
    console.log("6. Checking audit_log table...");
    const auditCount = await query("SELECT COUNT(*) FROM audit_log");
    console.log(`   Total audit entries: ${auditCount.rows[0].count}`);

    if (parseInt(auditCount.rows[0].count) > 0) {
      const recentAudits = await query(`
        SELECT action, COUNT(*) as count 
        FROM audit_log 
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY action
        ORDER BY count DESC
        LIMIT 5
      `);
      if (recentAudits.rows.length > 0) {
        console.log("   Recent actions (last 7 days):");
        recentAudits.rows.forEach((row) => {
          console.log(`   - ${row.action}: ${row.count}`);
        });
      }
    }
    console.log("");

    // Check failed logins
    console.log("7. Checking security...");
    const failedLogins = await query(
      "SELECT COUNT(*) FROM failed_login_attempts WHERE attempted_at > NOW() - INTERVAL '24 hours'"
    );
    console.log(
      `   Failed login attempts (24h): ${failedLogins.rows[0].count}`
    );
    console.log("");

    // Summary
    console.log("========================================");
    console.log("✅ DATABASE VERIFICATION COMPLETE");
    console.log("========================================");
    console.log("");

    const issues = [];
    if (missingTables.length > 0) issues.push("Missing tables");
    if (parseInt(adminCount.rows[0].count) === 0)
      issues.push("No admin users");
    if (parseInt(jobsCount.rows[0].count) === 0) issues.push("No job listings");

    if (issues.length > 0) {
      console.log("⚠️  Issues found:");
      issues.forEach((issue) => console.log(`   - ${issue}`));
      console.log("");
      console.log("📝 Next steps:");
      if (missingTables.length > 0) console.log("   1. Run: npm run db:setup");
      if (parseInt(adminCount.rows[0].count) === 0)
        console.log("   2. Register admin user at /register");
      if (parseInt(jobsCount.rows[0].count) === 0)
        console.log("   3. Run: node server/database/seed-jobs.js");
    } else {
      console.log("✅ Everything looks good!");
      console.log("");
      console.log("Your database is properly configured and ready to use.");
    }
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    console.error("");
    console.error("Troubleshooting:");
    console.error("  1. Check DATABASE_URL in .env");
    console.error("  2. Verify Railway database is running");
    console.error("  3. Run: npm run db:setup to create tables");
    console.error("");
    process.exit(1);
  }
}

verifyDatabase();
