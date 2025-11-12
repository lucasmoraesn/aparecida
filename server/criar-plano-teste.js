import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log("📝 Criando plano de teste no Supabase...");

const { data, error } = await supabase
  .from("business_plans")
  .insert([
    {
      name: "Plano Teste Produção",
      price: 10.00,
      description: "Plano para teste em produção - R$ 10,00/mês",
      features: ["Teste de assinatura", "Valor mínimo aceito pelo MP"]
    }
  ])
  .select();

if (error) {
  console.error("❌ Erro:", error);
} else {
  console.log("✅ Plano criado com sucesso!");
  console.log("ID do plano:", data[0].id);
  console.log("Nome:", data[0].name);
  console.log("Preço:", data[0].price);
  console.log("\n💡 Use este ID no cadastro!");
}

process.exit(0);
