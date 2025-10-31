import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Tratamento global de erros
process.on("uncaughtException", (err) => {
  console.error("❌ Erro não tratado:", err);
  console.error("Stack trace:", err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Promessa rejeitada sem tratamento:", reason);
});

import express from "express";
import { createClient } from "@supabase/supabase-js";

console.log("🔄 Testando conexão Supabase...");

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  console.log("✅ Cliente Supabase criado com sucesso");
  
  // Teste básico de conexão
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from("business_plans").select("count", { count: "exact", head: true });
      if (error) {
        console.error("❌ Erro ao testar conexão Supabase:", error);
      } else {
        console.log("✅ Conexão Supabase funcionando!");
      }
    } catch (err) {
      console.error("❌ Erro na função de teste:", err);
    }
  };
  
  testConnection();

  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true, supabase: "connected" });
  });

  app.listen(3001, () => {
    console.log("🚀 Servidor de teste rodando na porta 3001");
  });

} catch (err) {
  console.error("❌ Erro ao criar cliente Supabase:", err);
}