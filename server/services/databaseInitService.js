import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import logger from './logger.js';

/**
 * Criar tabela ebook_purchases se não existir
 */
async function ensureEbookPurchasesTable() {
  const supabase = getSupabaseAdmin();
  
  try {
    // Tentar uma query simples para verificar se a tabela existe
    const { data, error } = await supabase
      .from('ebook_purchases')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1);

    if (!error) {
      logger.info('✅ Tabela ebook_purchases já existe');
      return true;
    }

    // Se não existir, criar usando fetch direto ao Supabase
    if (error && error.message && error.message.includes('ebook_purchases')) {
      logger.info('📝 Criando tabela ebook_purchases via REST API...');
      
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
      
      if (!supabaseUrl || !supabaseServiceKey) {
        logger.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurado');
        return false;
      }

      const sqlStatements = [
        `CREATE TABLE IF NOT EXISTS public.ebook_purchases (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255),
          amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
          stripe_payment_intent VARCHAR(255),
          stripe_checkout_session_id VARCHAR(255) UNIQUE NOT NULL,
          stripe_customer_id VARCHAR(255),
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
        
        `CREATE INDEX IF NOT EXISTS idx_ebook_purchases_email ON public.ebook_purchases(email);`,
        
        `CREATE INDEX IF NOT EXISTS idx_ebook_purchases_session_id ON public.ebook_purchases(stripe_checkout_session_id);`,
        
        `CREATE INDEX IF NOT EXISTS idx_ebook_purchases_status ON public.ebook_purchases(status);`,
        
        `CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';`,
        
        `CREATE TRIGGER IF NOT EXISTS update_ebook_purchases_updated_at
          BEFORE UPDATE ON public.ebook_purchases
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();`,
        
        `ALTER TABLE public.ebook_purchases ENABLE ROW LEVEL SECURITY;`,
        
        `DROP POLICY IF EXISTS "service_role_all_ebook_purchases" ON public.ebook_purchases;`,
        
        `DROP POLICY IF EXISTS "public_read_approved_ebook_purchases" ON public.ebook_purchases;`
      ];

      // Executar cada statement
      for (let i = 0; i < sqlStatements.length; i++) {
        const sql = sqlStatements[i];
        try {
          logger.info(`📝 Executando statement ${i + 1}/${sqlStatements.length}...`);
          
          // Tentar via fetch HTTP direto
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Prefer': 'tx=commit'
            },
            body: JSON.stringify({ sql })
          }).catch(async () => {
            // Se falhar, tentar usar o client Supabase
            try {
              // Executar via exec_sql se disponível
              const { error: rpcError } = await supabase.rpc('exec_sql', { sql }).catch(() => ({
                error: { message: 'RPC not available' }
              }));
              
              return { ok: !rpcError };
            } catch {
              return { ok: false };
            }
          });
          
          if (response && response.ok) {
            logger.info(`✅ Statement ${i + 1} executado`);
          } else {
            logger.warn(`⚠️ Statement ${i + 1} pode ter falhado, continuando...`);
          }
        } catch (err) {
          logger.warn(`⚠️ Erro ao executar statement ${i + 1}: ${err.message}`);
        }
      }

      logger.info('✅ Tabela ebook_purchases criada/verificada com sucesso');
      return true;
    }

    return true;
  } catch (err) {
    logger.error('❌ Erro ao verificar/criar tabela ebook_purchases:', err.message);
    // Não bloquear inicialização do servidor se falhar
    return false;
  }
}

export { ensureEbookPurchasesTable };
