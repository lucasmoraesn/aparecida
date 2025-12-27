-- Tabela para armazenar inscritos na newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Índice para busca por status
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Comentários
COMMENT ON TABLE newsletter_subscribers IS 'Armazena inscritos na newsletter do site';
COMMENT ON COLUMN newsletter_subscribers.email IS 'E-mail do inscrito';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Status da inscrição: active ou unsubscribed';
