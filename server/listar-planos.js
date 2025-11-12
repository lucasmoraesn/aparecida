import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function listarPlanos() {
  console.log("📋 Listando todos os planos...\n");
  
  const { data, error } = await supabase
    .from("business_plans")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Erro:", error);
    return;
  }

  data.forEach((plano, index) => {
    console.log(`${index + 1}. ${plano.name} - R$ ${plano.price}/mês`);
    console.log(`   ID: ${plano.id}`);
    console.log(`   Features: ${plano.features?.join(", ")}`);
    console.log(`   Criado em: ${plano.created_at}`);
    console.log("");
  });
}

listarPlanos();
