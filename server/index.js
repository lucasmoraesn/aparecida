import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PagBankService } from "./payments/pagbankService.js";

dotenv.config();

// --- Validar configuração PagBank ---
if (!process.env.PAGBANK_TOKEN) {
  console.error("❌ PAGBANK_TOKEN não configurado no .env!");
  console.error("   Configure o token em server/.env");
  console.error("   Obtenha em: https://dev.pagseguro.uol.com.br/credentials");
} else {
  const env = process.env.PAGBANK_BASE_URL?.includes('sandbox') ? 'SANDBOX' : 'PRODUÇÃO';
  console.log(`✅ PagBank configurado (${env})`);
  console.log(`   Token: ${process.env.PAGBANK_TOKEN.substring(0, 20)}...`);
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", /\.ngrok-free\.app$/],
  })
);

// --- Supabase (usando service_role no backend) ---
console.log("🔍 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔍 SUPABASE_SERVICE_KEY length:", process.env.SUPABASE_SERVICE_KEY?.length);
console.log("🔍 SUPABASE_SERVICE_KEY prefix:", process.env.SUPABASE_SERVICE_KEY?.substring(0, 50) + "...");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Health-check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Endpoint para buscar planos disponíveis
app.get("/api/plans", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("business_plans")
      .select("id, name, price, description, features")
      .order("price", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar planos:", err);
    res.status(500).json({ message: "Erro ao buscar planos" });
  }
});

/* =============================
   CADASTRAR NEGÓCIO + PROCESSAR PAGAMENTO COM PAGBANK
============================= */
app.post("/api/register-business", async (req, res) => {
  try {
    const registration = req.body;
    console.log("📥 Dados recebidos do frontend");
    console.log("📋 Plan ID:", registration.plan_id);
    console.log("📧 Email:", registration.payer_email);
    console.log("💳 Card:", registration.card_number?.substring(0, 4) + "****");

    const {
      establishment_name,
      category,
      address,
      location,
      photos,
      whatsapp,
      phone,
      description,
      plan_id,
      payer_email,
      card_number,
      card_exp_month,
      card_exp_year,
      card_security_code,
      card_holder_name,
      card_holder_tax_id,
    } = registration;

    // 1. Validar dados obrigatórios
    if (!plan_id || !payer_email || !card_number) {
      return res.status(400).json({
        error: true,
        message: "Dados incompletos: plano, email e cartão são obrigatórios",
      });
    }

    // 2. Salvar cadastro no Supabase
    console.log("� Salvando estabelecimento no Supabase...");
    
    const { data: businessData, error: businessError } = await supabase
      .from("business_registrations")
      .insert([
        {
          establishment_name,
          category,
          address,
          location,
          photos,
          whatsapp,
          phone,
          description,
          plan_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (businessError) {
      console.error("❌ Erro ao salvar no Supabase:", businessError);
      throw new Error("Erro ao salvar estabelecimento");
    }

    console.log("✅ Estabelecimento salvo:", businessData.id);

    // 3. Buscar informações do plano
    const { data: planData, error: planError } = await supabase
      .from("business_plans")
      .select("price, name")
      .eq("id", plan_id)
      .single();

    if (planError) {
      throw new Error("Plano não encontrado");
    }

    console.log(`💰 Plano: ${planData.name} - R$ ${planData.price}`);

    // 4. Processar pagamento no PagBank
    console.log("💳 Processando pagamento no PagBank...");
    
    const notificationUrl = process.env.PUBLIC_URL_NGROK
      ? `${process.env.PUBLIC_URL_NGROK}/pagbank/webhook`
      : undefined;

    const orderData = await PagBankService.createOrder({
      amount: planData.price,
      description: `${planData.name} - ${establishment_name}`,
      referenceId: `business_${businessData.id}`,
      customerName: card_holder_name || establishment_name,
      customerEmail: payer_email,
      customerTaxId: card_holder_tax_id,
      cardNumber: card_number,
      cardExpMonth: card_exp_month,
      cardExpYear: card_exp_year,
      cardSecurityCode: card_security_code,
      installments: 1,
      notificationUrl,
    });

    // 5. Retornar sucesso
    const chargeStatus = orderData.charges?.[0]?.status;
    
    res.json({
      success: true,
      business_id: businessData.id,
      order_id: orderData.id,
      status: chargeStatus,
      message: chargeStatus === "PAID" 
        ? "Pagamento aprovado! Estabelecimento cadastrado com sucesso."
        : "Pagamento em processamento. Você receberá um email com a confirmação.",
    });

  } catch (err) {
    console.error("❌ Erro no fluxo completo:", err.message);
    
    res.status(500).json({
      error: true,
      message: err.message || "Erro ao processar pagamento",
    });
  }
});

/* =============================
   WEBHOOK PAGBANK
============================= */
app.post("/pagbank/webhook", async (req, res) => {
  try {
    await PagBankService.handleWebhook(req.body, req.headers);
    res.status(200).send("ok");
  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    res.status(500).send("error");
  }
});

/* =============================
   START SERVER
============================= */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
