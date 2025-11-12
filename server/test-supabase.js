import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

console.log("🧪 TESTE SUPABASE");
console.log("URL:", process.env.SUPABASE_URL);
console.log("Key length:", process.env.SUPABASE_SERVICE_KEY?.length);
console.log("Key prefix:", process.env.SUPABASE_SERVICE_KEY?.substring(0, 50) + "...");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log("\n🔍 Testando conexão...");

// Teste 1: Listar tabelas
const { data, error } = await supabase
  .from("business_registrations")
  .select("id")
  .limit(1);

if (error) {
  console.error("❌ ERRO:", error);
} else {
  console.log("✅ SUCESSO! Supabase conectado:", data);
}

process.exit(0);
