import dotenv from "dotenv";

dotenv.config();

async function verificarStatusConta() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  
  console.log("🔍 Verificando status completo da conta MP...\n");
  
  // Buscar informações da conta
  const accountResponse = await fetch("https://api.mercadopago.com/users/me", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (accountResponse.ok) {
    const account = await accountResponse.json();
    console.log("✅ Informações da conta:");
    console.log("   Email:", account.email);
    console.log("   ID:", account.id);
    console.log("   Status:", account.status);
    console.log("   Tipo:", account.user_type);
    console.log("   País:", account.site_id);
    
    // Verificar se há bloqueios
    if (account.status && account.status !== 'active') {
      console.log("\n⚠️  ATENÇÃO: Conta não está ativa!");
      console.log("   Status:", account.status);
    }
  }
  
  // Listar assinaturas
  const subsResponse = await fetch("https://api.mercadopago.com/preapproval/search", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (subsResponse.ok) {
    const subsData = await subsResponse.json();
    console.log("\n📊 Total de assinaturas criadas:", subsData.paging?.total || 0);
    
    if (subsData.results && subsData.results.length > 0) {
      console.log("\n📋 Últimas 3 assinaturas:");
      subsData.results.slice(0, 3).forEach((sub, i) => {
        console.log(`\n   ${i + 1}. Status: ${sub.status}`);
        console.log(`      Razão: ${sub.reason || 'N/A'}`);
        console.log(`      Data: ${sub.date_created || 'N/A'}`);
      });
    }
  }
  
  console.log("\n💡 Recomendações:");
  console.log("1. Se a conta foi criada hoje, aguarde 24h");
  console.log("2. Verifique se preencheu os dados da conta no painel MP");
  console.log("3. Entre em contato com o suporte se persistir:");
  console.log("   https://www.mercadopago.com.br/developers/panel/support");
}

verificarStatusConta();
