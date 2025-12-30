#!/usr/bin/env node

/**
 * Log Rotation Script
 * Archives old logs and cleans up disk space
 * Run daily via cron: 0 0 * * * node server/rotate-logs.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createGzip } from "zlib";
import { pipeline } from "stream";
import { promisify } from "util";

const pipe = promisify(pipeline);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, "../logs");
const ARCHIVE_DIR = path.join(LOG_DIR, "archive");
const MAX_AGE_DAYS = 30; // Delete logs older than 30 days
const COMPRESS_AGE_DAYS = 7; // Compress logs older than 7 days

// Ensure archive directory exists
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

async function compressFile(sourceFile, destFile) {
  const source = fs.createReadStream(sourceFile);
  const destination = fs.createWriteStream(destFile);
  const gzip = createGzip();

  await pipe(source, gzip, destination);
}

function getFileAge(filePath) {
  const stats = fs.statSync(filePath);
  const ageMs = Date.now() - stats.mtime.getTime();
  return ageMs / (1000 * 60 * 60 * 24); // Convert to days
}

async function rotateLog(logFile) {
  const filePath = path.join(LOG_DIR, logFile);
  const age = getFileAge(filePath);

  // Delete very old logs
  if (age > MAX_AGE_DAYS) {
    console.log(
      `🗑️  Deleting old log: ${logFile} (${age.toFixed(1)} days old)`
    );
    fs.unlinkSync(filePath);
    return "deleted";
  }

  // Compress old logs
  if (age > COMPRESS_AGE_DAYS && !logFile.endsWith(".gz")) {
    const archivePath = path.join(ARCHIVE_DIR, `${logFile}.gz`);

    if (fs.existsSync(archivePath)) {
      console.log(`⏭️  Skipping ${logFile} - already compressed`);
      return "skipped";
    }

    console.log(`📦 Compressing: ${logFile} (${age.toFixed(1)} days old)`);

    try {
      await compressFile(filePath, archivePath);

      // Verify compressed file exists and has content
      const stats = fs.statSync(archivePath);
      if (stats.size > 0) {
        fs.unlinkSync(filePath);
        console.log(`✅ Compressed and removed original: ${logFile}`);
        return "compressed";
      } else {
        fs.unlinkSync(archivePath);
        console.error(`❌ Compression failed: ${logFile}`);
        return "failed";
      }
    } catch (error) {
      console.error(`❌ Error compressing ${logFile}:`, error.message);
      return "failed";
    }
  }

  return "active";
}

async function rotateAllLogs() {
  console.log("🔄 Starting log rotation...\n");

  if (!fs.existsSync(LOG_DIR)) {
    console.log("❌ Logs directory not found");
    return;
  }

  const files = fs
    .readdirSync(LOG_DIR)
    .filter((f) => f.endsWith(".log") && !f.includes("combined"));

  let stats = {
    deleted: 0,
    compressed: 0,
    skipped: 0,
    active: 0,
    failed: 0,
  };

  for (const file of files) {
    const result = await rotateLog(file);
    stats[result]++;
  }

  // Calculate disk space saved
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  const archiveFiles = fs.readdirSync(ARCHIVE_DIR);
  archiveFiles.forEach((file) => {
    const stats = fs.statSync(path.join(ARCHIVE_DIR, file));
    totalCompressedSize += stats.size;
  });

  console.log("\n" + "=".repeat(50));
  console.log("📊 Log Rotation Summary:");
  console.log("=".repeat(50));
  console.log(`✅ Active logs:      ${stats.active}`);
  console.log(`📦 Compressed:       ${stats.compressed}`);
  console.log(`⏭️  Skipped:          ${stats.skipped}`);
  console.log(`🗑️  Deleted:          ${stats.deleted}`);
  console.log(`❌ Failed:           ${stats.failed}`);
  console.log(
    `💾 Archive size:     ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`
  );
  console.log("=".repeat(50) + "\n");
}

// Run rotation
rotateAllLogs().catch((error) => {
  console.error("❌ Log rotation failed:", error);
  process.exit(1);
});
