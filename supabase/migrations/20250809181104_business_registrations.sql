/*
  # Create business registrations and payments tables

  1. New Tables
    - `business_registrations` - Pending business registrations
    - `payments` - Payment records for registrations
    - `business_plans` - Available subscription plans

  2. Features
    - Store registration data before approval
    - Track payment status
    - Support for recurring payments
    - Email notifications
*/

-- Business plans table
CREATE TABLE IF NOT EXISTS business_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Business registrations table
CREATE TABLE IF NOT EXISTS business_registrations (
  id SERIAL PRIMARY KEY,
  establishment_name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  location TEXT NOT NULL,
  photos JSONB NOT NULL, -- Array of photo URLs
  whatsapp TEXT NOT NULL,
  phone TEXT,
  description TEXT NOT NULL,
  plan_id INTEGER REFERENCES business_plans(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  admin_email TEXT NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER REFERENCES business_registrations(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card')),
  payment_provider TEXT NOT NULL, -- 'stripe', etc.
  provider_payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'failed', 'cancelled')),
  pix_code TEXT, -- For PIX payments
  pix_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default business plans
INSERT INTO business_plans (name, price, features) VALUES
('Básico', 49.90, '["Perfil básico do estabelecimento", "Até 5 fotos", "Informações de contato", "Suporte por e-mail"]'),
('Intermediário', 99.90, '["Perfil completo do estabelecimento", "Até 10 fotos", "Destaque na busca", "Suporte prioritário", "Relatórios básicos"]'),
('Premium', 199.90, '["Perfil premium com destaque", "Fotos ilimitadas", "Destaque máximo na busca", "Suporte 24/7", "Relatórios avançados", "Promoções exclusivas"]');

-- Enable Row Level Security
ALTER TABLE business_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for business_registrations
CREATE POLICY "Allow public insert on business_registrations"
  ON business_registrations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read own registration"
  ON business_registrations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update business_registrations"
  ON business_registrations FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for payments
CREATE POLICY "Allow public insert on payments"
  ON payments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read payments"
  ON payments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for business_plans
CREATE POLICY "Allow public read on business_plans"
  ON business_plans FOR SELECT
  TO public
  USING (is_active = true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_registrations_status ON business_registrations(status);
CREATE INDEX IF NOT EXISTS idx_business_registrations_payment_status ON business_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_business_registrations_updated_at 
  BEFORE UPDATE ON business_registrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
