# 🔐 Security Implementation Guide - StudentenAtHome

Complete documentation for all implemented security features.

---

## 📋 Overview

StudentenAtHome implements **enterprise-grade security** with the following features:

1. ✅ JWT Authentication with Token Revocation
2. ✅ CSRF Protection (Double-Submit-Cookie Pattern)
3. ✅ User-based Rate Limiting
4. ✅ Password Reset with Email Verification
5. ✅ Password Strength Meter
6. ✅ File Upload Security
7. ✅ Automated IP Blocking
8. ✅ Advanced Logging & Monitoring
9. ✅ Account Lockout (5 failed attempts)
10. ✅ Comprehensive Audit Logging

---

## 🔑 Authentication & Authorization

### JWT Token System

**Implementation:** `server/index.js` - `authenticateToken` middleware

**Features:**

- 24-hour token expiration
- Token revocation on logout
- Secure token storage in database
- Admin role checking

**Usage:**

```javascript
// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  // req.user contains: { id, email, name, isAdmin }
  res.json({ message: "Protected data", user: req.user });
});
```

### Account Lockout

**Trigger:** 5 failed login attempts  
**Duration:** Manual unlock required (contact support)  
**Database:** `users.is_locked` flag  
**Logging:** Failed attempts tracked in `failed_login_attempts` table

---

## 🛡️ CSRF Protection

**Implementation:** `server/middleware/csrf.js`

### How It Works

1. **Token Generation:**

   - 32-byte random hex token
   - Sent in `X-CSRF-Token` response header
   - Stored with 15-minute expiration

2. **Token Validation:**

   - Client sends token in `X-CSRF-Token` request header
   - Server validates and consumes (one-time use)
   - New token generated for next request

3. **Protected Methods:**
   - POST, PUT, PATCH, DELETE
   - GET, HEAD, OPTIONS are exempt

### Frontend Integration

```typescript
import { fetchWithCsrf } from "@/lib/csrf";

// Automatic CSRF token handling
const response = await fetchWithCsrf("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

---

## ⏱️ Rate Limiting

**Implementation:** `server/middleware/userRateLimit.js`

### Limiter Types

| Limiter                   | Window | Max Requests | Applied To                      |
| ------------------------- | ------ | ------------ | ------------------------------- |
| `authRateLimiter`         | 15 min | 5            | Login, Register, Password Reset |
| `apiRateLimiter`          | 15 min | 100          | General API endpoints           |
| `postCreationRateLimiter` | 1 hour | 10           | Blog post creation              |
| `contactRateLimiter`      | 1 hour | 3            | Contact form                    |

### Response Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 847 (seconds)
```

### Identifier Strategy

- **Authenticated Users:** Uses `user.id` from JWT
- **Anonymous Users:** Uses IP address
- Format: `user:uuid` or `ip:192.168.1.1`

---

## 🔐 Password Reset Flow

**Endpoints:**

- `POST /api/auth/request-password-reset` - Request reset link
- `POST /api/auth/reset-password` - Submit new password

### Process

1. **Request Reset:**

   - User enters email
   - Token generated (32-byte hex)
   - Email sent with reset link
   - Token valid for 1 hour

2. **Reset Password:**
   - User clicks link with token
   - Enters new password (validated for strength)
   - Max 3 reset attempts per token
   - Success email sent

### Security Features

- ✅ Token expiration (1 hour)
- ✅ Attempt limiting (3 tries)
- ✅ Password strength validation (min score 2/4)
- ✅ Account lockout check
- ✅ Audit logging
- ✅ Confirmation emails

---

## 📁 File Upload Security

**Implementation:** `server/middleware/fileUpload.js`

### Validation Rules

**File Types (Whitelist):**

```javascript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
```

**Constraints:**

- Max file size: 5 MB
- Image dimensions: Max 4000x4000px
- Filename sanitization (remove special chars)
- Magic number validation (not just extension)

### Upload Flow

1. **File Validation:**

   - Check MIME type
   - Verify magic numbers
   - Validate dimensions
   - Sanitize filename

