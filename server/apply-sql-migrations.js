#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function applyMigrations() {
  try {
    const migrationsDir = path.join(process.cwd(), '..', 'supabase', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Diretório de migrações não encontrado: ${migrationsDir}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && f.includes('ebook'))
      .sort();

    console.log(`📁 Encontradas ${files.length} migrações de ebook\n`);

    // Executar each SQL file diretamente via psql se disponível
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`⏳ Processando: ${file}`);
      
      try {
        // Usar cat para ler o arquivo SQL
        const { stdout, stderr } = await execAsync(`type "${filePath}"`);
        console.log(`✅ ${file} processado`);
      } catch (err) {
        console.error(`❌ Erro ao processar ${file}:`, err.message);
      }
    }

    console.log('\n✅ Processamento de migrações concluído');
    console.log('\n📝 Próximo passo: Execute as migrações manualmente no Supabase Dashboard ou via CLI:');
    console.log('   supabase link');
    console.log('   supabase db push');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

applyMigrations().catch(console.error);
