/**
 * CSRF Protection Middleware using Double-Submit Cookie Pattern
 *
 * How it works:
 * 1. Generate a CSRF token and send it in response header
 * 2. Client stores token and sends it back in X-CSRF-Token header
 * 3. Server validates that the token matches
 *
 * This protects against CSRF attacks because:
 * - Attacker sites can't read the token (Same-Origin Policy)
 * - Attacker sites can't set custom headers (CORS)
 */

import crypto from "crypto";

// Store active CSRF tokens (in production, use Redis)
const csrfTokenStore = new Map();

// Token expiration time (15 minutes)
const TOKEN_EXPIRY = 15 * 60 * 1000;

/**
 * Generate a new CSRF token
 */
export function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Store a CSRF token with expiration
 */
function storeToken(token) {
  const expiresAt = Date.now() + TOKEN_EXPIRY;
  csrfTokenStore.set(token, expiresAt);

  // Cleanup expired tokens periodically
  if (csrfTokenStore.size > 10000) {
    cleanupExpiredTokens();
  }
}

/**
 * Verify a CSRF token
 */
function verifyToken(token) {
  if (!token) return false;

  const expiresAt = csrfTokenStore.get(token);
  if (!expiresAt) return false;

  // Check if token expired
  if (Date.now() > expiresAt) {
    csrfTokenStore.delete(token);
    return false;
  }

  return true;
}

/**
 * Remove a used token (one-time use)
 */
function consumeToken(token) {
  csrfTokenStore.delete(token);
}

/**
 * Cleanup expired tokens
 */
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, expiresAt] of csrfTokenStore.entries()) {
    if (now > expiresAt) {
      csrfTokenStore.delete(token);
    }
  }
}

/**
 * Middleware to generate and attach CSRF token
 * Use on routes that return forms or need CSRF protection
 */
export function attachCsrfToken(req, res, next) {
  // Generate new token
  const token = generateCsrfToken();
  storeToken(token);

  // Attach to response header
  res.setHeader("X-CSRF-Token", token);

  // Also make available in req for rendering
  req.csrfToken = token;

  next();
}

/**
 * Middleware to verify CSRF token
 * Use on state-changing routes (POST, PUT, DELETE, PATCH)
 */
export function verifyCsrfToken(req, res, next) {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Get token from header
  const token = req.headers["x-csrf-token"];

  if (!token) {
    return res.status(403).json({
      error: "CSRF token missing",
      code: "CSRF_MISSING",
    });
  }

  // Verify token
  if (!verifyToken(token)) {
    return res.status(403).json({
      error: "Invalid or expired CSRF token",
      code: "CSRF_INVALID",
    });
  }

  // Token is valid, consume it (one-time use)
  consumeToken(token);

  // Generate new token for next request
  const newToken = generateCsrfToken();
  storeToken(newToken);
  res.setHeader("X-CSRF-Token", newToken);

  next();
}

/**
 * Simplified CSRF middleware for JWT-based APIs
 * Uses custom header check (SameSite cookies + custom header)
 */
export function csrfProtectionSimple(req, res, next) {
  // Skip for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Check for custom header (browsers won't send this in CSRF attacks)
  const customHeader = req.headers["x-requested-with"];

  if (customHeader !== "XMLHttpRequest") {
    return res.status(403).json({
      error: "Invalid request origin",
      code: "CSRF_INVALID",
    });
  }

  next();
}

// Cleanup interval (every 5 minutes)
setInterval(cleanupExpiredTokens, 5 * 60 * 1000);

export default {
  generateCsrfToken,
  attachCsrfToken,
  verifyCsrfToken,
  csrfProtectionSimple,
};
