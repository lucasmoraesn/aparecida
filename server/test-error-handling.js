// Teste do tratamento de erros
import express from "express";

// Tratamento global de erros - NUNCA MAIS CRASH SILENCIOSO
process.on("uncaughtException", (err) => {
  console.error("❌ Erro não tratado:", err);
  console.error("Stack trace:", err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Promessa rejeitada sem tratamento:", reason);
  console.error("Promise:", promise);
});

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Servidor funcionando com tratamento de erros!" });
});

app.get("/test-error", (req, res) => {
  // Simular um erro não tratado
  setTimeout(() => {
    throw new Error("Teste de erro não tratado");
  }, 100);
  res.json({ message: "Erro será lançado em breve..." });
});

app.get("/test-promise-error", async (req, res) => {
  // Simular uma promise rejeitada
  Promise.reject(new Error("Teste de promise rejeitada"));
  res.json({ message: "Promise rejeitada foi lançada..." });
});

const port = 3001;
app.listen(port, () => {
  console.log(`🚀 Servidor de teste funcionando na porta ${port}`);
  console.log("✅ Tratamento de erros ativo!");
});