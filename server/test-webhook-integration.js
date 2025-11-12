import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log("🧪 TESTE DE WEBHOOK PAGBANK - RELATÓRIO COMPLETO\n");
console.log("=".repeat(70));
console.log("📋 Configuração:");
console.log("   URL Base:", process.env.VITE_PUBLIC_URL_NGROK || "http://localhost:3001");
console.log("   Secret:", process.env.PAGBANK_WEBHOOK_SECRET ? "Configurado ✅" : "Não configurado ❌");
console.log("=".repeat(70));
console.log("");

const BASE_URL = process.env.VITE_PUBLIC_URL_NGROK || "http://localhost:3001";
const WEBHOOK_SECRET = process.env.PAGBANK_WEBHOOK_SECRET || "test-secret-key-123";

// Payload de exemplo de webhook do PagBank
const mockWebhookPayload = {
  id: "ORDE_TEST_" + Date.now(),
  reference_id: "test_ref_" + Date.now(),
  customer: {
    name: "Jose da Silva",
    email: "test@example.com",
    tax_id: "12345678909",
  },
  charges: [
    {
      id: "CHAR_TEST_" + Date.now(),
      status: "PAID",
      amount: {
        value: 1000,
        currency: "BRL",
      },
      payment_method: {
        type: "CREDIT_CARD",
        installments: 1,
      },
    },
  ],
  created_at: new Date().toISOString(),
};

// Função para calcular assinatura HMAC
function calculateSignature(payload, secret) {
  const rawBody = JSON.stringify(payload);
  const hash = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return `sha256=${hash}`;
}

// Função para enviar webhook
async function sendWebhook(payload, signature, testName) {
  try {
    console.log(`\n🔄 ${testName}`);
    console.log("-".repeat(70));
    
    const response = await axios.post(
      `${BASE_URL}/api/pagbank/webhook`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-pagbank-signature": signature,
        },
      }
    );

    console.log("✅ PASS - Status:", response.status);
    console.log("   Resposta:", JSON.stringify(response.data, null, 2));
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log("❌ FAIL - Status:", error.response.status);
      console.log("   Resposta:", JSON.stringify(error.response.data, null, 2));
      return {
        success: false,
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      console.log("❌ FAIL - Erro de conexão:", error.message);
      return { success: false, error: error.message };
    }
  }
}

