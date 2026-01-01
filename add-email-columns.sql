-- Add email columns to business_registrations table
ALTER TABLE business_registrations 
ADD COLUMN IF NOT EXISTS admin_email TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS payer_email TEXT;

-- Update existing record with email
UPDATE business_registrations 
SET 
  contact_email = 'lucaswildre@gmail.com',
  admin_email = 'admin@aparecida.com',
  payer_email = 'lucaswildre@gmail.com'
WHERE id = '34d2b192-990b-46bf-9da7-e8df87f36ed9';
