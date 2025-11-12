import dotenv from "dotenv";

dotenv.config();

async function testarPermissoes() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  
  console.log("🔍 Testando permissões da conta MP...\n");
  console.log("🔑 Token:", token?.slice(0, 20) + "...");
  
  // 1. Testar informações da conta
  console.log("\n1️⃣ Testando /v1/users/me");
  const userResponse = await fetch("https://api.mercadopago.com/v1/users/me", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  const userData = await userResponse.json();
  console.log("Status:", userResponse.status);
  console.log("Resposta:", JSON.stringify(userData, null, 2));
  
  // 2. Verificar se pode listar planos
  console.log("\n2️⃣ Testando /preapproval_plan/search");
  const plansResponse = await fetch("https://api.mercadopago.com/preapproval_plan/search", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  const plansData = await plansResponse.json();
  console.log("Status:", plansResponse.status);
  console.log("Resposta:", JSON.stringify(plansData, null, 2));
  
  // 3. Verificar aplicação
  console.log("\n3️⃣ Informações sobre a aplicação:");
  console.log("User ID:", userData.id);
  console.log("Email:", userData.email);
  console.log("Tipo de conta:", userData.site_id);
  
  if (plansResponse.status === 401 || plansResponse.status === 403) {
    console.log("\n⚠️  PROBLEMA IDENTIFICADO:");
    console.log("Sua aplicação não tem permissão para assinaturas!");
    console.log("\n🔧 Solução:");
    console.log("1. Acesse: https://www.mercadopago.com.br/developers/panel/app");
    console.log("2. Selecione sua aplicação");
    console.log("3. Vá em 'Configurações' → 'Permissões'");
    console.log("4. Ative: 'Manage subscriptions' ou 'Gerenciar assinaturas'");
    console.log("5. Salve e gere novas credenciais se necessário");
  }
}

testarPermissoes();
