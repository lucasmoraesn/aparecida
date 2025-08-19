import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

console.log("[MP_ACCESS_TOKEN length]", process.env.MP_ACCESS_TOKEN?.length);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", /\.ngrok-free\.app$/],
  })
);

// --- SDK v2: cria o client com o Access Token ---
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Health-check
app.get("/health", (_req, res) => res.json({ ok: true }));

/* =============================
   PAGAMENTO AVULSO (Preference)
============================= */
app.post("/api/create-preference", async (req, res) => {
  try {
    const { items } = req.body;
    const backBase = `https://${req.get("host")}`;

    const body = {
      items: items?.length
        ? items
        : [
            {
              title: "Pedido de teste",
              quantity: 1,
              unit_price: 40.0,
              currency_id: "BRL",
            },
          ],
      back_urls: {
        success: `${backBase}/return/success`,
        failure: `${backBase}/return/failure`,
        pending: `${backBase}/return/pending`,
      },
      auto_return: "approved",
      notification_url: `${backBase}/api/webhook`,
    };

    const pref = new Preference(mpClient);
    const result = await pref.create({ body });
    res.json({ id: result.id, init_point: result.init_point });
  } catch (e) {
    console.error("❌ ERRO /api/create-preference:", e.response?.data || e);
    res.status(500).json({ error: true, message: e.message || "erro" });
  }
});

/* =============================
   ASSINATURAS (Preapproval)
============================= */
app.post("/api/create-subscription", async (req, res) => {
  try {
    const { planTitle, amount, frequency, frequency_type, payer_email } = req.body;
    console.log("req.body recebido:", req.body);

    // Datas ajustadas
    const startDate = new Date(Date.now() + 10 * 60 * 1000); // 10 min no futuro
    startDate.setSeconds(0, 0);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setSeconds(0, 0);

    // Payload completo
    const payload = {
      reason: planTitle,
      external_reference: "sub_" + Date.now(),
      auto_recurring: {
        frequency,
        frequency_type,
        transaction_amount: amount,
        currency_id: "BRL",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
      back_url: `${process.env.VITE_PUBLIC_URL_NGROK}/return/subscription/success`,
      notification_url: `${process.env.VITE_PUBLIC_URL_NGROK}/api/webhook`,
      payer_email,
    };

    console.log("📦 Payload enviado ao MP:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      "https://api.mercadopago.com/preapproval",
      payload,
      {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Erro ao criar assinatura:",
      JSON.stringify(error.response?.data, null, 2) || error.message,
      "\nStatus:", error.response?.status,
      "\nX-Request-Id:", error.response?.headers?.["x-request-id"]
    );

    res.status(500).json({
      error: true,
      message: "Erro Mercado Pago",
      details: error.response?.data || error.message,
      status: error.response?.status,
      request_id: error.response?.headers?.["x-request-id"],
    });
  }
});

/* =============================
   PAGAMENTO DE TESTE (cartão teste)
============================= */
app.post("/api/test-payment", async (req, res) => {
  try {
    const { transaction_amount, description, payer_email } = req.body;

    const body = {
      items: [
        {
          title: description || "Pagamento de Teste",
          quantity: 1,
          unit_price: transaction_amount || 10.0,
          currency_id: "BRL",
        },
      ],
      payer: { email: payer_email },
      back_urls: {
        success: `${process.env.VITE_PUBLIC_URL_NGROK}/return/success`,
        failure: `${process.env.VITE_PUBLIC_URL_NGROK}/return/failure`,
        pending: `${process.env.VITE_PUBLIC_URL_NGROK}/return/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.VITE_PUBLIC_URL_NGROK}/api/webhook`,
    };

    const pref = new Preference(mpClient);
    const result = await pref.create({ body });

    // Retorna a URL para pagar com cartão de teste
    res.json({ init_point: result.init_point });
  } catch (e) {
    console.error("❌ ERRO /api/test-payment:", e.response?.data || e);
    res.status(500).json({ error: true, message: e.message || "erro" });
  }
});

/* =============================
   WEBHOOK
============================= */
app.post("/api/webhook", (req, res) => {
  console.log("📩 Webhook MP recebido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

/* =============================
   ROTAS DE RETORNO
============================= */
// Pagamento avulso
app.get("/return/success", (_req, res) => {
  res.redirect("http://localhost:5173/sucesso");
});
app.get("/return/failure", (_req, res) => {
  res.redirect("http://localhost:5173/erro");
});
app.get("/return/pending", (_req, res) => {
  res.redirect("http://localhost:5173/pendente");
});

// Assinatura
app.get("/return/subscription/success", (_req, res) => {
  res.redirect("http://localhost:5173/sucesso");
});
app.get("/return/subscription/failure", (_req, res) => {
  res.redirect("http://localhost:5173/erro");
});
app.get("/return/subscription/pending", (_req, res) => {
  res.redirect("http://localhost:5173/pendente");
});

/* =============================
   START SERVER
============================= */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
