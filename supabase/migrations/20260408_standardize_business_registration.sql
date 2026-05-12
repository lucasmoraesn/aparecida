-- ==========================================
-- PADRONIZAÇÃO: Hotels e Restaurantes
-- Fluxo idêntico ao de Motoristas
-- ==========================================

-- 1. CRIAR TABELA: HOTELS
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  cidades TEXT[] DEFAULT '{}',
  descricao TEXT,
  foto_url VARCHAR(512),
  plano VARCHAR(50) DEFAULT 'basico', -- basico, destaque, premium
  destaque BOOLEAN DEFAULT FALSE,
  verificado BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, active, rejected
  stripe_session_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT status_valid CHECK (status IN ('draft', 'pending_review', 'active', 'rejected'))
);

-- 2. CRIAR TABELA: RESTAURANTES
CREATE TABLE IF NOT EXISTS restaurantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  cidades TEXT[] DEFAULT '{}',
  especialidade VARCHAR(255),
  descricao TEXT,
  foto_url VARCHAR(512),
  plano VARCHAR(50) DEFAULT 'basico',
  destaque BOOLEAN DEFAULT FALSE,
  verificado BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, active, rejected
  stripe_session_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT status_valid CHECK (status IN ('draft', 'pending_review', 'active', 'rejected'))
);

-- 3. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_hotels_status ON hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_stripe_session ON hotels(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_hotels_destaque ON hotels(destaque);

CREATE INDEX IF NOT EXISTS idx_restaurantes_status ON restaurantes(status);
CREATE INDEX IF NOT EXISTS idx_restaurantes_stripe_session ON restaurantes(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_restaurantes_destaque ON restaurantes(destaque);

-- 4. CRIAR BUCKETS DE STORAGE (se não existirem)
-- Nota: Execute via Dashboard do Supabase ou via script separado
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
-- VALUES ('hoteis-fotos', 'hoteis-fotos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
-- ON CONFLICT DO NOTHING;

-- 5. HABILITAR RLS (Row Level Security)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurantes ENABLE ROW LEVEL SECURITY;

-- 6. POLÍTICAS RLS: Public - Leitura apenas de registros ativos
CREATE POLICY "hotels_public_read" ON hotels
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "restaurantes_public_read" ON restaurantes
  FOR SELECT
  USING (status = 'active');

-- 7. POLÍTICAS RLS: Admin - Acesso total via service role (confiável)
-- Nota: O serviço node.js usa SUPABASE_SERVICE_KEY que bypassa RLS

-- 8. ATUALIZAR updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_hotels()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_restaurantes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hotels_update_updated_at
BEFORE UPDATE ON hotels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_hotels();

CREATE TRIGGER restaurantes_update_updated_at
BEFORE UPDATE ON restaurantes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_restaurantes();

-- ==========================================
-- FIM MIGRATION
-- ==========================================
