#!/usr/bin/env node

/**
 * Script para adicionar coluna 'status' à tabela business_registrations
 * Se a coluna já existir, não causa erro
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_KEY não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addStatusColumn() {
  try {
    console.log('⏳ Adicionando coluna "status" à tabela business_registrations...');
    
    // Usar a função RPC ou executar SQL diretamente
    // Como estamos usando o cliente Supabase, vamos usar a API de bancos de dados
    
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          ALTER TABLE public.business_registrations
          ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
          
          CREATE INDEX IF NOT EXISTS idx_business_registrations_status 
          ON public.business_registrations(status);
        `
      })
      .catch(() => {
        // Se RPC não existir, use dados fictícios para teste
        console.log('⚠️  RPC exec_sql não disponível, tentando verificar a tabela...');
        return { data: null, error: 'RPC não disponível' };
      });

    if (!error) {
      console.log('✅ Coluna "status" adicionada com sucesso (ou já existia)');
      return true;
    }

    // Alternativa: tentar usar uma query SQL simples verificando se a coluna existe
    console.log('⚠️  ' + error);
    console.log('\n📌 Para adicionar a coluna manualmente:');
    console.log('   1. Vá para: https://app.supabase.com/project/_/editor');
    console.log('   2. Dê clique e rode este SQL:');
    console.log(`
ALTER TABLE public.business_registrations
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_business_registrations_status 
ON public.business_registrations(status);
    `);
    
    process.exit(1);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

addStatusColumn();
