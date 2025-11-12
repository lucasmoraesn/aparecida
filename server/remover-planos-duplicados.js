import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function removerPlanosDuplicados() {
  console.log("🗑️  Removendo planos duplicados...\n");
  
  // IDs dos planos "Plano Teste Produção" para remover
  const idsParaRemover = [
    '81e085d8-620e-4834-b08a-468bcb5caa12',
    '16c63eea-e5dd-4994-9d48-2207ab40a55f'
  ];

  for (const id of idsParaRemover) {
    const { error } = await supabase
      .from("business_plans")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`❌ Erro ao remover plano ${id}:`, error);
    } else {
      console.log(`✅ Plano ${id} removido com sucesso`);
    }
  }

  console.log("\n📋 Listando planos restantes...\n");
  
  const { data } = await supabase
    .from("business_plans")
    .select("*")
    .order("created_at", { ascending: true });

  data?.forEach((plano, index) => {
    console.log(`${index + 1}. ${plano.name} - R$ ${plano.price}/mês`);
    console.log(`   Features: ${plano.features?.join(", ")}`);
    console.log("");
  });
}

removerPlanosDuplicados();
