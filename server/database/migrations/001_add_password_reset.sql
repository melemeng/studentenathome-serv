-- Migration: Add Password Reset fields to users table
-- Date: 2025-12-30

-- Add password reset columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(64),
ADD COLUMN IF NOT EXISTS password_reset_expiry TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_reset_attempts INTEGER DEFAULT 0 NOT NULL;

-- Add index for faster password reset token lookups
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token 
ON users(password_reset_token) 
WHERE password_reset_token IS NOT NULL;

-- Add comment
COMMENT ON COLUMN users.password_reset_token IS 'Token for password reset requests';
COMMENT ON COLUMN users.password_reset_expiry IS 'Expiration timestamp for reset token (1 hour)';
COMMENT ON COLUMN users.password_reset_attempts IS 'Number of password reset attempts with current token';

COMMIT;
