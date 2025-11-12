import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function atualizarPlanoParaR10() {
  console.log("💰 Atualizando plano de teste para R$ 10,00...");
  
  // Atualizar o plano "Plano de Teste R$1"
  const { data, error } = await supabase
    .from("business_plans")
    .update({ 
      price: 10.00,
      name: "Plano de Teste",
      description: "Plano de teste para validação - R$ 10,00/mês"
    })
    .eq("id", "b6192eba-cf12-4bbf-bd91-686d961b1f13")
    .select();

  if (error) {
    console.error("❌ Erro:", error);
    return;
  }

  console.log("✅ Plano atualizado:", data);
  console.log("💰 Novo valor: R$ 10,00/mês");
  console.log("\n🎯 Por que R$ 10,00?");
  console.log("- É o valor mínimo recomendado pelo MP para produção");
  console.log("- Valores muito baixos podem ser bloqueados pelo antifraude");
  console.log("- Maior chance de aprovação");
}

atualizarPlanoParaR10();
