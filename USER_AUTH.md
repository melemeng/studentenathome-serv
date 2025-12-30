# User Registration & Email Verification System

## Overview

The system now supports full user registration with email verification. Anyone can create an account, but only `admin@studentenathome.de` has admin privileges.

## How It Works

### 1. User Registration Flow

```
User fills form → Backend validation → Password hashing →
Generate verification token → Save user → Send verification email →
User receives email → Clicks link → Email verified → Can login
```

### 2. Email Verification

- **Token expires**: 24 hours after registration
- **Verification URL**: `https://studentenathome.de/verify-email?token=xxxxx`
- **Re-send option**: Available if user doesn't receive email

### 3. Login Requirements

- ✅ Email must be verified
- ✅ Password must match hashed password in database
- ❌ Cannot login with unverified email

## Endpoints

### POST `/api/auth/register`

Register a new user account.

**Request:**

```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "SecurePass123"
}
```

**Response (Success):**

```json
{
  "message": "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Verifizierung.",
  "emailSent": true
}
```

**Response (Error):**

```json
{
  "error": "E-Mail-Adresse bereits registriert"
}
```

**Validation Rules:**

- Name: Required
- Email: Must be valid email format
- Password: Minimum 8 characters

### GET `/api/auth/verify-email?token=xxxxx`

Verify user email address.

**Response (Success):**

```json
{
  "message": "E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden."
}
```

**Response (Error):**

```json
{
  "error": "Ungültiger Verifizierungs-Token"
}
// or
{
  "error": "Verifizierungs-Token abgelaufen"
}
```

### POST `/api/auth/login`

Login with verified email.

**Request:**

```json
{
  "email": "max@example.com",
  "password": "SecurePass123"
}
```

**Response (Success):**

```json
{
  "message": "Anmeldung erfolgreich",
  "token": "session-token-here",
  "user": {
    "id": "user-id",
    "email": "max@example.com",
    "name": "Max Mustermann",
    "isAdmin": false
  }
}
```

**Response (Not Verified):**

```json
{
  "error": "E-Mail noch nicht verifiziert",
  "needsVerification": true
}
```

**Response (Invalid Credentials):**

```json
{
  "error": "Ungültige Anmeldedaten"
}
```

### POST `/api/auth/resend-verification`

Resend verification email.

**Request:**

```json
{
  "email": "max@example.com"
}
```

**Response:**

```json
{
  "message": "Verifizierungs-E-Mail wurde erneut gesendet."
}
```

## Admin Privileges

### Who Gets Admin Access?

**Only** `admin@studentenathome.de` is automatically assigned admin role during registration.

```javascript
const ADMIN_EMAIL = "admin@studentenathome.de";

// In registration
const newUser = {
  ...
  isAdmin: email.toLowerCase() === ADMIN_EMAIL,
  ...
};
```

### Admin vs Regular User

| Feature                     | Regular User | Admin User |
| --------------------------- | ------------ | ---------- |
| Register account            | ✅           | ✅         |
| Email verification required | ✅           | ✅         |
| Create blog posts           | ✅           | ✅         |
| View approved posts         | ✅           | ✅         |
| Access `/admin` panel       | ❌           | ✅         |
| Approve/reject posts        | ❌           | ✅         |
| Delete posts                | ❌           | ✅         |

## Email Configuration

### Environment Variables

