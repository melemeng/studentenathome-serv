/**
 * User-based Rate Limiting Middleware
 *
 * Tracks request rates per user (authenticated) or IP (unauthenticated)
 * More granular than IP-based limiting - prevents abuse by authenticated users
 */

// Store request counts per user/IP
const requestStore = new Map();

// Cleanup interval
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

/**
 * Configuration options for rate limiting
 */
const defaultOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Max requests per window
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  message: "Too many requests, please try again later",
};

/**
 * Get identifier for rate limiting
 * Uses user ID if authenticated, otherwise IP address
 */
function getIdentifier(req) {
  // Use user ID from JWT if authenticated
  if (req.user && req.user.id) {
    return `user:${req.user.id}`;
  }

  // Fall back to IP address
  return `ip:${req.ip || req.connection.remoteAddress}`;
}

/**
 * Get or create rate limit entry
 */
function getRateLimitEntry(identifier, windowMs) {
  const now = Date.now();
  let entry = requestStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + windowMs,
      startTime: now,
    };
    requestStore.set(identifier, entry);
  }

  return entry;
}

/**
 * Create user-based rate limiter middleware
 */
export function createUserRateLimiter(options = {}) {
  const config = { ...defaultOptions, ...options };

  return async (req, res, next) => {
    const identifier = getIdentifier(req);
    const entry = getRateLimitEntry(identifier, config.windowMs);

    // Increment request count
    entry.count++;

    // Calculate remaining requests and reset time
    const remaining = Math.max(0, config.maxRequests - entry.count);
    const resetTime = Math.ceil((entry.resetTime - Date.now()) / 1000);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", config.maxRequests);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetTime);

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      res.setHeader("Retry-After", resetTime);

      return res.status(429).json({
        error: config.message,
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: resetTime,
        limit: config.maxRequests,
      });
    }

    next();
  };
}

/**
 * Endpoint-specific rate limiters
 */

// Strict limiter for authentication endpoints (per user/IP)
export const authRateLimiter = createUserRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts
  message: "Too many authentication attempts, please try again later",
});

// API limiter for general API endpoints (per user)
export const apiRateLimiter = createUserRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests
  message: "API rate limit exceeded, please try again later",
});

// Strict limiter for blog post creation (authenticated users only)
export const postCreationRateLimiter = createUserRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 posts per hour
  message: "Too many posts created, please wait before creating more",
});

// Contact form limiter (per IP/user)
export const contactRateLimiter = createUserRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 submissions per hour
  message: "Too many contact form submissions, please try again later",
});

/**
 * Reset rate limit for a specific user (admin function)
 */
export function resetUserRateLimit(userId) {
  const identifier = `user:${userId}`;
  requestStore.delete(identifier);
}

/**
 * Get current rate limit status for a user
 */
export function getUserRateLimitStatus(userId, windowMs) {
  const identifier = `user:${userId}`;
  const entry = requestStore.get(identifier);

  if (!entry) {
    return {
      count: 0,
      remaining: Infinity,
      resetTime: null,
    };
  }

  const now = Date.now();
  if (now > entry.resetTime) {
    return {
      count: 0,
      remaining: Infinity,
      resetTime: null,
    };
  }

  return {
    count: entry.count,
    remaining: Math.max(0, defaultOptions.maxRequests - entry.count),
    resetTime: entry.resetTime,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Cleanup expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [identifier, entry] of requestStore.entries()) {
    if (now > entry.resetTime) {
      requestStore.delete(identifier);
    }
  }
}

// Run cleanup every interval
setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL);

export default {
  createUserRateLimiter,
  authRateLimiter,
  apiRateLimiter,
  postCreationRateLimiter,
  contactRateLimiter,
  resetUserRateLimit,
  getUserRateLimitStatus,
};
