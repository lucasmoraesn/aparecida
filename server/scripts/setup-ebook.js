#!/usr/bin/env node
import 'dotenv/config.js';
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const supabase = getSupabaseAdmin();

async function setupEbook() {
  try {
    console.log('🚀 Iniciando setup do bucket de ebooks...\n');

    // 1. Criar bucket
    console.log('1️⃣  Criando bucket "ebooks"...');
    const { error: createError } = await supabase.storage.createBucket('ebooks', {
      public: false,
      allowedMimeTypes: ['application/pdf'],
    });

    if (createError && !createError.message.includes('already exists')) {
      throw new Error(`Erro ao criar bucket: ${createError.message}`);
    }

    if (!createError) {
      console.log('✅ Bucket "ebooks" criado com sucesso!');
    } else {
      console.log('✅ Bucket "ebooks" já existe');
    }

    // 2. Procurar pelo arquivo PDF
    console.log('\n2️⃣  Procurando pelo arquivo PDF...');
    const projectRoot = path.join(__dirname, '..');
    const possiblePaths = [
      path.join(projectRoot, '..', 'kitromeiro2026.pdf'),
      path.join(projectRoot, '..', 'kit-romeiro-2026.pdf'),
      path.join(projectRoot, '..', 'ebook.pdf'),
      path.join(projectRoot, '..', 'public', 'kit-romeiro-2026.pdf'),
    ];

    let ebookPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        ebookPath = p;
        console.log(`✅ Arquivo encontrado: ${p}`);
        break;
      }
    }

    if (!ebookPath) {
      console.log('\n❌ Arquivo PDF não encontrado!');
      console.log('\n📍 Locais verificados:');
      possiblePaths.forEach(p => console.log(`   - ${p}`));
      console.log('\n📋 Próximos passos:');
      console.log('1. Coloque o arquivo PDF em um dos locais acima');
      console.log('2. Nomeie como "kit-romeiro-2026.pdf"');
      console.log('3. Execute este script novamente');
      process.exit(1);
    }

    // 3. Fazer upload
    console.log('\n3️⃣  Fazendo upload do arquivo...');
    const fileBuffer = fs.readFileSync(ebookPath);
    const fileName = 'kit-romeiro-2026.pdf';

    const { error: uploadError, data } = await supabase.storage
      .from('ebooks')
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true, // Sobrescrever se já existir
      });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    console.log(`✅ Arquivo "${fileName}" enviado com sucesso!`);

    // 4. Gerar e testar URL
    console.log('\n4️⃣  Gerando URL segura de download...');
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('ebooks')
      .createSignedUrl(fileName, 86400); // 24 horas

    if (urlError) {
      throw new Error(`Erro ao gerar URL: ${urlError.message}`);
    }

    console.log(`✅ URL segura gerada com sucesso!`);
    console.log(`\n🔗 URL de teste (válida por 24h):`);
    console.log(signedUrl.signedUrl);

    console.log('\n✨ Setup concluído com sucesso!');
    console.log('Agora o download de ebooks deve funcionar normalmente.');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setupEbook();
