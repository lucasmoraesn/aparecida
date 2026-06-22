-- Migration: Bucket privado para PDFs do Kit do Romeiro + RLS restritivo
-- Created: 2026-06-20

-- Bucket privado (acesso via signed URL gerada pelo backend com service role)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ebooks',
  'ebooks',
  false,
  52428800,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf']::text[];

-- Remover políticas permissivas anteriores (se existirem)
DROP POLICY IF EXISTS "public_read_ebooks" ON storage.objects;
DROP POLICY IF EXISTS "anon_read_ebooks" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_read_ebooks" ON storage.objects;
DROP POLICY IF EXISTS "service_role_all_ebooks" ON storage.objects;

-- Apenas service_role pode ler/escrever objetos no bucket ebooks
CREATE POLICY "service_role_all_ebooks"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'ebooks')
  WITH CHECK (bucket_id = 'ebooks');

-- ebook_purchases: remover leitura pública (frontend usa API backend, nunca acessa a tabela diretamente)
DROP POLICY IF EXISTS "public_read_approved_ebook_purchases" ON public.ebook_purchases;

-- Migrar registros legados approved → paid
UPDATE public.ebook_purchases
SET status = 'paid', updated_at = NOW()
WHERE status = 'approved';

COMMENT ON COLUMN public.ebook_purchases.status IS 'pending | paid | failed';
