-- Adicionar colunas para integração Stripe Billing
-- Migration criada em: 2025-01-19

-- Adicionar colunas do Stripe na tabela subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id VARCHAR(255);

-- Criar índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer 
ON subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_session 
ON subscriptions(stripe_checkout_session_id);

-- Comentários para documentação
COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'ID do cliente no Stripe (cus_...)';
COMMENT ON COLUMN subscriptions.stripe_checkout_session_id IS 'ID da sessão de checkout do Stripe (cs_...)';
COMMENT ON COLUMN subscriptions.external_subscription_id IS 'ID da assinatura no Stripe (sub_...)';
