import dotenv from "dotenv";
import { PagBankService } from "./payments/pagbankService.js";
import { safeLog } from "./utils/logger.js";

dotenv.config();

console.log("🧪 TESTE PAGBANK - MODO SANDBOX\n");
console.log("=" .repeat(60));
console.log("📋 Configuração:");
console.log("   Base URL:", process.env.PAGBANK_BASE_URL);
console.log("   Token:", process.env.PAGBANK_TOKEN?.substring(0, 30) + "...");
console.log("=" .repeat(60));
console.log("");

// Dados de teste usando cartões de sandbox do PagBank
const testData = {
  // Valor do pedido (em reais)
  amount: 10.00,
  description: "Teste de Assinatura - Ambiente Sandbox",
  referenceId: `test_order_${Date.now()}`,
  
  // Dados do cliente de teste
  customerName: "Jose da Silva",
  customerEmail: "teste@sandbox.pagseguro.com.br",
  customerTaxId: "12345678909", // CPF de teste
  
  // Cartão de teste PagBank (aprovado automaticamente)
  cardNumber: "4111111111111111", // Visa de teste
  cardExpMonth: "12",
  cardExpYear: "2030",
  cardSecurityCode: "123",
  
  installments: 1,
  
  // URL de notificação (opcional)
  notificationUrl: process.env.PAGBANK_WEBHOOK_URL || undefined,
};

console.log("📦 Dados do teste:");
console.log("   Cliente:", testData.customerEmail);
console.log("   Valor: R$", testData.amount);
console.log("   Cartão:", testData.cardNumber.substring(0, 4) + " **** **** " + testData.cardNumber.substring(12));
console.log("");

async function runTest() {
  try {
    console.log("🚀 Iniciando teste de pagamento...\n");
    
    const result = await PagBankService.createOrder(testData);
    
    console.log("=" .repeat(60));
    console.log("✅ SUCESSO! Pedido criado com sucesso!");
    console.log("=" .repeat(60));
    console.log("");
    console.log("📄 Resposta da API:");
    console.log("   Order ID:", result.id);
    console.log("   Reference ID:", result.reference_id);
    console.log("   Status:", result.charges?.[0]?.status || "N/A");
    console.log("   Valor:", `R$ ${(result.charges?.[0]?.amount?.value / 100).toFixed(2)}`);
    console.log("   Criado em:", result.created_at);
    console.log("");
    
    if (result.charges?.[0]?.status === "PAID") {
      console.log("💰 Pagamento APROVADO!");
    } else if (result.charges?.[0]?.status === "DECLINED") {
      console.log("❌ Pagamento RECUSADO!");
    } else {
      console.log("⏳ Status:", result.charges?.[0]?.status);
    }
    
    console.log("");
    console.log("📋 Dados completos da resposta:");
    safeLog(result);
    
    console.log("");
    console.log("=" .repeat(60));
    console.log("🎉 TESTE CONCLUÍDO COM SUCESSO!");
    console.log("=" .repeat(60));
    
  } catch (error) {
    console.log("=" .repeat(60));
    console.log("❌ ERRO NO TESTE!");
    console.log("=" .repeat(60));
    console.log("");
    
    if (error.response) {
      console.log("📡 Status HTTP:", error.response.status);
      console.log("📄 Resposta da API:");
      console.log(JSON.stringify(error.response.data, null, 2));
      console.log("");
      
      if (error.response.status === 401) {
        console.log("🔑 ERRO DE AUTENTICAÇÃO");
        console.log("   O token pode estar inválido ou expirado.");
        console.log("   Verifique:");
        console.log("   1. Se o token está correto no arquivo .env");
        console.log("   2. Se você está usando o token de SANDBOX");
        console.log("   3. Gere um novo token em: https://dev.pagseguro.uol.com.br/credentials");
      } else if (error.response.status === 400) {
        console.log("📋 ERRO DE VALIDAÇÃO");
        console.log("   Verifique os dados enviados:");
        console.log("   - Formato do CPF");
        console.log("   - Dados do cartão");
        console.log("   - Valores e datas");
      }
    } else {
      console.log("🔌 Erro de conexão ou outro erro:");
      console.log(error.message);
    }
    
    console.log("");
    console.log("=" .repeat(60));
    process.exit(1);
  }
}

// Teste 2: Cartão que deve ser recusado (no sandbox, pode aprovar também)
async function testDeclined() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TESTE 2: Cartão que deve ser recusado");
  console.log("=" .repeat(60));
  console.log("");
  
  const declinedData = {
    ...testData,
    referenceId: `test_declined_${Date.now()}`,
    cardNumber: "4000000000000010", // Cartão que deve ser recusado
    description: "Teste de Pagamento Recusado - Sandbox",
  };
  
  try {
    console.log("🚀 Testando pagamento com cartão que deve ser recusado...\n");
    
    const result = await PagBankService.createOrder(declinedData);
    
    console.log("📄 Resposta:");
    console.log("   Order ID:", result.id);
    console.log("   Status:", result.charges?.[0]?.status);
    
    if (result.charges?.[0]?.status === "DECLINED") {
      console.log("✅ Recusado conforme esperado!");
    } else {
      console.log("⚠️  Sandbox pode aprovar todos os cartões. Status:", result.charges?.[0]?.status);
    }
    
  } catch (error) {
    console.log("⚠️  Erro esperado:", error.response?.data?.message || error.message);
  }
}

// Executar testes
console.log("🎬 Iniciando bateria de testes...\n");

(async () => {
  await runTest();
  await testDeclined();
  
  console.log("");
  console.log("=" .repeat(60));
  console.log("✨ TODOS OS TESTES CONCLUÍDOS!");
  console.log("=" .repeat(60));
  console.log("");
  console.log("📝 Próximos passos:");
  console.log("   1. Verifique os pedidos criados no painel do PagBank");
  console.log("   2. Configure o webhook para receber notificações");
  console.log("   3. Teste a integração completa com seu frontend");
  console.log("");
})();
