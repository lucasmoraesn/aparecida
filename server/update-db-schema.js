import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rhkwickoweflamflgzeo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc2MjI4MywiZXhwIjoyMDcwMzM4MjgzfQ.wNurKd9yi4X9ylkGkanHdRHBxCOlcLxipEoKo0gl4U4'
);

async function updateWithRawSQL() {
  try {
    // Primeiro, tente adicionar as colunas via raw SQL usando a API REST
    const { data: alterData, error: alterError } = await supabase
      .rpc('exec_raw_sql', {
        sql: `
          ALTER TABLE business_registrations 
          ADD COLUMN IF NOT EXISTS admin_email TEXT,
          ADD COLUMN IF NOT EXISTS contact_email TEXT,
          ADD COLUMN IF NOT EXISTS payer_email TEXT;
        `
      });

    if (alterError) {
      console.log('⚠️ Tentativa via RPC falhou (esperado):', alterError.message);
      console.log('\n📝 Vou tentar via SSH no servidor...');
      
      // Se falhar, imprimir o comando SSH necessário
      console.log('\n🔧 Execute este comando via SSH no servidor VPS:');
      console.log('\nPSQLpassword=<sua_senha> psql -h aws-0-sa-east-1.pooler.supabase.com -p 6543 -U postgres.rhkwickoweflamflgzeo -d postgres << EOF');
      console.log('ALTER TABLE business_registrations ADD COLUMN IF NOT EXISTS admin_email TEXT;');
      console.log('ALTER TABLE business_registrations ADD COLUMN IF NOT EXISTS contact_email TEXT;');
      console.log('ALTER TABLE business_registrations ADD COLUMN IF NOT EXISTS payer_email TEXT;');
      console.log("UPDATE business_registrations SET contact_email='lucaswildre@gmail.com', admin_email='admin@aparecida.com', payer_email='lucaswildre@gmail.com' WHERE id='34d2b192-990b-46bf-9da7-e8df87f36ed9';");
      console.log('EOF');
    } else {
      console.log('✅ Colunas adicionadas com sucesso');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

updateWithRawSQL();
