# Login Security & Session Management

## Overview

The login system now implements secure session management with automatic expiration, token validation, and safe re-login functionality.

## Key Security Features

### 1. **Session Expiration**

- **Duration**: 24 hours (configurable via `SESSION_DURATION`)
- **Auto-expiry**: Sessions automatically expire and are cleared
- **Warning**: Users get a 5-minute warning before session expires
- **Re-login Required**: Expired sessions require full re-authentication

### 2. **Secure Token Management**

```typescript
interface AuthSession {
  email: string;
  token: string; // Base64 encoded token
  expiresAt: number; // Unix timestamp
  createdAt: number; // Unix timestamp
}
```

**Token Generation**:

- Unique per session
- Contains email, timestamp, and random string
- Base64 encoded for basic obfuscation
- **Production**: Should use JWT tokens from backend

### 3. **Auto-Login (Safe Re-login)**

When users revisit the site:

1. ✅ System checks for existing session in `localStorage`
2. ✅ Validates session hasn't expired
3. ✅ If valid: Auto-login with "Welcome back" message
4. ❌ If expired: Clear session and show expiry message
5. ❌ If invalid: Require fresh login

### 4. **Session Lifecycle**

```
User Login
    ↓
Generate Token + Set Expiry (24h)
    ↓
Save to localStorage
    ↓
Auto-check every 1 minute
    ↓
[Valid] → Continue
[<5min remaining] → Show warning + Extend option
[Expired] → Logout + Clear session
```

### 5. **Session Extension**

Users can extend their session:

- Click "Sitzung verlängern" button
- Generates new token with fresh 24-hour expiry
- No need to re-enter credentials
- Only available for valid sessions

## Security Improvements Over Previous Implementation

| Feature             | Before              | After                             |
| ------------------- | ------------------- | --------------------------------- |
| **Token Type**      | Static "demo-token" | Unique per-session token          |
| **Expiration**      | ❌ Never expires    | ✅ 24-hour auto-expiry            |
| **Re-login Check**  | ❌ No validation    | ✅ Validates on every page load   |
| **Session Warning** | ❌ No warning       | ✅ 5-minute warning before expiry |
| **Auto-logout**     | ❌ Manual only      | ✅ Automatic on expiry            |
| **Session Info**    | ❌ Not visible      | ✅ Shows expiry time & age        |
| **Extend Session**  | ❌ Not possible     | ✅ One-click extension            |
| **Multi-tab Sync**  | ⚠️ Partial          | ✅ Full sync via storage events   |

## Production Recommendations

### 🔒 Critical Security Improvements for Production

1. **Backend Authentication** - Replace demo login with real API
2. **Use HTTP-Only Cookies** - Store tokens securely (not localStorage)
3. **JWT Tokens** - Use signed tokens with expiration
4. **Refresh Tokens** - Short-lived access + long-lived refresh
5. **HTTPS Only** - Always use HTTPS in production
6. **Rate Limiting** - Limit login attempts
7. **Password Security** - Hash with bcrypt, enforce strong passwords
8. **CSRF Protection** - Use CSRF tokens for requests

## Usage Example

### Checking If User Is Logged In

```typescript
const sessionStr = localStorage.getItem("authSession");
if (sessionStr) {
  const session = JSON.parse(sessionStr);
  const isValid = Date.now() < session.expiresAt;

  if (!isValid) {
    localStorage.removeItem("authSession");
  }
}
```

See full documentation in code comments for detailed implementation.
