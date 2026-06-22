-- Migration: Criar tabela ebook_purchases para auditoria e controle de downloads
-- Created: 2026-06-20
-- Author: Antigravity

CREATE TABLE IF NOT EXISTS public.ebook_purchases (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255), -- Pode ser NULL inicialmente antes de coletado no Stripe Checkout
  amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  stripe_payment_intent VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, failed
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_email ON public.ebook_purchases(email);
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_session_id ON public.ebook_purchases(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_status ON public.ebook_purchases(status);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_ebook_purchases_updated_at
  BEFORE UPDATE ON public.ebook_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.ebook_purchases ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver (evitar conflitos)
DROP POLICY IF EXISTS "service_role_all_ebook_purchases" ON public.ebook_purchases;
DROP POLICY IF EXISTS "public_read_approved_ebook_purchases" ON public.ebook_purchases;

-- Apenas service_role (backend) acessa compras — anon/authenticated bloqueados pelo RLS

COMMENT ON TABLE public.ebook_purchases IS 'Tabela que armazena compras do Kit Oficial do Romeiro para fins de auditoria e liberação de downloads.';
