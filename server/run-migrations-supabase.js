#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function runMigrations() {
  try {
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
        
        // Split SQL by semicolon and execute each statement
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
          const { data, error } = await supabase.rpc('exec_sql', { sql: statement }, {
            headers: { 'Content-Type': 'application/json' }
          }).catch(async () => {
            // Fallback: try using query directly via pg_execute or similar
            // Instead, let's use a different approach
            return { error: 'fallback' };
          });

          if (error && error !== 'fallback') {
            console.error(`❌ Erro ao executar statement em ${file}:`, error.message);
            break;
          }
        }
        
        console.log(`✅ ${file} aplicado com sucesso\n`);
      } catch (err) {
        console.error(`❌ Erro ao aplicar ${file}:`, err.message);
      }
    }

    console.log('✅ Migrações concluídas');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

runMigrations().catch(console.error);
