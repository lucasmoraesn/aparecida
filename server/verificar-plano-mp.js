import dotenv from "dotenv";
dotenv.config();

// Verificar o plano criado no Mercado Pago
async function verificarPlano() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  const planId = "5ee0072ec1c04850889cc47964df2161"; // ID do plano criado
  
  console.log("🔍 Verificando plano:", planId);
  console.log("🔑 Token:", token?.slice(0, 20) + "...");
  
  try {
    // 1. Buscar detalhes do plano
    const response = await fetch(
      `https://api.mercadopago.com/preapproval_plan/${planId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("\n📡 Status:", response.status);
    
    const data = await response.json();
    console.log("\n📦 Detalhes do Plano:");
    console.log(JSON.stringify(data, null, 2));
    
    // 2. Verificar se podemos atualizar com payment methods
    if (response.ok && data.id) {
      console.log("\n🔧 Tentando adicionar métodos de pagamento permitidos...");
      
      const updateResponse = await fetch(
        `https://api.mercadopago.com/preapproval_plan/${planId}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_methods_allowed: {
              payment_types: [{ id: "credit_card" }],
              payment_methods: [{ id: "all" }],
            },
          }),
        }
      );
      
      console.log("\n📡 Update Status:", updateResponse.status);
      const updateData = await updateResponse.json();
      console.log("\n📦 Update Response:");
      console.log(JSON.stringify(updateData, null, 2));
    }
    
  } catch (error) {
    console.error("\n❌ Erro:", error.message);
  }
}

// Importar fetch se necessário
if (typeof fetch === "undefined") {
  const mod = await import("node-fetch");
  global.fetch = mod.default;
}

verificarPlano();
