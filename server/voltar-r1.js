import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function voltarParaR1() {
  console.log("💰 Voltando plano para R$ 1,00...");
  
  const { data, error } = await supabase
    .from("business_plans")
    .update({ 
      price: 1.00,
      name: "Plano de Teste R$1",
      description: "Plano de teste para validação - R$ 1,00/mês"
    })
    .eq("id", "b6192eba-cf12-4bbf-bd91-686d961b1f13")
    .select();

  if (error) {
    console.error("❌ Erro:", error);
    return;
  }

  console.log("✅ Plano restaurado para R$ 1,00:", data);
  console.log("💰 Valor: R$ 1,00/mês");
}

voltarParaR1();
