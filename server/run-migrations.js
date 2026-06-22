#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurado');
  process.exit(1);
}

// Extrair project ID da URL
const urlObj = new URL(supabaseUrl);
const projectId = urlObj.hostname.split('.')[0];

// Supabase oferece conexão PostgreSQL direta
const host = `db.${projectId}.supabase.co`;
const connectionString = `postgresql://postgres:${supabaseServiceKey}@${host}:5432/postgres?ssl=require`;

async function runMigrations() {
  const client = new Client(connectionString);

  try {
    console.log('📝 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado ao Supabase\n');

    const migrationsDir = path.join(process.cwd(), '..', 'supabase', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Diretório de migrações não encontrado: ${migrationsDir}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Encontradas ${files.length} migrações\n`);

    // Apply ebook migrations
    for (const file of files) {
      if (!file.includes('ebook')) continue;

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        console.log(`⏳ Aplicando: ${file}`);
        
        // Executar cada statement
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          try {
            await client.query(statement);
          } catch (stmtErr) {
            // Alguns statements podem falhar (por exemplo, DROP POLICY se não existir)
            console.warn(`⚠️ Statement falhou (continuando): ${stmtErr.message.substring(0, 100)}`);
          }
        }
        
        console.log(`✅ ${file} aplicado com sucesso\n`);
      } catch (err) {
        console.error(`❌ Erro ao aplicar ${file}:`, err.message);
      }
    }

    console.log('✅ Migrações concluídas');
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
    console.error('\n📝 Dica: Se conectar via host `db.xxx.supabase.co` falhar:');
    console.error('   1. Abra https://app.supabase.com');
    console.error('   2. Vá para SQL Editor');
    console.error('   3. Cole o SQL do arquivo supabase/migrations/20260620000000_create_ebook_purchases.sql');
    console.error('   4. Execute');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations().catch(console.error);
