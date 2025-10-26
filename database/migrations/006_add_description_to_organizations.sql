-- Add description column to helper_organizations
ALTER TABLE helper_organizations ADD COLUMN IF NOT EXISTS description TEXT;
