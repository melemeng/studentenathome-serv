# Database Setup and Verification Guide

This guide covers setting up the database on Railway, running migrations, seeding data, and verifying that all functionality works correctly.

## Prerequisites

- PostgreSQL database deployed on Railway
- `DATABASE_URL` environment variable set in `.env`
- Node.js and npm installed

## Database Structure

The application uses the following tables:

1. **users** - User accounts with authentication and email verification
2. **posts** - Blog posts with approval workflow
3. **jobs** - Job listings for the career page
4. **revoked_tokens** - JWT token blacklist
5. **failed_login_attempts** - Security tracking
6. **audit_log** - Security audit trail

## Setup Steps

### 1. Create Database Schema

Run the setup script to create all tables:

```bash
npm run db:setup
```

This will:
- Connect to your Railway database using `DATABASE_URL`
- Create all tables defined in `server/database/schema.sql`
- Set up indexes for performance
- Create triggers for automatic timestamps
- Enable row-level security policies

### 2. Run Migrations

Apply any pending migrations:

```bash
npm run migrate
```

Current migrations:
- `001_add_password_reset.sql` - Password reset functionality
- `002_add_jobs_table.sql` - Jobs table creation

### 3. Seed Initial Data

#### Seed Job Listings

Populate the database with 5 initial job listings:

```bash
cd server/database
node seed-jobs.js
```

This creates:
- Junior Tech Support Specialist
- Netzwerk-Administrator / Konfigurateur
- IT-Support Trainer / Schulung
- Web Developer / Frontend-Spezialist
- Kundenbetreuung / Support-Koordinator

## Verification

### Automated API Testing

Run the comprehensive test script:

```bash
./test-full-api.sh
```

This tests:
- ✓ API connectivity
- ✓ Blog post creation and retrieval
- ✓ User registration
- ✓ Email verification flow
- ✓ Login authentication
- ✓ Jobs listing
- ✓ Sitemap and robots.txt

### Manual Database Verification

Connect to your Railway database and run these queries:

#### 1. Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables: `audit_log`, `failed_login_attempts`, `jobs`, `posts`, `revoked_tokens`, `users`

#### 2. Verify Jobs Data
```sql
SELECT id, title, status, is_published 
FROM jobs 
ORDER BY created_at;
```

Should show 5 job listings with `status = 'active'` and `is_published = true`.

#### 3. Check Users Table
```sql
SELECT id, email, name, is_admin, is_verified, created_at 
FROM users 
ORDER BY created_at DESC;
```

#### 4. Check Blog Posts
```sql
SELECT id, title, status, published_at 
FROM posts 
WHERE status = 'approved' 
ORDER BY published_at DESC;
```

#### 5. View Audit Log
```sql
SELECT action, created_at, details 
FROM audit_log 
ORDER BY created_at DESC 
LIMIT 10;
```

## Testing Individual Features

### 1. Blog Functionality

#### Create a Blog Post (Admin)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Test Blog Post About Dresden Tech Scene",
    "excerpt": "Exploring the growing technology community in Dresden, Germany",
    "content": "Full article content here with detailed information about the tech scene...",
    "category": "Tech-Tipps",
    "author": "StudentenAtHome Team"
  }'
```

#### Get All Posts (Public)
```bash
curl http://localhost:5000/api/posts
```

#### Approve a Post (Admin)
```bash
curl -X PATCH http://localhost:5000/api/posts/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"status": "approved"}'
```

### 2. User Authentication

#### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "name": "New User"
  }'
```

#### Verify Email
1. Get verification token from database:
```sql
SELECT email, verification_token 
FROM users 
WHERE email = 'newuser@example.com';
```

2. Verify email:
```bash
curl "http://localhost:5000/api/auth/verify-email?token=VERIFICATION_TOKEN"
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!"
  }'
```

Returns JWT token for authenticated requests.

### 3. Job Listings

#### Get All Jobs (Public)
```bash
curl http://localhost:5000/api/jobs
```

#### Create New Job (Admin with JWT)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Developer Position",
    "type": "Vollzeit",
    "location": "Dresden",
    "description": "We are looking for an experienced developer...",
    "requirements": [
      "5+ years experience",
      "React and Node.js expertise",
      "German language skills"
    ],
    "benefits": [
      "Competitive salary",
      "Flexible working hours",
      "Remote work possible"
    ]
  }'
```

#### Update Job Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/jobs/JOB_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "inactive"}'
```

## Environment Variables

Required in `.env`:

```env
# Database (Railway)
DATABASE_URL=postgresql://user:password@host:port/database

# Security
JWT_SECRET=your-random-jwt-secret-min-64-chars
ADMIN_TOKEN=your-random-admin-token-min-64-chars

# Email (IONOS)
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=your-email-password

# Application
NODE_ENV=production
CANONICAL_BASE_URL=https://studentenathome.de
```

## Common Issues

### Database Connection Failed

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
1. Check `DATABASE_URL` in `.env`
2. Verify Railway database is running
3. Check SSL settings (Railway requires SSL)

### Tables Already Exist

**Error:** `relation "users" already exists`

**Solution:**
- Tables are already created, no action needed
- To recreate: Drop all tables first (⚠️ destroys data)

### Email Verification Not Working

**Error:** Email not received

**Solution:**
1. Check SMTP credentials in `.env`
2. Verify IONOS email account is active
3. Check spam folder
4. Test with: `npm run logs:tail` to see email sending logs

### JWT Token Invalid

**Error:** `Invalid or expired token`

**Solution:**
1. Ensure JWT_SECRET matches between requests
2. Token expires after 24 hours by default
3. Login again to get fresh token

## Database Maintenance

### Clean Old Data

```sql
-- Clean expired tokens (run daily)
SELECT cleanup_expired_tokens();

-- Clean old failed login attempts (run daily)
SELECT cleanup_failed_login_attempts();

-- Clean old audit logs (run weekly, keeps 90 days)
SELECT cleanup_audit_log();
```

### Backup Database

Railway provides automatic backups. To create manual backup:

```bash
# Export from Railway
railway run pg_dump > backup.sql

# Import to another database
psql -d database_url < backup.sql
```

## Monitoring

### Check Application Health

```bash
# View recent logs
npm run logs:view

# Tail logs in real-time
npm run logs:tail

# Check specific error logs
grep "ERROR" server/logs/combined.log
```

### Database Queries for Monitoring

```sql
-- Active users (logged in last 30 days)
SELECT COUNT(*) FROM users 
WHERE last_login > NOW() - INTERVAL '30 days';

-- Posts by status
SELECT status, COUNT(*) 
FROM posts 
GROUP BY status;

-- Recent security events
SELECT action, COUNT(*) 
FROM audit_log 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY action;

-- Failed login attempts (last 24h)
SELECT COUNT(*) 
FROM failed_login_attempts 
WHERE attempted_at > NOW() - INTERVAL '24 hours';
```

## Next Steps

1. ✅ Database schema created
2. ✅ Migrations applied
3. ✅ Job data seeded
4. ⏳ Register admin user via frontend
5. ⏳ Test complete workflow in production
6. ⏳ Set up monitoring and alerts

## Support

For issues or questions:
- Check logs: `npm run logs:view`
- Review security logs in `audit_log` table
- Contact: support@studentenathome.de
