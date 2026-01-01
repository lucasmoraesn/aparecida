import pg from 'pg';
const { Client } = pg;

// Connection string do Supabase (formato direto)
const connectionString = 'postgresql://postgres.rhkwickoweflamflgzeo:5PNSl0M09PdG64Uj@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function addEmailColumns() {
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');

    // Add columns
    console.log('\n📝 Adicionando colunas de email...');
    await client.query(`
      ALTER TABLE business_registrations 
      ADD COLUMN IF NOT EXISTS admin_email TEXT,
      ADD COLUMN IF NOT EXISTS contact_email TEXT,
      ADD COLUMN IF NOT EXISTS payer_email TEXT;
    `);
    console.log('✅ Colunas adicionadas');

    // Update existing record
    console.log('\n📝 Atualizando registro com emails...');
    const result = await client.query(`
      UPDATE business_registrations 
      SET 
        contact_email = $1,
        admin_email = $2,
        payer_email = $3
      WHERE id = $4
      RETURNING id, establishment_name, contact_email, admin_email, payer_email;
    `, ['lucaswildre@gmail.com', 'admin@aparecida.com', 'lucaswildre@gmail.com', '34d2b192-990b-46bf-9da7-e8df87f36ed9']);
    
    console.log('✅ Registro atualizado:', result.rows[0]);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

addEmailColumns();
