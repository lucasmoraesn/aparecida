-- Migration: create table to store Mercado Pago subscriptions
CREATE TABLE IF NOT EXISTS mp_subscriptions (
  id SERIAL PRIMARY KEY,
  mp_subscription_id TEXT,
  mp_init_point TEXT,
  status TEXT,
  next_payment_date TIMESTAMPTZ,
  payer_id TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional index to search by mp_subscription_id quickly
CREATE UNIQUE INDEX IF NOT EXISTS idx_mp_subscriptions_mp_subscription_id ON mp_subscriptions(mp_subscription_id);
