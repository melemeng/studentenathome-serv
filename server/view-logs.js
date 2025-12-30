#!/usr/bin/env node

/**
 * Log Viewer Tool
 * Displays logs in a user-friendly format with filtering options
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, "../logs");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function getLevelColor(level) {
  const levelColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue",
  };
  return levelColors[level] || "gray";
}

function formatLog(line) {
  try {
    const log = JSON.parse(line);
    const timestamp = colorize(log.timestamp, "gray");
    const level = colorize(
      log.level.toUpperCase().padEnd(7),
      getLevelColor(log.level)
    );
    const message = colorize(log.message, "bright");

    let output = `${timestamp} ${level} ${message}`;

    // Add metadata if present
    if (log.ip) output += colorize(` | IP: ${log.ip}`, "cyan");
    if (log.userId) output += colorize(` | User: ${log.userId}`, "magenta");
    if (log.email) output += colorize(` | Email: ${log.email}`, "blue");
    if (log.duration) output += colorize(` | ${log.duration}ms`, "yellow");

    // Add stack trace for errors
    if (log.stack) {
      output += `\n${colorize(log.stack, "red")}`;
    }

    return output;
  } catch (e) {
    return line;
  }
}

function viewLogs(logFile, options = {}) {
  const filePath = path.join(LOG_DIR, logFile);

  if (!fs.existsSync(filePath)) {
    console.error(colorize(`❌ Log file not found: ${logFile}`, "red"));
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter(Boolean);

  console.log(
    colorize(`\n📋 Viewing: ${logFile} (${lines.length} entries)\n`, "bright")
  );
  console.log(colorize("=".repeat(100), "gray"));

  let filtered = lines;

  // Filter by level
  if (options.level) {
    filtered = filtered.filter((line) => {
      try {
        const log = JSON.parse(line);
        return log.level === options.level;
      } catch {
        return false;
      }
    });
  }

  // Filter by search term
  if (options.search) {
    filtered = filtered.filter((line) =>
      line.toLowerCase().includes(options.search.toLowerCase())
    );
  }

  // Limit output
  const limit = options.limit || 50;
  const displayed = options.tail
    ? filtered.slice(-limit)
    : filtered.slice(0, limit);

  displayed.forEach((line) => {
    console.log(formatLog(line));
  });

  console.log(colorize("\n" + "=".repeat(100), "gray"));
  console.log(
    colorize(
      `\n📊 Showing ${displayed.length} of ${filtered.length} entries\n`,
      "bright"
    )
  );
}

function listLogFiles() {
  if (!fs.existsSync(LOG_DIR)) {
    console.error(colorize("❌ Logs directory not found", "red"));
    return;
  }

  const files = fs.readdirSync(LOG_DIR).filter((f) => f.endsWith(".log"));

  console.log(colorize("\n📁 Available Log Files:\n", "bright"));

  files.forEach((file) => {
    const stats = fs.statSync(path.join(LOG_DIR, file));
    const size = (stats.size / 1024).toFixed(2);
    const modified = stats.mtime.toLocaleString();

    console.log(
      `  ${colorize("•", "blue")} ${colorize(
        file.padEnd(25),
        "cyan"
      )} ${colorize(`${size} KB`, "yellow")} ${colorize(
        `(${modified})`,
        "gray"
      )}`
    );
  });

  console.log();
}

function tailLogs(logFile, lines = 20) {
  const filePath = path.join(LOG_DIR, logFile);

  if (!fs.existsSync(filePath)) {
    console.error(colorize(`❌ Log file not found: ${logFile}`, "red"));
    return;
  }

  console.log(
    colorize(`\n👀 Tailing: ${logFile} (last ${lines} entries)\n`, "bright")
  );
  console.log(colorize("=".repeat(100), "gray"));

  const content = fs.readFileSync(filePath, "utf-8");
  const allLines = content.split("\n").filter(Boolean);
  const lastLines = allLines.slice(-lines);

  lastLines.forEach((line) => {
    console.log(formatLog(line));
  });

  console.log(colorize("\n" + "=".repeat(100), "gray"));
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

if (
  !command ||
  command === "help" ||
  command === "-h" ||
  command === "--help"
) {
  console.log(colorize("\n🔍 Log Viewer Tool - StudentenAtHome\n", "bright"));
  console.log("Usage:");
  console.log(
    `  ${colorize(
      "node view-logs.js list",
      "cyan"
    )}                          - List all log files`
  );
  console.log(
    `  ${colorize(
      "node view-logs.js view <file>",
      "cyan"
    )}                   - View log file`
  );
  console.log(
    `  ${colorize(
      "node view-logs.js tail <file> [lines]",
      "cyan"
    )}          - Tail last N lines`
  );
  console.log(
    `  ${colorize(
      "node view-logs.js search <file> <term>",
      "cyan"
    )}         - Search in logs`
  );
  console.log(
    `  ${colorize(
      "node view-logs.js filter <file> <level>",
      "cyan"
    )}        - Filter by level\n`
  );

  console.log("Examples:");
  console.log(`  ${colorize("node view-logs.js list", "gray")}`);
  console.log(
    `  ${colorize("node view-logs.js view app-2025-12-30.log", "gray")}`
  );
  console.log(
    `  ${colorize("node view-logs.js tail error-2025-12-30.log 50", "gray")}`
  );
  console.log(
    `  ${colorize(
      "node view-logs.js search security-2025-12-30.log 'login'",
      "gray"
    )}`
  );
  console.log(
    `  ${colorize(
      "node view-logs.js filter app-2025-12-30.log error",
      "gray"
    )}\n`
  );
  process.exit(0);
}

switch (command) {
  case "list":
    listLogFiles();
    break;

  case "view":
    if (!args[1]) {
      console.error(colorize("❌ Please specify a log file", "red"));
      process.exit(1);
    }
    viewLogs(args[1]);
    break;

  case "tail":
    if (!args[1]) {
      console.error(colorize("❌ Please specify a log file", "red"));
      process.exit(1);
    }
    tailLogs(args[1], parseInt(args[2]) || 20);
    break;

  case "search":
    if (!args[1] || !args[2]) {
      console.error(
        colorize("❌ Please specify log file and search term", "red")
      );
      process.exit(1);
    }
    viewLogs(args[1], { search: args[2], limit: 100 });
    break;

  case "filter":
    if (!args[1] || !args[2]) {
      console.error(
        colorize(
          "❌ Please specify log file and level (error/warn/info)",
          "red"
        )
      );
      process.exit(1);
    }
    viewLogs(args[1], { level: args[2], limit: 100 });
    break;

  default:
    console.error(colorize(`❌ Unknown command: ${command}`, "red"));
    console.log(colorize("Run 'node view-logs.js help' for usage", "gray"));
    process.exit(1);
}
