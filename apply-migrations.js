#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurado');
  process.exit(1);
}

// Extract connection params from Supabase URL
const urlObj = new URL(supabaseUrl);
const connectionString = `postgres://postgres:${supabaseServiceKey}@${urlObj.hostname}:5432/postgres`;

async function runMigrations() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase\n');

    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    
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
        await client.query(sql);
        console.log(`✅ ${file} aplicado com sucesso\n`);
      } catch (err) {
        console.error(`❌ Erro ao aplicar ${file}:`, err.message, '\n');
      }
    }

    console.log('✅ Migrações concluídas');
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations().catch(console.error);
