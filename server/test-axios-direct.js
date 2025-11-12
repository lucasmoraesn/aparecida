import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.PAGBANK_TOKEN;

console.log("🔍 Token carregado:", token?.substring(0, 30) + "...");
console.log("🔍 Tamanho do token:", token?.length);

const payload = {
  reference_id: `test_${Date.now()}`,
  customer: {
    name: "João Silva",
    email: "joao@exemplo.com",
    tax_id: "12345678909",
  },
  items: [
    {
      name: "Plano Básico",
      quantity: 1,
      unit_amount: 1000,
    },
  ],
  charges: [
    {
      reference_id: `charge_${Date.now()}`,
      description: "Cobrança mensal",
      amount: {
        value: 1000,
        currency: "BRL",
      },
      payment_method: {
        type: "CREDIT_CARD",
        installments: 1,
        capture: true,
        card: {
          number: "4111111111111111",
          exp_month: "12",
          exp_year: "2030",
          security_code: "123",
          holder: {
            name: "JOÃO SILVA",
          },
        },
      },
    },
  ],
};

console.log("\n📤 Tentando criar pedido com axios...\n");

try {
  const response = await axios.post(
    "https://sandbox.api.pagseguro.com/orders",
    payload,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("✅ SUCESSO!");
  console.log("Order ID:", response.data.id);
  console.log("Status:", response.data.charges[0].status);
} catch (error) {
  console.log("❌ ERRO!");
  console.log("Status:", error.response?.status);
  console.log("Mensagem:", error.response?.data);
}
