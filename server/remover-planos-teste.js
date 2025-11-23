import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function removerPlanosTeste() {
  try {
    console.log('🗑️ Removendo planos de teste...\n');

    // Listar todos os planos
    const { data: allPlans, error: listError } = await supabase
      .from('business_plans')
      .select('*')
      .order('price', { ascending: true });

    if (listError) {
      console.error('❌ Erro ao listar planos:', listError);
      return;
    }

    console.log('📋 Planos atuais:');
    allPlans.forEach(plan => {
      console.log(`  - ${plan.name}: R$ ${plan.price} (ID: ${plan.id})`);
    });

    // Identificar planos de teste (preço muito baixo)
    const planosParaRemover = allPlans.filter(plan => 
      plan.price < 40 || 
      plan.name.toLowerCase().includes('teste') ||
      plan.name.toLowerCase().includes('test')
    );

    if (planosParaRemover.length === 0) {
      console.log('\n✅ Nenhum plano de teste encontrado!');
      return;
    }

    console.log('\n🎯 Planos de teste identificados:');
    planosParaRemover.forEach(plan => {
      console.log(`  ❌ ${plan.name}: R$ ${plan.price}`);
    });

    // Remover planos de teste
    for (const plan of planosParaRemover) {
      const { error: deleteError } = await supabase
        .from('business_plans')
        .delete()
        .eq('id', plan.id);

      if (deleteError) {
        console.error(`❌ Erro ao remover ${plan.name}:`, deleteError);
      } else {
        console.log(`✅ Removido: ${plan.name}`);
      }
    }

    // Listar planos restantes
    const { data: finalPlans, error: finalError } = await supabase
      .from('business_plans')
      .select('*')
      .order('price', { ascending: true });

    if (finalError) {
      console.error('❌ Erro ao listar planos finais:', finalError);
      return;
    }

    console.log('\n📋 Planos restantes:');
    if (finalPlans.length === 0) {
      console.log('  ⚠️ Nenhum plano restante! Execute criar-planos-producao.js');
    } else {
      finalPlans.forEach(plan => {
        console.log(`  ✅ ${plan.name}: R$ ${plan.price.toFixed(2)}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

removerPlanosTeste();
