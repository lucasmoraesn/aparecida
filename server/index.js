import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

console.log("[MP_ACCESS_TOKEN length]", process.env.MP_ACCESS_TOKEN?.length);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", /\.ngrok-free\.app$/],
  })
);

// --- SDK v2 Mercado Pago ---
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const preApproval = new PreApproval(mpClient);

// --- Supabase (usando service_role no backend) ---
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
   CADASTRAR NEGÓCIO + CRIAR ASSINATURA
============================= */
app.post("/api/register-business", async (req, res) => {
  try {
    // Recebe dados do front
    const registration = req.body;
    console.log("📥 Dados recebidos do front:", registration);

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
      amount,
      frequency,
      frequency_type,
    } = registration;

    // 1. Salvar cadastro de negócio no Supabase
    const { data, error } = await supabase
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

    if (error) throw error;
    console.log("✅ Cadastro inserido no Supabase:", data);

    // 2. Criar assinatura no Mercado Pago via SDK
    const startDate = new Date(Date.now() + 10 * 60 * 1000);
    startDate.setSeconds(0, 0);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setSeconds(0, 0);

    const payload = {
      reason: "Plano de Assinatura",
      external_reference: "sub_" + Date.now(),
      auto_recurring: {
        frequency: frequency || 1,
        frequency_type: frequency_type || "months",
        transaction_amount: amount || 49.9,
        currency_id: "BRL",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
      back_url: `${process.env.VITE_PUBLIC_URL_NGROK}/return/subscription/success`,
      notification_url: `${process.env.VITE_PUBLIC_URL_NGROK}/api/webhook`,
      payer_email: registration.payer_email || "comprador_teste@teste.com",
    };

    console.log("📦 Payload enviado ao MP (SDK):", JSON.stringify(payload, null, 2));

    const subscription = await preApproval.create({ body: payload });

    console.log("✅ Assinatura criada no MP:", subscription.id);

    // 3. Retorna para o front: id do cadastro + link do pagamento
    res.json({
      success: true,
      business: data,
      subscription,
    });
  } catch (err) {
    console.error("❌ Erro no fluxo completo:", err.message, err.response?.data || "");
    res.status(500).json({
      error: true,
      message: err.message,
      details: err.response?.data || null,
    });
  }
});

/* =============================
   START SERVER
============================= */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
