import dotenv from "dotenv";
dotenv.config();

const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();

console.log("🧪 Criando novo usuário de teste...");

const response = await fetch("https://api.mercadopago.com/users/test_user", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    site_id: "MLB"
  })
});

const data = await response.json();

if (response.ok) {
  console.log("\n✅ USUÁRIO DE TESTE CRIADO:");
  console.log("📧 Email:", data.email);
  console.log("🔑 Senha:", data.password);
  console.log("🆔 ID:", data.id);
  console.log("\n💡 Use este email para fazer login no checkout!");
} else {
  console.error("❌ Erro:", data);
}
