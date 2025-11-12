import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function atualizarPlanoTeste() {
  console.log("📝 Atualizando plano de teste para R$ 1,00...");
  
  // Atualizar o plano "Plano Teste Produção"
  const { data, error } = await supabase
    .from("business_plans")
    .update({ 
      price: 1.00,
      description: "Plano de teste para validação da integração - R$ 1,00/mês"
    })
    .eq("name", "Plano Teste Produção")
    .select();

  if (error) {
    console.error("❌ Erro:", error);
    return;
  }

  console.log("✅ Plano atualizado:", data);
  console.log("💰 Novo valor: R$ 1,00/mês");
  console.log("📋 ID do plano:", data[0]?.id);
  
  console.log("\n🎯 Próximos passos:");
  console.log("1. Faça um novo cadastro de teste no frontend");
  console.log("2. Selecione o plano 'Plano Teste Produção'");
  console.log("3. Complete o checkout com R$ 1,00");
  console.log("4. O antifraude deve liberar valores pequenos para validação");
}

atualizarPlanoTeste();
