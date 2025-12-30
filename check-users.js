import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres123@localhost:5432/studentenathome",
  ssl: false,
});

async function checkUsers() {
  try {
    console.log("📊 Überprüfe Benutzer in der Datenbank...\n");

    // Check users table
    const usersResult = await pool.query(
      "SELECT id, email, name, is_verified, is_admin, is_locked, failed_login_attempts, last_login_at, created_at FROM users ORDER BY created_at DESC"
    );

    console.log(`👥 Registrierte Benutzer (${usersResult.rows.length}):`);
    console.log("─".repeat(100));
    usersResult.rows.forEach((user) => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Verifiziert: ${user.is_verified ? "✅ Ja" : "❌ Nein"}`);
      console.log(`   Admin: ${user.is_admin ? "✅ Ja" : "❌ Nein"}`);
      console.log(`   Gesperrt: ${user.is_locked ? "🔒 Ja" : "✅ Nein"}`);
      console.log(
        `   Fehlgeschlagene Login-Versuche: ${user.failed_login_attempts}`
      );
      console.log(
        `   Letzter Login: ${
          user.last_login_at
            ? new Date(user.last_login_at).toLocaleString("de-DE")
            : "Noch nie"
        }`
      );
      console.log(
        `   Registriert: ${new Date(user.created_at).toLocaleString("de-DE")}`
      );
      console.log("─".repeat(100));
    });

    // Check audit log for login events
    console.log("\n📝 Login-Events im Audit-Log:");
    console.log("─".repeat(100));
    const auditResult = await pool.query(
      "SELECT a.action, a.ip_address, a.created_at, u.email FROM audit_log a JOIN users u ON a.user_id = u.id WHERE a.action IN ('user_login', 'user_logout', 'user_registered', 'email_verified') ORDER BY a.created_at DESC LIMIT 20"
    );

    auditResult.rows.forEach((event) => {
      const icon =
        event.action === "user_login"
          ? "🔓"
          : event.action === "user_logout"
          ? "🔒"
          : event.action === "user_registered"
          ? "📝"
          : "✅";
      console.log(
        `${icon} ${event.action.padEnd(20)} | ${event.email.padEnd(30)} | ${
          event.ip_address?.padEnd(15) || "N/A"
        } | ${new Date(event.created_at).toLocaleString("de-DE")}`
      );
    });
    console.log("─".repeat(100));

    // Check failed login attempts
    console.log("\n🚫 Fehlgeschlagene Login-Versuche:");
    console.log("─".repeat(100));
    const failedResult = await pool.query(
      "SELECT email, ip_address, attempted_at FROM failed_login_attempts ORDER BY attempted_at DESC LIMIT 10"
    );

    if (failedResult.rows.length === 0) {
      console.log("✅ Keine fehlgeschlagenen Login-Versuche");
    } else {
      failedResult.rows.forEach((attempt) => {
        console.log(
          `❌ ${attempt.email.padEnd(30)} | ${attempt.ip_address?.padEnd(
            15
          )} | ${new Date(attempt.attempted_at).toLocaleString("de-DE")}`
        );
      });
    }
    console.log("─".repeat(100));

    // Check revoked tokens
    console.log("\n🔐 Revozierte JWT-Tokens:");
    console.log("─".repeat(100));
    const revokedResult = await pool.query(
      "SELECT r.token_jti, r.revoked_at, r.expires_at, u.email FROM revoked_tokens r JOIN users u ON r.user_id = u.id ORDER BY r.revoked_at DESC LIMIT 10"
    );

    if (revokedResult.rows.length === 0) {
      console.log("✅ Keine revozierte Tokens (noch keine Logouts)");
    } else {
      revokedResult.rows.forEach((token) => {
        console.log(
          `🔒 ${token.email.padEnd(30)} | ${new Date(
            token.revoked_at
          ).toLocaleString("de-DE")}`
        );
      });
    }
    console.log("─".repeat(100));

    await pool.end();
    console.log("\n✅ Datenbank-Check abgeschlossen!\n");
  } catch (error) {
    console.error("❌ Fehler beim Überprüfen der Datenbank:", error);
    process.exit(1);
  }
}

checkUsers();
