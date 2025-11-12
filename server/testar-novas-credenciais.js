import dotenv from "dotenv";

dotenv.config();

async function testarNovasCredenciais() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  
  console.log("🔍 Testando NOVAS credenciais de produção...\n");
  console.log("🔑 Token:", token?.slice(0, 20) + "...");
  console.log("🆔 Account ID:", token?.match(/APP_USR-(\d+)-/)?.[1]);
  
  // Testar acesso à API
  console.log("\n1️⃣ Testando acesso à conta...");
  const accountResponse = await fetch("https://api.mercadopago.com/users/me", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (accountResponse.ok) {
    const accountData = await accountResponse.json();
    console.log("✅ Conta ativa!");
    console.log("   Email:", accountData.email);
    console.log("   ID:", accountData.id);
    console.log("   País:", accountData.site_id);
  } else {
    console.log("❌ Erro ao acessar conta:", accountResponse.status);
    const errorData = await accountResponse.json();
    console.log("   Detalhes:", errorData);
  }
  
  // Testar criação de plano
  console.log("\n2️⃣ Testando criação de plano de assinatura...");
  const testPlan = {
    reason: "Teste - Plano Simples",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 5,
      currency_id: "BRL"
    },
    back_url: "https://www.mercadopago.com.br"
  };
  
  const planResponse = await fetch("https://api.mercadopago.com/preapproval_plan", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testPlan)
  });
  
  console.log("Status:", planResponse.status);
  
  if (planResponse.ok) {
    const planData = await planResponse.json();
    console.log("✅ Plano criado com sucesso!");
    console.log("   ID:", planData.id);
    console.log("   Status:", planData.status);
    console.log("   Link:", planData.init_point);
  } else {
    const errorData = await planResponse.json();
    console.log("❌ Erro ao criar plano:");
    console.log(JSON.stringify(errorData, null, 2));
  }
}

testarNovasCredenciais();