Set these in your environment or `.env` file:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application URLs
CANONICAL_BASE_URL=https://studentenathome.de
```

### Gmail Setup (Example)

1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an "App Password"
4. Use the app password in `SMTP_PASS`

### Email Template

The verification email includes:

- Welcome message
- Clickable verification button
- Plain text link (for email clients that don't support HTML)
- Expiration notice (24 hours)

## User Database Structure

### File Location

`server/data/users.json`

### User Object Schema

```json
{
  "id": "unique-user-id",
  "email": "user@example.com",
  "password": "$2a$10$hashedPasswordHere",
  "name": "User Name",
  "isVerified": true,
  "isAdmin": false,
  "verificationToken": null,
  "verificationExpiry": null,
  "verifiedAt": "2025-12-30T10:00:00.000Z",
  "createdAt": "2025-12-29T15:30:00.000Z",
  "lastLogin": "2025-12-30T09:45:00.000Z"
}
```

## Security Features

### Password Hashing

- Uses `bcryptjs` with cost factor 10
- Passwords never stored in plain text
- Secure comparison using `bcrypt.compare()`

### Rate Limiting

- Registration: 5 attempts per 15 minutes per IP
- Login: 5 attempts per 15 minutes per IP
- Resend verification: 5 attempts per 15 minutes per IP

### Token Security

- Verification tokens: 32-byte random hex strings (64 characters)
- Cryptographically secure using `crypto.randomBytes()`
- Single-use tokens (deleted after verification)
- Time-limited (24-hour expiration)

### Input Validation

- Email format validation
- Password minimum length (8 characters)
- SQL injection prevention (using validator.escape())
- XSS prevention (input sanitization)

## Frontend Pages

### RegisterPage (`/register`)

- Form with name, email, password, confirm password
- Client-side validation
- Success screen with email verification instructions
- Link to login page

### LoginPage (`/login`)

- Email and password form
- Integration with backend authentication
- Handles unverified email errors
- Auto-redirect based on user role (admin → `/admin`, user → `/blog`)
- Link to registration page

### Verification Flow

User clicks email link → Redirected to `/verify-email?token=xxxxx` →
Backend verifies token → Success message → Redirect to login

## Testing the System

### 1. Register New User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123"
}
```

Expected: 201 Created with verification message

### 2. Check Email

- Open email client
- Look for verification email from StudentenAtHome
- Click "E-Mail verifizieren" button

### 3. Verify Email

```bash
GET /api/auth/verify-email?token=<token-from-email>
```

Expected: 200 OK with success message

### 4. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123"
}
```

Expected: 200 OK with session token and user data

### 5. Test Unverified Login

Try logging in before verifying email.

Expected: 403 Forbidden with "needsVerification: true"

### 6. Test Admin Registration

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@studentenathome.de",
  "password": "AdminPass123"
}
```

Expected: User created with `isAdmin: true`

## Common Issues & Solutions

### Issue: Email not received

**Solutions:**

1. Check spam/junk folder
2. Verify SMTP credentials in environment variables
3. Use "Resend verification" button
4. Check server logs for email sending errors

### Issue: Token expired

**Solution:**

- Use "Resend verification" endpoint
- New token generated with fresh 24-hour expiration

### Issue: Cannot login after registration

**Solution:**

- Verify email first
- Check that `isVerified: true` in users.json
- Ensure password matches (case-sensitive)

### Issue: Admin not recognized

**Solution:**

- Verify email is exactly `admin@studentenathome.de`
- Check `isAdmin: true` in database
- Clear browser localStorage and re-login

## Production Recommendations

### Current Implementation (Development)

✅ Email verification
✅ Password hashing
✅ Rate limiting
✅ Input validation
⚠️ JSON file storage (not scalable)
⚠️ Simple session tokens (not JWT)

### For Production

1. **Replace JSON file with database**:

   - PostgreSQL or MongoDB
   - Proper indexing on email field
   - Connection pooling

2. **Use JWT tokens**:

   - Replace simple session tokens with JWT
   - Include user ID and role in payload
   - Set expiration claims

3. **Enable HTTPS**:

   - Required for secure cookie transmission
   - Use Let's Encrypt certificates

4. **Add CSRF protection**:

   - Use `csurf` middleware
   - Include CSRF tokens in forms

5. **Implement password reset**:

   - Forgot password flow
   - Time-limited reset tokens
   - Email with reset link

6. **Add email queue**:

   - Use Redis or RabbitMQ
   - Retry failed email sends
   - Background processing

7. **Enhanced monitoring**:

   - Log failed login attempts
   - Monitor registration rates
   - Alert on suspicious activity

8. **2FA for admin** (next step):
   - TOTP-based authentication
   - QR code setup
   - Backup codes

## Next Steps: Admin 2FA

To implement 2FA for admin@studentenathome.de:

1. Install TOTP library: `npm install otpauth qrcode`
2. Generate secret on admin first login
3. Display QR code for authenticator app
4. Require 6-digit code after password
5. Store backup codes in encrypted format

This will be implemented in the next phase.
