/**
 * Advanced Logging System with Winston
 *
 * Features:
 * - Multiple log levels (error, warn, info, debug)
 * - Separate files for different log levels
 * - Console output in development
 * - Log rotation (daily)
 * - Structured logging with metadata
 * - Request/Response logging
 * - Error stack traces
 */

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json, printf, colorize } = format;

// Log directory
const LOG_DIR = "./logs";

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  return msg;
});

/**
 * Create Winston logger
 */
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: {
    service: "studentenathome-api",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    // Error log - only errors
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "30d",
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),

    // Combined log - all levels
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: combine(timestamp(), json()),
    }),

    // Security log - authentication, authorization, violations
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "security-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "warn",
      maxSize: "20m",
      maxFiles: "90d", // Keep security logs longer
      format: combine(timestamp(), json()),
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    })
  );
}

/**
 * Log levels:
 * - error: Error events
 * - warn: Warning events (security, deprecation)
 * - info: Important informational messages
 * - debug: Detailed debug information
 */

/**
 * Security-specific logger
 */
export const securityLogger = {
  loginAttempt: (email, ip, success) => {
    logger.warn("Login attempt", {
      event: "login_attempt",
      email,
      ip,
      success,
      timestamp: new Date().toISOString(),
    });
  },

  failedLogin: (email, ip, reason) => {
    logger.warn("Failed login", {
      event: "failed_login",
      email,
      ip,
      reason,
      timestamp: new Date().toISOString(),
    });
  },

  ipBlocked: (ip, reason, permanent) => {
    logger.warn("IP blocked", {
      event: "ip_blocked",
      ip,
      reason,
      permanent,
      timestamp: new Date().toISOString(),
    });
  },

  csrfViolation: (ip, path) => {
    logger.warn("CSRF violation", {
      event: "csrf_violation",
      ip,
      path,
      timestamp: new Date().toISOString(),
    });
  },

  rateLimitExceeded: (ip, endpoint, userId) => {
    logger.warn("Rate limit exceeded", {
      event: "rate_limit_exceeded",
      ip,
      endpoint,
      userId,
      timestamp: new Date().toISOString(),
    });
  },

  unauthorizedAccess: (ip, path, userId) => {
    logger.warn("Unauthorized access attempt", {
      event: "unauthorized_access",
      ip,
      path,
      userId,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Request logging middleware
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    userId: req.user?.id,
  });

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? "warn" : "info";

    logger.log(level, "Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id,
    });
  });

  next();
}

/**
 * Error logging middleware
 */
export function errorLogger(err, req, res, next) {
  logger.error("Request error", {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    request: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userId: req.user?.id,
    },
  });

  next(err);
}

/**
 * Database query logger
 */
export const dbLogger = {
  query: (query, duration) => {
    logger.debug("Database query", {
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
    });
  },

  error: (query, error) => {
    logger.error("Database error", {
      query: query.substring(0, 200),
      error: {
        message: error.message,
        code: error.code,
      },
    });
  },
};

/**
 * Performance monitoring
 */
export const performanceLogger = {
  slow: (operation, duration, threshold = 1000) => {
    if (duration > threshold) {
      logger.warn("Slow operation detected", {
        operation,
        duration: `${duration}ms`,
        threshold: `${threshold}ms`,
      });
    }
  },
};

/**
 * Business event logger
 */
export const eventLogger = {
  userRegistered: (userId, email) => {
    logger.info("User registered", {
      event: "user_registered",
      userId,
      email,
    });
  },

  postCreated: (postId, userId, title) => {
    logger.info("Post created", {
      event: "post_created",
      postId,
      userId,
      title,
    });
  },

  fileUploaded: (filename, userId, size) => {
    logger.info("File uploaded", {
      event: "file_uploaded",
      filename,
      userId,
      size,
    });
  },

  emailSent: (to, subject, success) => {
    logger.info("Email sent", {
      event: "email_sent",
      to,
      subject,
      success,
    });
  },
};

export default logger;
