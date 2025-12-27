import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rhkwickoweflamflgzeo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc2MjI4MywiZXhwIjoyMDcwMzM4MjgzfQ.wNurKd9yi4X9ylkGkanHdRHBxCOlcLxipEoKo0gl4U4'
);

async function testEmailSending() {
  try {
    console.log('\n🧪 TESTE DE ENVIO DE EMAIL');
    console.log('===========================\n');

    // 1. Buscar a assinatura
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('external_subscription_id', 'sub_1Sj0TPJRpc53eVmKDA2m9oSf')
      .single();

    if (subError) {
      console.error('❌ Erro ao buscar assinatura:', subError);
      return;
    }

    console.log('✅ Assinatura encontrada:');
    console.log('   ID:', subscription.id);
    console.log('   Business ID:', subscription.business_id);
    console.log('   Plan ID:', subscription.plan_id);

    // 2. Buscar dados do negócio
    const { data: business, error: businessError } = await supabase
      .from('business_registrations')
      .select('*')
      .eq('id', subscription.business_id)
      .single();

    if (businessError) {
      console.error('❌ Erro ao buscar business:', businessError);
      return;
    }

    console.log('\n✅ Negócio encontrado:');
    console.log('   Nome:', business.establishment_name);
    console.log('   WhatsApp:', business.whatsapp);
    console.log('   Contact Email:', business.contact_email || '❌ NÃO TEM');
    console.log('   Admin Email:', business.admin_email || '❌ NÃO TEM');
    console.log('   Payer Email:', business.payer_email || '❌ NÃO TEM');

    // 3. Buscar plano
    const { data: plan, error: planError } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', subscription.plan_id)
      .single();

    if (planError) {
      console.error('❌ Erro ao buscar plano:', planError);
      return;
    }

    console.log('\n✅ Plano encontrado:');
    console.log('   Nome:', plan.name);
    console.log('   Preço:', plan.price);

    // 4. Simular dados de email
    console.log('\n📧 DADOS QUE SERIAM USADOS NO EMAIL:');
    console.log('   Para (Admin): admin@aparecida.com');
    console.log('   Para (Cliente):', business.contact_email || 'lucaswildre@gmail.com');
    console.log('   Negócio:', business.establishment_name);
    console.log('   Plano:', plan.name);
    console.log('   Valor: R$', plan.price);
    console.log('   WhatsApp:', business.whatsapp);

    console.log('\n💡 PRÓXIMO PASSO:');
    console.log('   Acesse https://supabase.com/dashboard/project/rhkwickoweflamflgzeo/editor');
    console.log('   Vá na tabela business_registrations');
    console.log('   Encontre o registro ID:', subscription.business_id);
    console.log('   Adicione manualmente:');
    console.log('     - contact_email: lucaswildre@gmail.com');
    console.log('     - admin_email: admin@aparecida.com');
    console.log('     - payer_email: lucaswildre@gmail.com');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testEmailSending();
