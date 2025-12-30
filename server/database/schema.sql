-- ============================================
-- SECURE DATABASE SCHEMA FOR STUDENTENATHOME
-- ============================================

-- Drop existing tables if rebuilding
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS failed_login_attempts CASCADE;
DROP TABLE IF EXISTS revoked_tokens CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed
  name VARCHAR(255) NOT NULL,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  verification_token VARCHAR(64),
  verification_expiry TIMESTAMP,
  verified_at TIMESTAMP,
  
  -- Password Reset
  password_reset_token VARCHAR(64),
  password_reset_expiry TIMESTAMP,
  password_reset_attempts INTEGER DEFAULT 0 NOT NULL,
  
  -- Security
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE NOT NULL,
  failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
  last_failed_login TIMESTAMP,
  password_changed_at TIMESTAMP,
  
  -- Tracking
  last_login TIMESTAMP,
  last_login_ip INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Constraints
  CONSTRAINT email_lowercase CHECK (email = LOWER(email)),
  CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  
  -- Metadata
  read_time VARCHAR(50) DEFAULT '5 Min',
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  
  -- Tracking
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  published_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Constraints
  CONSTRAINT status_valid CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  CONSTRAINT title_length CHECK (LENGTH(title) >= 10 AND LENGTH(title) <= 200),
  CONSTRAINT excerpt_length CHECK (LENGTH(excerpt) >= 20 AND LENGTH(excerpt) <= 500),
  CONSTRAINT content_length CHECK (LENGTH(content) >= 50)
);

-- ============================================
-- REVOKED TOKENS TABLE (for JWT blacklist)
-- ============================================
CREATE TABLE revoked_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_jti VARCHAR(255) UNIQUE NOT NULL, -- JWT ID
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  reason VARCHAR(100) -- 'logout', 'password_change', 'admin_revoke'
);

-- ============================================
-- FAILED LOGIN ATTEMPTS TABLE
-- ============================================
CREATE TABLE failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  user_agent TEXT,
  
  -- Index for cleanup
  CONSTRAINT attempted_recent CHECK (attempted_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours')
);

-- ============================================
-- AUDIT LOG TABLE (Security monitoring)
-- ============================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'post_create', 'post_approve', etc.
  resource_type VARCHAR(50), -- 'user', 'post', etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB, -- Additional metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_admin ON users(is_admin) WHERE is_admin = true;
CREATE INDEX idx_users_is_verified ON users(is_verified);
CREATE INDEX idx_users_is_locked ON users(is_locked) WHERE is_locked = true;
CREATE INDEX idx_users_verification_token ON users(verification_token) WHERE verification_token IS NOT NULL;

-- Posts indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published_at ON posts(published_at) WHERE status = 'approved';

-- Revoked tokens indexes
CREATE INDEX idx_revoked_tokens_jti ON revoked_tokens(token_jti);
CREATE INDEX idx_revoked_tokens_expires ON revoked_tokens(expires_at);
CREATE INDEX idx_revoked_tokens_user ON revoked_tokens(user_id);

-- Failed login attempts indexes
CREATE INDEX idx_failed_login_email ON failed_login_attempts(email);
CREATE INDEX idx_failed_login_ip ON failed_login_attempts(ip_address);
CREATE INDEX idx_failed_login_attempted ON failed_login_attempts(attempted_at);

-- Audit log indexes
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at);
CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);

-- ============================================
-- AUTOMATIC TIMESTAMP UPDATE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTOMATIC CLEANUP FUNCTIONS
-- ============================================

-- Clean expired revoked tokens (run daily)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM revoked_tokens WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Clean old failed login attempts (run daily)
CREATE OR REPLACE FUNCTION cleanup_failed_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM failed_login_attempts WHERE attempted_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Clean old audit logs (keep 90 days)
CREATE OR REPLACE FUNCTION cleanup_audit_log()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_log WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SECURITY: ROW LEVEL SECURITY (Optional)
-- ============================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users
  FOR SELECT
  USING (id = current_setting('app.current_user_id')::UUID OR current_setting('app.is_admin')::BOOLEAN = true);

-- Admins can see all audit logs
CREATE POLICY audit_log_admin ON audit_log
  FOR SELECT
  USING (current_setting('app.is_admin')::BOOLEAN = true);
