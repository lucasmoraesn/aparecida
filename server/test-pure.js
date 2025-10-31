import express from "express";

// Handlers de erro globais
process.on("uncaughtException", (err) => {
  console.error("❌ [uncaughtException]", err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ [unhandledRejection]", reason);
});

console.log("🔄 Iniciando Express...");
const app = express();

console.log("🔄 Adicionando rota...");
app.get("/ping", (req, res) => {
  try {
    console.log("📡 Ping recebido!");
    res.json({ pong: true, timestamp: Date.now() });
  } catch (err) {
    console.error("💥 Erro na rota ping:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

console.log("🔄 Iniciando servidor...");
try {
  const server = app.listen(3001, '127.0.0.1', () => {
    console.log("🔥 Servidor puro funcionando na porta 3001");
    console.log("🌐 Endereço: http://127.0.0.1:3001");
  });
  
  server.on('error', (err) => {
    console.error("💥 Erro no servidor:", err);
  });
  
  server.on('close', () => {
    console.log("🔴 Servidor foi fechado");
  });
} catch (err) {
  console.error("💥 Erro ao iniciar:", err);
}

console.log("🔄 Servidor configurado");