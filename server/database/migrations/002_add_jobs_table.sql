-- Migration: Add Jobs table for job listings
-- Date: 2025-12-31

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- e.g., "Vollzeit", "Teilzeit", "Vollzeit / Teilzeit"
  location VARCHAR(255) NOT NULL, -- e.g., "Berlin / Deutschlandweit / Remote"
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]', -- Array of requirement strings
  benefits JSONB NOT NULL DEFAULT '[]', -- Array of benefit strings
  
  -- Status and visibility
  status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, inactive, archived
  is_published BOOLEAN DEFAULT TRUE NOT NULL,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Constraints
  CONSTRAINT status_valid CHECK (status IN ('active', 'inactive', 'archived')),
  CONSTRAINT title_length CHECK (LENGTH(title) >= 5 AND LENGTH(title) <= 255),
  CONSTRAINT description_length CHECK (LENGTH(description) >= 20)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_is_published ON jobs(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at ON jobs(published_at) WHERE is_published = true;

-- Add trigger for automatic updated_at timestamp
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE jobs IS 'Job listings for career page';
COMMENT ON COLUMN jobs.requirements IS 'JSON array of job requirement strings';
COMMENT ON COLUMN jobs.benefits IS 'JSON array of job benefit strings';
COMMENT ON COLUMN jobs.status IS 'Job status: active (accepting applications), inactive (not shown), archived (kept for records)';
COMMENT ON COLUMN jobs.is_published IS 'Whether the job is visible to the public';

COMMIT;
