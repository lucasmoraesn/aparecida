-- Migration to enable Row Level Security on all public tables
-- Created: 2025-12-30
-- Purpose: Fix security issues identified by Supabase Security Advisor

-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE IF EXISTS public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. DROP EXISTING POLICIES (IF ANY) TO AVOID CONFLICTS
-- ============================================================================

DROP POLICY IF EXISTS "Allow public read on business_plans" ON public.business_plans;
DROP POLICY IF EXISTS "Allow public insert on business_registrations" ON public.business_registrations;
DROP POLICY IF EXISTS "Allow public read own registration" ON public.business_registrations;
DROP POLICY IF EXISTS "Allow authenticated users to update business_registrations" ON public.business_registrations;
DROP POLICY IF EXISTS "Allow public insert on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public read payments" ON public.payments;
DROP POLICY IF EXISTS "Allow authenticated users to update payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public read newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public insert newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public read subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow service role manage subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow service role manage payments" ON public.payments;

-- ============================================================================
-- 3. CREATE POLICIES FOR business_plans
-- ============================================================================

-- Qualquer pessoa pode ver planos ativos (público)
CREATE POLICY "public_read_active_plans"
  ON public.business_plans
  FOR SELECT
  TO public
  USING (is_active = true);

-- Apenas autenticados (admin) podem inserir/atualizar/deletar planos
CREATE POLICY "authenticated_manage_plans"
  ON public.business_plans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 4. CREATE POLICIES FOR newsletter_subscribers
-- ============================================================================

-- Permitir qualquer pessoa se inscrever na newsletter
CREATE POLICY "public_insert_newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Apenas autenticados (admin) podem ler a lista de inscritos
CREATE POLICY "authenticated_read_newsletter"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Apenas autenticados (admin) podem atualizar/deletar
CREATE POLICY "authenticated_manage_newsletter"
  ON public.newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_newsletter"
  ON public.newsletter_subscribers
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- 5. CREATE POLICIES FOR subscriptions
-- ============================================================================

-- Backend/Service pode fazer tudo (via service_role key)
CREATE POLICY "service_role_all_subscriptions"
  ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Usuários autenticados podem ver suas próprias assinaturas
CREATE POLICY "authenticated_read_own_subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_email = auth.jwt()->>'email'
    OR auth.jwt()->>'role' = 'service_role'
  );

-- ============================================================================
-- 6. CREATE POLICIES FOR payments
-- ============================================================================

-- Backend/Service pode fazer tudo (via service_role key)
CREATE POLICY "service_role_all_payments"
  ON public.payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Usuários autenticados podem ver seus próprios pagamentos através da relação com subscription
CREATE POLICY "authenticated_read_own_payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = payments.subscription_id
      AND (
        subscriptions.customer_email = auth.jwt()->>'email'
        OR auth.jwt()->>'role' = 'service_role'
      )
    )
  );

-- ============================================================================
-- 7. CREATE POLICIES FOR business_registrations
-- ============================================================================

-- Permitir público inserir novos registros (formulário de cadastro)
CREATE POLICY "public_insert_registrations"
  ON public.business_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Backend/Service pode fazer tudo
CREATE POLICY "service_role_all_registrations"
  ON public.business_registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Usuários autenticados podem ver e atualizar seus próprios registros
CREATE POLICY "authenticated_read_own_registrations"
  ON public.business_registrations
  FOR SELECT
  TO authenticated
  USING (
    admin_email = auth.jwt()->>'email'
    OR auth.jwt()->>'role' = 'service_role'
  );

CREATE POLICY "authenticated_update_own_registrations"
  ON public.business_registrations
  FOR UPDATE
  TO authenticated
  USING (
    admin_email = auth.jwt()->>'email'
    OR auth.jwt()->>'role' = 'service_role'
  )
  WITH CHECK (
    admin_email = auth.jwt()->>'email'
    OR auth.jwt()->>'role' = 'service_role'
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "public_read_active_plans" ON public.business_plans IS 
  'Permite que qualquer pessoa veja os planos ativos disponíveis';

COMMENT ON POLICY "public_insert_newsletter" ON public.newsletter_subscribers IS 
  'Permite que visitantes se inscrevam na newsletter';

COMMENT ON POLICY "service_role_all_subscriptions" ON public.subscriptions IS 
  'Permite que o backend gerencie todas as assinaturas via service_role key';

COMMENT ON POLICY "service_role_all_payments" ON public.payments IS 
  'Permite que o backend gerencie todos os pagamentos via service_role key';

COMMENT ON POLICY "public_insert_registrations" ON public.business_registrations IS 
  'Permite que novos estabelecimentos se cadastrem através do formulário público';
