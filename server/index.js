import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Tratamento global de erros - NUNCA MAIS CRASH SILENCIOSO
process.on("uncaughtException", (err) => {
  console.error("❌ [uncaughtException]", err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ [unhandledRejection]", reason);
});

import express from "express";
import cors from "cors";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", /\.ngrok-free\.app$/],
}));

// Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const preApproval = new PreApproval(mpClient);

// Supabase (temporariamente desabilitado para debug)
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_KEY
// );

// Teste de conexão Supabase na inicialização (comentado para debug)
// const testSupabaseConnection = async () => {
//   console.log("🔄 Testando conexão inicial com Supabase...");
//   try {
//     const { data, error } = await supabase.from("business_plans").select("id").limit(1);
//     if (error) console.error("❌ Erro Supabase inicial:", error);
//     else console.log("✅ Conexão Supabase ativa:", data);
//   } catch (err) {
//     console.error("💥 Erro crítico Supabase:", err);
//   }
// };

// Executar teste de conexão
// testSupabaseConnection();

console.log("✅ Configurações carregadas:", {
  MP_TOKEN: process.env.MP_ACCESS_TOKEN ? "OK" : "MISSING",
  SUPABASE_URL: process.env.SUPABASE_URL ? "OK" : "MISSING",
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "OK" : "MISSING",
  PUBLIC_URL: process.env.PUBLIC_URL_NGROK || "NOT_SET"
});

// Rota teste "pura" sem dependências
app.get("/ping", (req, res) => {
  console.log("📡 Rota /ping acessada com sucesso!");
  res.json({ status: "pong" });
});

// Routes
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post("/api/create-subscription", async (req, res) => {
  try {
    const { payer_email, plan_id } = req.body;
    console.log("🟦 Dados recebidos:", { payer_email, plan_id });

    if (!payer_email || !plan_id) {
      return res.status(400).json({ error: true, message: "Campos obrigatórios ausentes" });
    }

    // Mock do plano para teste (Supabase temporariamente desabilitado)
    console.log("🔍 Usando plano mock para teste...");
    const plan = {
      id: plan_id,
      name: "Plano Teste",
      price: 29.90
    };
    const error = null;

    console.log("🟩 Plano mock:", plan);

    // Validar dados do plano
    if (!plan.price || plan.price <= 0) {
      console.error("❌ Plano sem preço válido:", plan);
      return res.status(400).json({ error: true, message: "Plano com preço inválido" });
    }

    console.log("📊 Plano validado:", { id: plan.id, name: plan.name, price: plan.price });

    // 🔹 Criar payload correto para Mercado Pago
    const payload = {
      reason: plan.name,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: plan.price,
        currency_id: "BRL",
      },
      back_url: `${process.env.PUBLIC_URL_NGROK}/return/subscription/success`,
      payer_email,
    };

    console.log("📤 Payload para MP:", JSON.stringify(payload, null, 2));

    // Criar assinatura no Mercado Pago
    console.log("💳 Enviando para Mercado Pago...");
    const preApprovalData = await preApproval.create({ body: payload });

    console.log("✅ Assinatura criada com sucesso:", preApprovalData.id);
    
    // Retornar estrutura esperada pelo frontend
    return res.json({
      success: true,
      business: {
        id: preApprovalData.id // ID da assinatura do Mercado Pago
      },
      subscription: {
        id: preApprovalData.id,
        init_point: preApprovalData.sandbox_init_point || preApprovalData.init_point,
        status: preApprovalData.status
      }
    });
  } catch (err) {
    console.error('💥 Erro inesperado:', err);
    console.error('Stack trace:', err.stack);
    
    // Retornar informações detalhadas do erro
    return res.status(500).json({ 
      error: true, 
      message: err.message,
      type: err.name,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Start server
const port = process.env.PORT || 3001;
try {
  const server = app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
  
  server.on('error', (err) => {
    console.error("💥 Erro no servidor:", err);
  });
} catch (err) {
  console.error("💥 Erro ao iniciar servidor:", err);
}