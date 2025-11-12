import dotenv from "dotenv";

dotenv.config();

async function testarNovasCred() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  
  console.log("🔍 Testando novas credenciais...\n");
  console.log("🔑 Token:", token?.slice(0, 25) + "...");
  
  // 1. Testar acesso básico
  console.log("\n1️⃣ Testando acesso à API...");
  const userResponse = await fetch("https://api.mercadopago.com/users/me", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (userResponse.ok) {
    const userData = await userResponse.json();
    console.log("✅ Conta ativa:");
    console.log("   ID:", userData.id);
    console.log("   Email:", userData.email);
    console.log("   Site:", userData.site_id);
  } else {
    console.log("❌ Erro:", userResponse.status);
    const errorData = await userResponse.json().catch(() => ({}));
    console.log("   Detalhes:", errorData);
  }
  
  // 2. Testar criação de plano
  console.log("\n2️⃣ Testando criação de plano de teste...");
  const testPlanResponse = await fetch("https://api.mercadopago.com/preapproval_plan", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: "Plano Teste Nova Conta",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 5,
        currency_id: "BRL"
      },
      back_url: "https://www.mercadopago.com.br"
    })
  });
  
  console.log("Status:", testPlanResponse.status);
  
  if (testPlanResponse.ok) {
    const planData = await testPlanResponse.json();
    console.log("✅ Plano criado com sucesso!");
    console.log("   ID:", planData.id);
    console.log("   Link:", planData.init_point);
  } else {
    const errorData = await testPlanResponse.json().catch(() => ({}));
    console.log("❌ Erro ao criar plano:");
    console.log(JSON.stringify(errorData, null, 2));
  }
}

testarNovasCred();