2. **Metadata Extraction:**

   ```javascript
   {
     width: 1920,
     height: 1080,
     format: "jpeg",
     size: 524288
   }
   ```

3. **Storage:**

   - Unique filename: `{timestamp}-{random}-{original}`
   - Directory: `uploads/blog-images/`
   - Permissions: 644

4. **Audit Logging:**
   - User ID
   - Filename
   - File size
   - IP address
   - Timestamp

### Endpoints

```javascript
// Upload
POST /api/upload/blog-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

// Delete
DELETE /api/upload/blog-image/:filename
Authorization: Bearer {token}
```

---

## 🚫 IP Blocking Automation

**Implementation:** `server/middleware/ipBlocking.js`

### Violation Tracking

**Violation Types:**

- `failedLogin` - Wrong credentials
- `rateLimitExceeded` - Too many requests
- `csrfViolation` - Invalid CSRF token
- `suspiciousActivity` - Pattern detection

**Thresholds:**

| Violation Type | Max Count | Window  | Action         |
| -------------- | --------- | ------- | -------------- |
| Failed Login   | 10        | 15 min  | Block 1 hour   |
| Rate Limit     | 5         | 15 min  | Block 1 hour   |
| CSRF           | 3         | 15 min  | Block 24 hours |
| Suspicious     | 1         | Instant | Block 24 hours |

### Block Types

1. **Temporary Block:**

   - Duration: 1-24 hours
   - Automatic unblock
   - Warning on next attempt

2. **Permanent Block:**
   - Manual unblock only
   - Admin review required
   - Logged in security log

### Admin Management

```javascript
// Get blocked IPs
GET /api/admin/blocked-ips
Authorization: Bearer {admin-token}

// Unblock IP
POST /api/admin/unblock-ip
Body: { ip: "192.168.1.1" }

// Block IP manually
POST /api/admin/block-ip
Body: {
  ip: "192.168.1.1",
  reason: "Manual block",
  permanent: false
}
```

---

## 📊 Advanced Logging

**Implementation:** `server/middleware/logger.js`

### Log Levels

| Level     | Usage               | Example                             |
| --------- | ------------------- | ----------------------------------- |
| **error** | Application errors  | `Database connection failed`        |
| **warn**  | Warning conditions  | `Rate limit approaching`            |
| **info**  | General information | `User registered: test@example.com` |
| **http**  | HTTP requests       | `POST /api/auth/login 200 45ms`     |
| **debug** | Debug information   | `JWT token validated`               |

### Log Files

```
logs/
├── app-{date}.log         # All logs (info+)
├── error-{date}.log       # Errors only
├── security-{date}.log    # Security events
├── combined-{date}.log    # Complete audit trail
└── archive/               # Compressed old logs
    └── app-2025-12-29.log.gz
```

### Security Events Logged

✅ Login attempts (success/failure)  
✅ Registration  
✅ Email verification  
✅ Password resets  
✅ File uploads/deletions  
✅ IP blocks/unblocks  
✅ CSRF violations  
✅ Rate limit exceeded  
✅ Permission denied

### Viewing Logs

**List all logs:**

```bash
npm run logs:view list
```

**View specific log:**

```bash
npm run logs:view view app-2025-12-30.log
```

**Tail recent entries:**

```bash
npm run logs:tail app-2025-12-30.log 50
```

**Search logs:**

```bash
node server/view-logs.js search security-2025-12-30.log "failed login"
```

**Filter by level:**

```bash
node server/view-logs.js filter app-2025-12-30.log error
```

### Log Rotation

**Automatic rotation:**

```bash
npm run logs:rotate
```

**Cron setup (daily at midnight):**

```bash
0 0 * * * cd /path/to/project && npm run logs:rotate
```

**Rotation rules:**

- Logs older than 7 days: Compressed to `.gz`
- Logs older than 30 days: Deleted
- Archive stored in `logs/archive/`

---

## 🔍 Audit Logging

**Database:** `audit_log` table

### Tracked Actions

- `user_registered`
- `user_login`
- `user_logout`
- `email_verified`
- `password_reset_requested`
- `password_reset_completed`
- `file_uploaded`
- `file_deleted`
- `ip_blocked`
- `ip_unblocked`

