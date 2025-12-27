import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { sendNewSubscriptionNotification, sendSubscriptionConfirmationToCustomer } from './services/emailService.js';

const supabase = createClient(
  'https://rhkwickoweflamflgzeo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc2MjI4MywiZXhwIjoyMDcwMzM4MjgzfQ.wNurKd9yi4X9ylkGkanHdRHBxCOlcLxipEoKo0gl4U4'
);

async function sendConfirmationEmail() {
  try {
    console.log('\n📧 ENVIANDO EMAIL DE CONFIRMAÇÃO');
    console.log('=================================\n');

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

    console.log('✅ Assinatura encontrada:', subscription.id);

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

    console.log('✅ Negócio encontrado:', business.establishment_name);
    console.log('   Contact Email:', business.contact_email);

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

    console.log('✅ Plano encontrado:', plan.name, '- R$', plan.price);

    // 4. Enviar email de notificação ao admin
    console.log('\n📧 Enviando email ao admin...');
    const emailResult = await sendNewSubscriptionNotification({
      businessName: business.establishment_name,
      businessEmail: business.contact_email,
      planName: plan.name,
      planPrice: plan.price,
      customerEmail: business.payer_email
    });

    if (emailResult.success) {
      console.log('✅ Email ao admin enviado com sucesso!');
      console.log('   Email ID:', emailResult.emailId);
    } else {
      console.error('❌ Falha ao enviar email ao admin:', emailResult.error);
    }

    // 5. Enviar email de confirmação ao cliente
    console.log('\n📧 Enviando email de confirmação ao cliente...');
    console.log(`   Email do cliente: ${business.contact_email}`);
    
    const customerEmailResult = await sendSubscriptionConfirmationToCustomer({
      customerEmail: business.contact_email, // Agora pode usar o email real
      businessName: business.establishment_name,
      planName: plan.name,
      planPrice: plan.price,
      subscriptionId: subscription.external_subscription_id
    });

    if (customerEmailResult.success) {
      console.log('✅ Email ao cliente enviado com sucesso!');
      console.log('   Email ID:', customerEmailResult.emailId);
    } else {
      console.error('❌ Falha ao enviar email ao cliente:', customerEmailResult.error);
    }

    console.log('\n✅ PROCESSO CONCLUÍDO!');
    console.log('   Verifique sua caixa de entrada: lucaswildre@gmail.com');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

sendConfirmationEmail();
