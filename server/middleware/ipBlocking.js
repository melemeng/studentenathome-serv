/**
 * Automatic IP Blocking System
 *
 * Features:
 * - Automatic blocking after threshold violations
 * - Permanent and temporary blocks
 * - Whitelist for trusted IPs
 * - Block reason tracking
 * - Auto-expiration for temporary blocks
 */

// In-memory storage (in production, use Redis or database)
const blockedIPs = new Map();
const whitelistedIPs = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

// Violation tracking
const violationTracker = new Map();

// Configuration
const config = {
  // Thresholds for auto-blocking
  maxFailedLogins: 5,
  maxRateLimitViolations: 10,
  maxCSRFViolations: 3,

  // Block durations (in milliseconds)
  tempBlockDuration: 60 * 60 * 1000, // 1 hour
  permanentBlockThreshold: 3, // 3 temp blocks = permanent

  // Violation window
  violationWindow: 15 * 60 * 1000, // 15 minutes
};

/**
 * Record a violation for an IP
 */
export function recordViolation(ip, type, details = {}) {
  if (whitelistedIPs.has(ip)) {
    return;
  }

  const now = Date.now();

  if (!violationTracker.has(ip)) {
    violationTracker.set(ip, {
      violations: [],
      tempBlockCount: 0,
    });
  }

  const tracker = violationTracker.get(ip);

  // Clean old violations outside window
  tracker.violations = tracker.violations.filter(
    (v) => now - v.timestamp < config.violationWindow
  );

  // Add new violation
  tracker.violations.push({
    type,
    timestamp: now,
    details,
  });

  // Check if blocking is needed
  checkAndBlock(ip, tracker);
}

/**
 * Check if IP should be blocked based on violations
 */
function checkAndBlock(ip, tracker) {
  const violations = tracker.violations;

  // Count violations by type
  const counts = {
    failedLogin: violations.filter((v) => v.type === "failedLogin").length,
    rateLimit: violations.filter((v) => v.type === "rateLimit").length,
    csrf: violations.filter((v) => v.type === "csrf").length,
  };

  let shouldBlock = false;
  let reason = "";

  // Check thresholds
  if (counts.failedLogin >= config.maxFailedLogins) {
    shouldBlock = true;
    reason = `Too many failed login attempts (${counts.failedLogin})`;
  } else if (counts.rateLimit >= config.maxRateLimitViolations) {
    shouldBlock = true;
    reason = `Excessive rate limit violations (${counts.rateLimit})`;
  } else if (counts.csrf >= config.maxCSRFViolations) {
    shouldBlock = true;
    reason = `CSRF token violations (${counts.csrf})`;
  }

  if (shouldBlock) {
    // Check if should be permanent
    const isPermanent =
      tracker.tempBlockCount >= config.permanentBlockThreshold;

    if (!isPermanent) {
      tracker.tempBlockCount++;
    }

    blockIP(ip, reason, isPermanent);
  }
}

/**
 * Block an IP address
 */
export function blockIP(ip, reason, permanent = false) {
  if (whitelistedIPs.has(ip)) {
    console.warn(`Cannot block whitelisted IP: ${ip}`);
    return;
  }

  const now = Date.now();
  const expiresAt = permanent ? null : now + config.tempBlockDuration;

  blockedIPs.set(ip, {
    blockedAt: now,
    expiresAt,
    reason,
    permanent,
  });

  console.log(
    `🚫 IP blocked: ${ip} | Reason: ${reason} | ${
      permanent
        ? "PERMANENT"
        : `Expires in ${config.tempBlockDuration / 1000 / 60} minutes`
    }`
  );
}

/**
 * Unblock an IP address
 */
export function unblockIP(ip) {
  const wasBlocked = blockedIPs.has(ip);
  blockedIPs.delete(ip);

  // Reset violation tracker
  violationTracker.delete(ip);

  if (wasBlocked) {
    console.log(`✅ IP unblocked: ${ip}`);
  }

  return wasBlocked;
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip) {
  if (whitelistedIPs.has(ip)) {
    return false;
  }

  const block = blockedIPs.get(ip);

  if (!block) {
    return false;
  }

  // Check if temporary block expired
  if (!block.permanent && block.expiresAt && Date.now() > block.expiresAt) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
}

/**
 * Get block details for an IP
 */
export function getBlockDetails(ip) {
  return blockedIPs.get(ip) || null;
}

/**
 * Middleware to check if IP is blocked
 */
export function checkIPBlock(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  if (isIPBlocked(ip)) {
    const block = getBlockDetails(ip);
    const message = block.permanent
      ? "Your IP has been permanently blocked"
      : "Your IP has been temporarily blocked";

    return res.status(403).json({
      error: message,
      code: "IP_BLOCKED",
      reason: block.reason,
      expiresAt: block.expiresAt,
      permanent: block.permanent,
    });
  }

  next();
}

/**
 * Add IP to whitelist
 */
export function whitelistIP(ip) {
  whitelistedIPs.add(ip);
  // Remove from blocked list if present
  blockedIPs.delete(ip);
  console.log(`✅ IP whitelisted: ${ip}`);
}

/**
 * Remove IP from whitelist
 */
export function removeFromWhitelist(ip) {
  whitelistedIPs.delete(ip);
  console.log(`⚠️ IP removed from whitelist: ${ip}`);
}

/**
 * Get all blocked IPs
 */
export function getAllBlockedIPs() {
  const now = Date.now();
  const blocked = [];

  for (const [ip, block] of blockedIPs.entries()) {
    // Skip expired temporary blocks
    if (!block.permanent && block.expiresAt && now > block.expiresAt) {
      blockedIPs.delete(ip);
      continue;
    }

    blocked.push({
      ip,
      ...block,
      remainingTime: block.permanent
        ? null
        : Math.max(0, block.expiresAt - now),
    });
  }

  return blocked;
}

/**
 * Get violation statistics for an IP
 */
export function getIPViolations(ip) {
  return violationTracker.get(ip) || { violations: [], tempBlockCount: 0 };
}

/**
 * Cleanup expired blocks periodically
 */
function cleanupExpiredBlocks() {
  const now = Date.now();
  let cleaned = 0;

  for (const [ip, block] of blockedIPs.entries()) {
    if (!block.permanent && block.expiresAt && now > block.expiresAt) {
      blockedIPs.delete(ip);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired IP blocks`);
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredBlocks, 10 * 60 * 1000);

export default {
  recordViolation,
  blockIP,
  unblockIP,
  isIPBlocked,
  getBlockDetails,
  checkIPBlock,
  whitelistIP,
  removeFromWhitelist,
  getAllBlockedIPs,
  getIPViolations,
};
