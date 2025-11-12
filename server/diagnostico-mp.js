import dotenv from "dotenv";

dotenv.config();

async function verificarStatusConta() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  
  console.log("🔍 Verificando status da aplicação MP...\n");
  
  // Buscar informações da aplicação
  const appId = token.match(/APP_USR-(\d+)-/)?.[1];
  console.log("📱 Application ID:", appId);
  
  // Listar planos criados
  const plansResponse = await fetch("https://api.mercadopago.com/preapproval_plan/search", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  const plansData = await plansResponse.json();
  
  console.log("\n📊 Status da aplicação:");
  console.log("- Planos criados:", plansData.paging?.total || 0);
  console.log("- Collector ID:", plansData.results?.[0]?.collector_id);
  
  if (plansData.results && plansData.results.length > 0) {
    const plano = plansData.results[0];
    console.log("\n📋 Último plano criado:");
    console.log("- ID:", plano.id);
    console.log("- Status:", plano.status);
    console.log("- Valor:", `R$ ${plano.auto_recurring.transaction_amount}`);
    console.log("- Assinantes:", plano.subscribed);
    console.log("- Link:", plano.init_point);
    
    console.log("\n🎯 Diagnóstico:");
    
    if (plano.auto_recurring.transaction_amount < 10) {
      console.log("⚠️  PROBLEMA: Valor muito baixo (R$ 1,00)");
      console.log("   Solução: Aumentar para R$ 10,00 ou mais");
      console.log("   Execute: node atualizar-plano-r10.js");
    } else {
      console.log("✅ Valor adequado");
    }
    
    if (plano.subscribed === 0) {
      console.log("\n💡 Dicas para primeira assinatura:");
      console.log("1. Use um cartão que você já usou antes em compras no Mercado Pago");
      console.log("2. Faça login na sua conta MP antes de pagar");
      console.log("3. Use o mesmo dispositivo/navegador de sempre");
      console.log("4. Se possível, faça uma compra simples no ML/MP antes");
    }
  }
  
  console.log("\n🔗 Links úteis:");
  console.log("- Painel: https://www.mercadopago.com.br/developers/panel");
  console.log("- Assinaturas: https://www.mercadopago.com.br/subscriptions/list");
}

verificarStatusConta();
