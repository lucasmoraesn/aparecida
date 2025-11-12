import dotenv from "dotenv";

dotenv.config();

async function diagnosticoCompleto() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  
  console.log("🔍 DIAGNÓSTICO COMPLETO DA INTEGRAÇÃO\n");
  console.log("=" .repeat(60));
  
  // 1. Verificar conta
  console.log("\n1️⃣ INFORMAÇÕES DA CONTA");
  const accountResponse = await fetch("https://api.mercadopago.com/users/me", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (accountResponse.ok) {
    const accountData = await accountResponse.json();
    console.log("✅ Conta encontrada:");
    console.log("   ID:", accountData.id);
    console.log("   Email:", accountData.email);
    console.log("   País:", accountData.site_id);
    console.log("   Tipo:", accountData.user_type);
  } else {
    console.log("❌ Erro ao buscar conta:", accountResponse.status);
  }
  
  // 2. Listar planos criados
  console.log("\n2️⃣ PLANOS DE ASSINATURA CRIADOS");
  const plansResponse = await fetch("https://api.mercadopago.com/preapproval_plan/search", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  const plansData = await plansResponse.json();
  console.log(`Total de planos: ${plansData.paging?.total || 0}`);
  
  if (plansData.results && plansData.results.length > 0) {
    plansData.results.forEach((plan, index) => {
      console.log(`\n   Plano ${index + 1}:`);
      console.log(`   - ID: ${plan.id}`);
      console.log(`   - Nome: ${plan.reason}`);
      console.log(`   - Valor: R$ ${plan.auto_recurring.transaction_amount}`);
      console.log(`   - Status: ${plan.status}`);
      console.log(`   - Assinantes: ${plan.subscribed}`);
    });
  }
  
  // 3. Verificar assinaturas (tentativas de pagamento)
  console.log("\n3️⃣ ASSINATURAS/TENTATIVAS DE PAGAMENTO");
  const subscriptionsResponse = await fetch("https://api.mercadopago.com/preapproval/search", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (subscriptionsResponse.ok) {
    const subscriptionsData = await subscriptionsResponse.json();
    console.log(`Total de assinaturas: ${subscriptionsData.paging?.total || 0}`);
    
    if (subscriptionsData.results && subscriptionsData.results.length > 0) {
      subscriptionsData.results.slice(0, 3).forEach((sub, index) => {
        console.log(`\n   Assinatura ${index + 1}:`);
        console.log(`   - ID: ${sub.id}`);
        console.log(`   - Status: ${sub.status}`);
        console.log(`   - Motivo: ${sub.reason || 'N/A'}`);
        console.log(`   - Pagador: ${sub.payer_email || sub.payer_id || 'N/A'}`);
      });
    }
  } else {
    console.log("❌ Erro ao buscar assinaturas:", subscriptionsResponse.status);
  }
  
  // 4. Verificar aplicação
  console.log("\n4️⃣ STATUS DA APLICAÇÃO");
  const appId = token.match(/APP_USR-(\d+)-/)?.[1];
  console.log(`Application ID: ${appId}`);
  
  // 5. Recomendações
  console.log("\n5️⃣ DIAGNÓSTICO E RECOMENDAÇÕES");
  console.log("=" .repeat(60));
  
  if (plansData.results && plansData.results.length > 0) {
    const ultimoPlano = plansData.results[0];
    
    if (ultimoPlano.subscribed === 0) {
      console.log("⚠️  PROBLEMA IDENTIFICADO: Nenhuma assinatura bem-sucedida");
      console.log("\n   Possíveis causas:");
      console.log("   1. Conta ainda não foi aprovada para produção pelo MP");
      console.log("   2. Aplicação precisa de certificação para assinaturas");
      console.log("   3. Limites de produção ainda não ativados");
      
      console.log("\n   ✅ SOLUÇÃO DEFINITIVA:");
      console.log("   Entre em contato com o suporte do Mercado Pago:");
      console.log("   - URL: https://www.mercadopago.com.br/developers/panel/support");
      console.log("   - Informe: 'Preciso ativar assinaturas em produção'");
      console.log(`   - Application ID: ${appId}`);
      console.log("   - Mencione que a integração está completa e testada");
    }
    
    if (ultimoPlano.auto_recurring.transaction_amount < 10) {
      console.log("\n⚠️  ATENÇÃO: Valor abaixo do recomendado");
      console.log(`   Valor atual: R$ ${ultimoPlano.auto_recurring.transaction_amount}`);
      console.log("   Recomendado: R$ 10,00 ou mais para produção");
    }
  }
  
  console.log("\n" + "=".repeat(60));
}

diagnosticoCompleto();
