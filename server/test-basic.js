import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  console.log("Health endpoint chamado");
  res.json({ ok: true, message: "Server básico funcionando" });
});

const port = 3001;
app.listen(port, () => {
  console.log(`🚀 Servidor básico rodando na porta ${port}`);
});

// Manter o processo ativo
setInterval(() => {
  // Ping a cada 30 segundos para manter vivo
}, 30000);