# Admin Access Control Documentation

## Overview

The system now has a proper admin role system that restricts admin panel access to authorized users only.

## How It Works

### 1. Admin Email Whitelist

Only specific email addresses are granted admin privileges:

```typescript
const ADMIN_EMAILS = ["admin@studentenathome.de", "georgi@studentenathome.de"];
```

**To add more admins**, edit the `ADMIN_EMAILS` array in [src/components/pages/LoginPage.tsx](src/components/pages/LoginPage.tsx).

### 2. Session with Admin Flag

When a user logs in, the system checks if their email is in the admin whitelist:

```typescript
interface AuthSession {
  token: string;
  email: string;
  isAdmin: boolean; // ← Admin role flag
  createdAt: number;
  expiresAt: number;
}
```

### 3. Frontend Protection

- **LoginPage**: Automatically redirects admins to `/admin` and regular users to `/blog` after login
- **BlogPage**: Only shows "Admin-Panel" button to users with `isAdmin: true`
- **AdminPage**: Checks `session.isAdmin` on mount and redirects non-admins to `/blog` with an error message

### 4. Backend Protection

The backend verifies the admin token on all admin-only endpoints:

```javascript
// Only admins can create, approve, or delete posts
if (token !== ADMIN_TOKEN) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

## User Roles

### Regular User (Non-Admin)

- **Email**: Any email NOT in the whitelist (e.g., `demo@studentenathome.de`)
- **Can**:
  - Login and create sessions
  - Submit blog posts (status: "pending")
  - View approved blog posts
- **Cannot**:
  - Access `/admin` page
  - See "Admin-Panel" button
  - Approve, reject, or delete posts

### Admin User

- **Email**: Must be in `ADMIN_EMAILS` whitelist (e.g., `admin@studentenathome.de`)
- **Can**:
  - Everything a regular user can do
  - Access `/admin` page
  - View all posts (pending, approved, rejected)
  - Approve or reject pending posts
  - Delete any post
  - See full content moderation dashboard

## Demo Credentials

```
Regular User:
  Email: demo@studentenathome.de
  Password: demo123
  Role: User (cannot access admin panel)

Admin User:
  Email: admin@studentenathome.de
  Password: demo123
  Role: Administrator (full admin access)
```

## Security Flow

### Regular User Login Flow

1. User enters `demo@studentenathome.de` + password
2. System checks: `ADMIN_EMAILS.includes("demo@studentenathome.de")` → false
3. Session created with `isAdmin: false`
4. Redirects to `/blog`
5. "Admin-Panel" button hidden
6. If tries to access `/admin` directly → redirected back to `/blog` with error

### Admin Login Flow

1. Admin enters `admin@studentenathome.de` + password
2. System checks: `ADMIN_EMAILS.includes("admin@studentenathome.de")` → true
3. Session created with `isAdmin: true`
4. Redirects to `/admin`
5. Full admin dashboard loads with approval capabilities

## Adding New Admins

Edit [src/components/pages/LoginPage.tsx](src/components/pages/LoginPage.tsx):

```typescript
const ADMIN_EMAILS = [
  "admin@studentenathome.de",
  "georgi@studentenathome.de",
  "neuer.admin@studentenathome.de", // ← Add new admin email
];
```

**Important**: Email comparison is case-insensitive (converted to lowercase).

## Production Recommendations

### Current Implementation (Development)

- ✅ Role-based access control
- ✅ Frontend route protection
- ✅ Email whitelist
- ⚠️ Demo password for all users
- ⚠️ Client-side role checking only

### For Production

1. **Unique passwords per user**:

   - Implement password hashing (bcrypt)
   - Store user credentials in database
   - Each admin has their own password

2. **Backend role verification**:

   ```javascript
   // Verify admin role from JWT token payload
   const decoded = jwt.verify(token, SECRET_KEY);
   if (!decoded.isAdmin) {
     return res.status(403).json({ error: "Forbidden" });
   }
   ```

3. **Database-driven roles**:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE,
     password_hash VARCHAR(255),
     role VARCHAR(50) DEFAULT 'user',  -- 'user' or 'admin'
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Audit logging**:

   - Log all admin actions (approve, reject, delete)
   - Track who approved which post and when

5. **Multi-factor authentication (MFA)**:
   - Add 2FA for admin accounts
   - Use TOTP or SMS verification

## Testing Admin Access

### Test 1: Regular User Access

```bash
# Login as demo@studentenathome.de
# Expected: Redirects to /blog
# Expected: No "Admin-Panel" button visible
# Expected: Cannot access /admin (redirected with error)
```

### Test 2: Admin User Access

```bash
# Login as admin@studentenathome.de
# Expected: Redirects to /admin
# Expected: Admin dashboard loads
# Expected: Can approve/reject/delete posts
```

### Test 3: Direct URL Access

```bash
# Without login: Navigate to /admin
# Expected: Redirected to /login

# As regular user: Navigate to /admin
# Expected: Redirected to /blog with "Zugriff verweigert" alert

# As admin: Navigate to /admin
# Expected: Admin dashboard loads normally
```

## Error Messages

- **Unauthorized (401)**: Invalid or missing authentication token
- **Forbidden (403)**: Valid user but insufficient permissions (not admin)
- **Zugriff verweigert**: German message shown when non-admin tries to access `/admin`

## Backend Admin Verification

Currently, the backend checks for `ADMIN_TOKEN` environment variable:

```javascript
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "demo-token";

app.post("/api/posts", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // ... create post
});
```

**For production**: Replace this with JWT verification that includes role claims.

## Summary

✅ **Who can login**: Anyone with correct credentials  
✅ **Who is admin**: Only emails in `ADMIN_EMAILS` whitelist  
✅ **Frontend protection**: AdminPage checks `isAdmin` flag  
✅ **Backend protection**: All admin endpoints verify `ADMIN_TOKEN`  
✅ **User experience**: Regular users never see admin options  
✅ **Security**: Multi-layer protection (session + route + backend)

❌ **Current limitation**: Demo password is same for all users (fix in production)  
❌ **Production needed**: JWT with role claims, database user management
