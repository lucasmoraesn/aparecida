-- Adicionar coluna 'status' à tabela business_registrations
-- Status: pending, approved, rejected

ALTER TABLE public.business_registrations
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Comentário para documentação
COMMENT ON COLUMN public.business_registrations.status IS 'Status da aprovação: pending (pendente), approved (aprovado), rejected (rejeitado)';

-- Criar índice para melhorar queries
CREATE INDEX IF NOT EXISTS idx_business_registrations_status 
ON public.business_registrations(status);
