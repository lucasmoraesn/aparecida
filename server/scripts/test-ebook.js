#!/usr/bin/env node
/**
 * Script de teste para a rota de download de ebook
 * Testa se tudo está configurado corretamente
 */

import 'dotenv/config.js';
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';

async function testEbookSetup() {
  console.log('\n🧪 Teste de Configuração de Ebook\n');
  console.log('═'.repeat(50));

  const supabase = getSupabaseAdmin();
  let passed = 0;
  let failed = 0;

  // Teste 1: Verificar variáveis de ambiente
  console.log('\n1️⃣  Verificando Variáveis de Ambiente...');
  const vars = {
    SUPABASE_EBOOKS_BUCKET: process.env.SUPABASE_EBOOKS_BUCKET,
    EBOOK_PRICE_CENTS: process.env.EBOOK_PRICE_CENTS,
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌',
  };

  for (const [key, value] of Object.entries(vars)) {
    if (value && value !== '❌') {
      console.log(`   ✅ ${key} = ${value}`);
      passed++;
    } else {
      console.log(`   ❌ ${key} = NÃO CONFIGURADO`);
      failed++;
    }
  }

  // Teste 2: Verificar bucket
  console.log('\n2️⃣  Verificando Bucket no Supabase...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;

    const ebookBucket = buckets.find(b => b.name === 'ebooks');
    if (ebookBucket) {
      console.log(`   ✅ Bucket "ebooks" existe`);
      passed++;
    } else {
      console.log(`   ❌ Bucket "ebooks" NÃO ENCONTRADO`);
      console.log(`   📦 Buckets disponíveis: ${buckets.map(b => b.name).join(', ')}`);
      failed++;
    }
  } catch (err) {
    console.log(`   ❌ Erro ao listar buckets: ${err.message}`);
    failed++;
  }

  // Teste 3: Verificar arquivo PDF
  console.log('\n3️⃣  Verificando Arquivo PDF...');
  try {
    const { data: files, error } = await supabase.storage
      .from('ebooks')
      .list();

    if (error) throw error;

    const pdfFile = files.find(f => f.name === 'kit-romeiro-2026.pdf');
    if (pdfFile) {
      console.log(`   ✅ Arquivo "kit-romeiro-2026.pdf" encontrado`);
      console.log(`      Tamanho: ${(pdfFile.metadata.size / 1024 / 1024).toFixed(2)} MB`);
      passed++;
    } else {
      console.log(`   ❌ Arquivo "kit-romeiro-2026.pdf" NÃO ENCONTRADO`);
      if (files.length > 0) {
        console.log(`   📄 Arquivos no bucket: ${files.map(f => f.name).join(', ')}`);
      } else {
        console.log(`   📄 Bucket vazio`);
      }
      failed++;
    }
  } catch (err) {
    console.log(`   ❌ Erro ao listar arquivos: ${err.message}`);
    failed++;
  }

  // Teste 4: Gerar URL assinada
  console.log('\n4️⃣  Testando Geração de URL Assinada...');
  try {
    const { data, error } = await supabase.storage
      .from('ebooks')
      .createSignedUrl('kit-romeiro-2026.pdf', 86400);

    if (error) throw error;

    if (data?.signedUrl) {
      console.log(`   ✅ URL gerada com sucesso`);
      console.log(`   🔗 ${data.signedUrl.substring(0, 80)}...`);
      passed++;
    } else {
      console.log(`   ❌ Falha ao gerar URL`);
      failed++;
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
    failed++;
  }

  // Resumo
  console.log('\n' + '═'.repeat(50));
  console.log(`\n📊 Resultado: ${passed} ✅ / ${failed} ❌\n`);

  if (failed === 0) {
    console.log('🎉 Tudo está configurado corretamente!');
    console.log('Agora o download de ebooks deve funcionar normalmente.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Há problemas na configuração. Veja acima para detalhes.\n');
    process.exit(1);
  }
}

testEbookSetup().catch(err => {
  console.error('❌ Erro crítico:', err.message);
  process.exit(1);
});
