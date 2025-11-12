import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.PAGBANK_TOKEN;

console.log("🧪 TESTE DE TOKEN PAGBANK\n");
console.log("Token configurado:", token?.substring(0, 30) + "...");
console.log("Base URL:", process.env.PAGBANK_BASE_URL);
console.log("\n📡 Testando autenticação...\n");

// Teste 1: Public Keys
async function test1() {
  try {
    console.log("1️⃣ Testando endpoint /public-keys (COM Bearer)");
    const response = await axios.get(`${process.env.PAGBANK_BASE_URL}/public-keys`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Sucesso! Resposta:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Erro:", error.response?.status, error.response?.data?.message || error.message);
  }
}

// Teste 1b: Sem Bearer
async function test1b() {
  try {
    console.log("\n1️⃣B Testando endpoint /public-keys (SEM Bearer)");
    const response = await axios.get(`${process.env.PAGBANK_BASE_URL}/public-keys`, {
      headers: {
        Authorization: token, // Direto
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Sucesso! Resposta:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Erro:", error.response?.status, error.response?.data?.message || error.message);
  }
}

// Teste 2: Orders (listar)
async function test2() {
  try {
    console.log("\n2️⃣ Testando endpoint /orders (GET)");
    const response = await axios.get(`${process.env.PAGBANK_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Sucesso! Resposta:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Erro:", error.response?.status, error.response?.data?.message || error.message);
  }
}

// Executar testes
(async () => {
  await test1();
  await test1b();
  await test2();
  
  console.log("\n\n📝 RESULTADO:");
  console.log("Se todos os testes falharam com 401/403, o token está inválido.");
  console.log("Acesse: https://dev.pagseguro.uol.com.br/credentials");
  console.log("E gere um novo token de SANDBOX.");
})();
