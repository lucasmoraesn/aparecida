import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function desativarPlanosTeste() {
  try {
    console.log('🔒 Desativando planos de teste...\n');

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
      console.log(`  - ${plan.name}: R$ ${plan.price} (Ativo: ${plan.is_active ? '✅' : '❌'})`);
    });

    // Identificar planos de teste
    const planosParaDesativar = allPlans.filter(plan => 
      plan.price < 40 || 
      plan.name.toLowerCase().includes('teste') ||
      plan.name.toLowerCase().includes('test')
    );

    if (planosParaDesativar.length === 0) {
      console.log('\n✅ Nenhum plano de teste encontrado!');
      return;
    }

    console.log('\n🎯 Planos de teste para desativar:');
    planosParaDesativar.forEach(plan => {
      console.log(`  🔒 ${plan.name}: R$ ${plan.price}`);
    });

    // Desativar planos de teste
    for (const plan of planosParaDesativar) {
      const { error: updateError } = await supabase
        .from('business_plans')
        .update({ is_active: false })
        .eq('id', plan.id);

      if (updateError) {
        console.error(`❌ Erro ao desativar ${plan.name}:`, updateError);
      } else {
        console.log(`✅ Desativado: ${plan.name}`);
      }
    }

    // Listar planos ativos
    const { data: activePlans, error: activeError } = await supabase
      .from('business_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (activeError) {
      console.error('❌ Erro ao listar planos ativos:', activeError);
      return;
    }

    console.log('\n📋 Planos ATIVOS (visíveis no frontend):');
    activePlans.forEach(plan => {
      console.log(`  ✅ ${plan.name}: R$ ${plan.price.toFixed(2)}`);
    });

    console.log('\n✅ Operação concluída!');
    console.log('   Os planos de teste foram desativados mas mantidos no banco');
    console.log('   para preservar o histórico de assinaturas antigas.');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

desativarPlanosTeste();
