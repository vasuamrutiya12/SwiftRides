-- Add rcbook column to Cars table if it doesn't exist
ALTER TABLE Cars ADD COLUMN IF NOT EXISTS rcbook VARCHAR(255);

-- Check if the column was added
DESCRIBE Cars; 