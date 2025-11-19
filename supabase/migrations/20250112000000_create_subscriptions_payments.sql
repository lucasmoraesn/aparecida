-- Tabela de assinaturas (subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES business_registrations(id) ON DELETE CASCADE,
  -- preapproval_id VARCHAR(255) NOT NULL UNIQUE, -- REMOVIDO: Mercado Pago
  external_subscription_id VARCHAR(255), -- ID externo do provedor de pagamento (Stripe, etc.)
  plan_id BIGINT REFERENCES business_plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, active, paused, cancelled
  amount_cents INTEGER NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  frequency_type VARCHAR(20) NOT NULL DEFAULT 'months',
  next_charge_at TIMESTAMP,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_tax_id VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_external_id ON subscriptions(external_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Tabela de pagamentos (payments)
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES business_registrations(id) ON DELETE CASCADE,
  subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE SET NULL,
  -- mp_payment_id VARCHAR(255) NOT NULL UNIQUE, -- REMOVIDO: Mercado Pago
  external_payment_id VARCHAR(255) NOT NULL UNIQUE, -- ID externo do provedor de pagamento
  status VARCHAR(50) NOT NULL, -- approved, pending, rejected, cancelled, refunded
  amount_cents INTEGER NOT NULL,
  payment_method VARCHAR(50),
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_payments_business_id ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
