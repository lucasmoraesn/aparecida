import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log("🔧 Atualizando planos com valor R$ 1,00 para R$ 10,00...");

// Atualizar todos os planos que custam R$ 1,00
const { data, error } = await supabase
  .from("business_plans")
  .update({ price: 10.00 })
  .eq("price", 1.00)
  .select();

if (error) {
  console.error("❌ Erro:", error);
} else {
  if (data.length === 0) {
    console.log("⚠️ Nenhum plano com R$ 1,00 encontrado.");
  } else {
    console.log(`✅ ${data.length} plano(s) atualizado(s) com sucesso!`);
    data.forEach(plano => {
      console.log(`  - ${plano.name}: R$ 1,00 → R$ 10,00`);
    });
  }
}

process.exit(0);
