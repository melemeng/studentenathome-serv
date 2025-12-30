#!/usr/bin/env node

import { initializeDatabase, db } from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

async function migrateData() {
  try {
    console.log("🚀 Starting data migration...\n");

    // Initialize database schema
    await initializeDatabase();

    // Migrate users
    if (fs.existsSync(USERS_FILE)) {
      console.log("📥 Migrating users...");
      const usersData = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

      for (const user of usersData) {
        try {
          await db.createUser({
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
            verificationToken: user.verificationToken || null,
            verificationExpiry: user.verificationExpiry || null,
          });
          console.log(`  ✅ Migrated user: ${user.email}`);
        } catch (error) {
          if (error.code === "23505") {
            console.log(`  ⚠️  User already exists: ${user.email}`);
          } else {
            console.error(
              `  ❌ Error migrating user ${user.email}:`,
              error.message
            );
          }
        }
      }
      console.log(`\n✅ Users migration complete\n`);
    } else {
      console.log("⚠️  No users.json file found, skipping users migration\n");
    }

    // Migrate posts
    if (fs.existsSync(POSTS_FILE)) {
      console.log("📥 Migrating posts...");
      const postsData = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8"));

      for (const post of postsData) {
        try {
          await db.createPost({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            author: post.author,
            date: post.date,
            readTime: post.readTime || "5 Min",
            status: post.status || "pending",
          });
          console.log(`  ✅ Migrated post: ${post.title}`);
        } catch (error) {
          if (error.code === "23505") {
            console.log(`  ⚠️  Post already exists: ${post.title}`);
          } else {
            console.error(
              `  ❌ Error migrating post ${post.title}:`,
              error.message
            );
          }
        }
      }
      console.log(`\n✅ Posts migration complete\n`);
    } else {
      console.log("⚠️  No posts.json file found, skipping posts migration\n");
    }

    console.log("🎉 Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Backup your JSON files (server/data/*.json)");
    console.log("2. Update server/index.js to use database instead of JSON");
    console.log("3. Test your application thoroughly");
    console.log("4. Remove JSON files once everything works\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateData();
