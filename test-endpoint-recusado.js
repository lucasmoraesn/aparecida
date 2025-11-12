import axios from "axios";

const payload = {
  plan_id: "b6192eba-cf12-4bbf-bd91-686d961b1f13",
  establishment_name: "Estabelecimento Teste - Recusado",
  category: "restaurant",
  address: "Rua Teste, 123",
  location: "São Paulo, SP",
  whatsapp: "11987654321",
  phone: "11987654321",
  description: "Teste de pagamento recusado",
  payer_email: "teste-recusado@exemplo.com",
  card_number: "4111111111111111",
  card_exp_month: "01", // ❌ Mês expirado
  card_exp_year: "2020", // ❌ Ano expirado
  card_security_code: "123",
  card_holder_name: "TESTE RECUSADO",
  card_holder_tax_id: "12345678909",
};

console.log("📤 Testando CASO RECUSADO (cartão expirado)\n");

try {
  const response = await axios.post(
    "http://localhost:3001/api/register-business",
    payload
  );

  console.log("⚠️  Inesperado: Pagamento foi aprovado (deveria ter falhado)");
  console.log(JSON.stringify(response.data, null, 2));
} catch (error) {
  if (error.response?.status === 500 || error.response?.status === 400) {
    console.log("✅ ESPERADO: Pagamento recusado");
    console.log("Status:", error.response?.status);
    console.log("Resposta:", error.response?.data);
    console.log("\n✅ PASS: Sistema tratou erro corretamente sem quebrar");
  } else {
    console.log("❌ FALHA: Erro inesperado");
    console.log("Status:", error.response?.status);
    console.log("Resposta:", error.response?.data);
  }
}
