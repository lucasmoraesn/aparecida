-- Migration: Criar tabela payment_webhooks para armazenar eventos de webhooks
-- Data: 2025-11-12
-- Descrição: Tabela para persistir e processar webhooks do PagBank e outros provedores

CREATE TABLE IF NOT EXISTS payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação do provedor de pagamento
  provider VARCHAR(50) NOT NULL, -- 'pagbank', 'mercadopago', etc
  
  -- Tipo de evento recebido
  event_type VARCHAR(100) NOT NULL, -- 'PAID', 'DECLINED', 'REFUNDED', 'CANCELED', etc
  
  -- Assinatura/Signature para validação
  signature TEXT,
  signature_valid BOOLEAN DEFAULT NULL,
  
  -- Payload completo do webhook
  payload JSONB NOT NULL,
  
  -- Dados extraídos do payload para facilitar queries
  order_id VARCHAR(255),
  charge_id VARCHAR(255),
  reference_id VARCHAR(255),
  amount DECIMAL(10, 2),
  
  -- Status de processamento
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'failed', 'ignored'
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices para performance
  CONSTRAINT payment_webhooks_provider_check CHECK (provider IN ('pagbank', 'mercadopago', 'stripe', 'other'))
);

-- Índices para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_provider ON payment_webhooks(provider);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_type ON payment_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_status ON payment_webhooks(status);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_order_id ON payment_webhooks(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_charge_id ON payment_webhooks(charge_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_reference_id ON payment_webhooks(reference_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_created_at ON payment_webhooks(created_at DESC);

-- Criar tabela para armazenar orders/charges do PagBank
CREATE TABLE IF NOT EXISTS pagbank_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- IDs do PagBank
  order_id VARCHAR(255) UNIQUE NOT NULL,
  reference_id VARCHAR(255),
  
  -- Status do pedido
  status VARCHAR(50) NOT NULL, -- 'PAID', 'DECLINED', 'PENDING', 'CANCELED', 'REFUNDED'
  
  -- Dados do cliente
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_tax_id VARCHAR(20),
  
  -- Valores
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Dados do pagamento
  payment_method VARCHAR(50), -- 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', etc
  installments INTEGER DEFAULT 1,
  
  -- Charges relacionadas
  charge_id VARCHAR(255),
  charge_status VARCHAR(50),
  
  -- Payload completo da resposta do PagBank
  full_response JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Relação com business_registrations (opcional)
  business_registration_id UUID REFERENCES business_registrations(id) ON DELETE SET NULL
);

-- Índices para pagbank_orders
CREATE INDEX IF NOT EXISTS idx_pagbank_orders_order_id ON pagbank_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_pagbank_orders_reference_id ON pagbank_orders(reference_id);
CREATE INDEX IF NOT EXISTS idx_pagbank_orders_status ON pagbank_orders(status);
CREATE INDEX IF NOT EXISTS idx_pagbank_orders_customer_email ON pagbank_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_pagbank_orders_created_at ON pagbank_orders(created_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pagbank_orders_updated_at
  BEFORE UPDATE ON pagbank_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE payment_webhooks IS 'Armazena eventos de webhooks de provedores de pagamento';
COMMENT ON TABLE pagbank_orders IS 'Armazena pedidos e cobranças do PagBank';
COMMENT ON COLUMN payment_webhooks.signature_valid IS 'NULL = não verificada, TRUE = válida, FALSE = inválida';
COMMENT ON COLUMN payment_webhooks.status IS 'Status de processamento do webhook: pending, processed, failed, ignored';