### Audit Entry Structure

```javascript
{
  user_id: "uuid",
  action: "user_login",
  ip_address: "192.168.1.1",
  user_agent: "Mozilla/5.0...",
  details: {
    email: "user@example.com",
    // Additional context
  },
  created_at: "2025-12-30T10:30:00Z"
}
```

### Querying Audit Log

```sql
-- Recent logins
SELECT * FROM audit_log
WHERE action = 'user_login'
ORDER BY created_at DESC
LIMIT 50;

-- User activity
SELECT * FROM audit_log
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;

-- Security events
SELECT * FROM audit_log
WHERE action IN ('password_reset_requested', 'ip_blocked', 'email_verified')
ORDER BY created_at DESC;
```

---

## 🔧 Production Configuration

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-64-char-hex-secret
ADMIN_TOKEN=your-admin-token

# SMTP (for emails)
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=noreply@studentenathome.de
SMTP_PASS=your-smtp-password

# App
NODE_ENV=production
PORT=5000
CANONICAL_BASE_URL=https://studentenathome.de
```

### Nginx Configuration

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

server {
    listen 443 ssl http2;
    server_name studentenathome.de;

    # SSL
    ssl_certificate /etc/letsencrypt/live/studentenathome.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/studentenathome.de/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # API proxy
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Auth endpoints - stricter limit
    location ~ ^/api/auth/(login|register) {
        limit_req zone=auth burst=3 nodelay;
        proxy_pass http://localhost:5000;
        # ... same proxy settings
    }
}
```

---

## 🧪 Testing Security Features

### Manual Tests

**1. Account Lockout:**

```bash
# Attempt 5 failed logins
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# 6th attempt should return locked status
```

**2. Rate Limiting:**

```bash
# Exceed rate limit
for i in {1..101}; do
  curl http://localhost:5000/api/posts
done
# Should return 429 Too Many Requests
```

**3. CSRF Protection:**

```bash
# Request without CSRF token
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","message":"Test"}'
# Should return 403 CSRF token missing
```

**4. File Upload:**

```bash
# Upload non-image file
curl -X POST http://localhost:5000/api/upload/blog-image \
  -H "Authorization: Bearer {token}" \
  -F "image=@script.sh"
# Should return 400 Invalid file type
```

### Automated Tests

See `test-security.js` for comprehensive security test suite.

---

## 📈 Monitoring & Alerts

### Key Metrics to Monitor

1. **Failed Login Rate**

   - Alert threshold: >50/hour
   - Action: Review for attack patterns

2. **IP Blocks**

   - Alert threshold: >10/hour
   - Action: Check for DDoS

3. **File Upload Failures**

   - Alert threshold: >5/hour
   - Action: Review upload attempts

4. **Rate Limit Hits**
   - Alert threshold: >100/hour
   - Action: Adjust limits or investigate

### Health Check Endpoint

```javascript
GET /api/health

Response:
{
  "status": "healthy",
  "uptime": 86400,
  "database": "connected",
  "blockedIPs": 5,
  "activeUsers": 42
}
```

---

## 🚨 Incident Response

### Security Breach Protocol

1. **Immediate Actions:**

   - Block suspicious IPs
   - Revoke compromised JWT tokens
   - Change admin credentials
   - Enable maintenance mode if needed

2. **Investigation:**

   - Review audit logs
   - Check security logs
   - Identify attack vector
   - Assess damage

3. **Recovery:**

   - Patch vulnerabilities
   - Reset affected accounts
   - Notify users if data exposed
   - Document incident

4. **Prevention:**
   - Update security rules
   - Add new monitoring
   - Train team
   - Review policies

---

## 📞 Support & Maintenance

**Security Contact:** security@studentenathome.de  
**Documentation:** This file  
**Log Issues:** GitHub Issues  
**Emergency:** +49 176 75444136

---

**Last Updated:** December 30, 2025  
**Version:** 2.0.0  
**Maintained by:** StudentenAtHome Security Team
