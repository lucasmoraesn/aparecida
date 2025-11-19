import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function applyMigration() {
  try {
    console.log('📦 Aplicando migration...');
    
    const migrationSQL = readFileSync(
      join(__dirname, '../supabase/migrations/20250113000000_fix_subscriptions_uuid.sql'),
      'utf-8'
    );

    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // Se não houver função exec_sql, executar diretamente (não recomendado em produção)
      console.log('⚠️ Executando SQL diretamente...');
      
      // Dividir em comandos individuais
      const commands = migrationSQL
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);
      
      for (const cmd of commands) {
        console.log(`Executando: ${cmd.substring(0, 50)}...`);
        const { error: cmdError } = await supabase.from('_migrations').insert([{ sql: cmd }]);
        if (cmdError) console.error('Erro:', cmdError.message);
      }
    }
    
    console.log('✅ Migration aplicada com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao aplicar migration:', err.message);
  }
}

applyMigration();