// Executar testes
async function runTests() {
  const results = [];

  console.log("\n" + "=".repeat(70));
  console.log("🧪 INICIANDO BATERIA DE TESTES");
  console.log("=".repeat(70));

  // Teste 1: Assinatura válida
  console.log("\n📝 TESTE 1: Webhook com assinatura válida");
  const validSignature = calculateSignature(mockWebhookPayload, WEBHOOK_SECRET);
  const test1 = await sendWebhook(
    mockWebhookPayload,
    validSignature,
    "Assinatura HMAC válida"
  );
  results.push({
    test: "Assinatura válida retorna 200",
    expected: 200,
    actual: test1.status,
    pass: test1.status === 200,
  });

  // Teste 2: Assinatura inválida
  console.log("\n📝 TESTE 2: Webhook com assinatura inválida");
  const invalidSignature = "sha256=invalid-signature-hash-12345";
  const test2 = await sendWebhook(
    mockWebhookPayload,
    invalidSignature,
    "Assinatura HMAC inválida"
  );
  results.push({
    test: "Assinatura inválida retorna 401",
    expected: 401,
    actual: test2.status,
    pass: test2.status === 401,
  });

  // Teste 3: Sem assinatura
  console.log("\n📝 TESTE 3: Webhook sem header de assinatura");
  const test3 = await sendWebhook(
    mockWebhookPayload,
    undefined,
    "Sem header x-pagbank-signature"
  );
  results.push({
    test: "Sem assinatura retorna 401",
    expected: 401,
    actual: test3.status,
    pass: test3.status === 401,
  });

  // Teste 4: Status DECLINED
  console.log("\n📝 TESTE 4: Evento DECLINED");
  const declinedPayload = {
    ...mockWebhookPayload,
    id: "ORDE_DECLINED_" + Date.now(),
    charges: [
      {
        ...mockWebhookPayload.charges[0],
        id: "CHAR_DECLINED_" + Date.now(),
        status: "DECLINED",
      },
    ],
  };
  const declinedSignature = calculateSignature(declinedPayload, WEBHOOK_SECRET);
  const test4 = await sendWebhook(
    declinedPayload,
    declinedSignature,
    "Status DECLINED processado"
  );
  results.push({
    test: "DECLINED retorna 200 e processa",
    expected: 200,
    actual: test4.status,
    pass: test4.status === 200,
  });

  // Teste 5: Status REFUNDED
  console.log("\n📝 TESTE 5: Evento REFUNDED");
  const refundedPayload = {
    ...mockWebhookPayload,
    id: "ORDE_REFUNDED_" + Date.now(),
    charges: [
      {
        ...mockWebhookPayload.charges[0],
        id: "CHAR_REFUNDED_" + Date.now(),
        status: "REFUNDED",
      },
    ],
  };
  const refundedSignature = calculateSignature(refundedPayload, WEBHOOK_SECRET);
  const test5 = await sendWebhook(
    refundedPayload,
    refundedSignature,
    "Status REFUNDED processado"
  );
  results.push({
    test: "REFUNDED retorna 200 e processa",
    expected: 200,
    actual: test5.status,
    pass: test5.status === 200,
  });

  // Teste 6: Payload inválido (JSON malformado)
  console.log("\n📝 TESTE 6: JSON malformado");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/pagbank/webhook`,
      "{ invalid json",
      {
        headers: {
          "Content-Type": "application/json",
          "x-pagbank-signature": validSignature,
        },
      }
    );
    results.push({
      test: "JSON malformado retorna 400",
      expected: 400,
      actual: response.status,
      pass: false,
    });
  } catch (error) {
    const status = error.response?.status || 0;
    results.push({
      test: "JSON malformado retorna 400",
      expected: 400,
      actual: status,
      pass: status === 400,
    });
    console.log("✅ PASS - Status:", status);
  }

  // Relatório final
  console.log("\n" + "=".repeat(70));
  console.log("📊 RELATÓRIO DE TESTES - WEBHOOK PAGBANK");
  console.log("=".repeat(70));
  console.log("");

  const passedTests = results.filter((r) => r.pass).length;
  const totalTests = results.length;

  console.log("Resultados:");
  console.log("");
  results.forEach((result, index) => {
    const status = result.pass ? "✅ PASS" : "❌ FAIL";
    console.log(
      `${index + 1}. ${status} - ${result.test}`
    );
    console.log(
      `   Esperado: ${result.expected}, Recebido: ${result.actual}`
    );
  });

  console.log("");
  console.log("=".repeat(70));
  console.log(`Total: ${passedTests}/${totalTests} testes passaram`);
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  console.log(`Taxa de sucesso: ${successRate}%`);
  
  if (passedTests === totalTests) {
    console.log("🎉 TODOS OS TESTES PASSARAM!");
  } else {
    console.log("⚠️  Alguns testes falharam. Verifique a configuração.");
  }
  console.log("=".repeat(70));

  // Resumo para o README
  console.log("\n" + "=".repeat(70));
  console.log("📋 RESUMO PARA DOCUMENTAÇÃO");
  console.log("=".repeat(70));
  console.log("");
  console.log("| Teste | Esperado | Resultado | Status |");
  console.log("|-------|----------|-----------|--------|");
  results.forEach((result) => {
    const status = result.pass ? "✅ PASS" : "❌ FAIL";
    console.log(
      `| ${result.test} | ${result.expected} | ${result.actual} | ${status} |`
    );
  });
  console.log("");

  return results;
}

// Executar
(async () => {
  console.log("⏰ Aguarde 2 segundos para garantir que o servidor está pronto...\n");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const results = await runTests();
    const allPassed = results.every((r) => r.pass);
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error("❌ Erro ao executar testes:", error.message);
    process.exit(1);
  }
})();
