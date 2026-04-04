-- Adiciona coluna foto_url na tabela motoristas (se não existir)
ALTER TABLE public.motoristas 
ADD COLUMN IF NOT EXISTS foto_url TEXT DEFAULT '';
