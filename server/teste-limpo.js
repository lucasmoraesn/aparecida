import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));

// Endpoint SIMPLES só para testar Mercado Pago
app.post('/api/test-mp-simple', async (req, res) => {
  try {
    console.log('🧪 TESTE SIMPLES MP - Iniciado');
    
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
    console.log('Token prefix:', token?.slice(0, 10) + '...');
    console.log('Token length:', token?.length);
    
    // SOLUÇÃO: Criar PREAPPROVAL PLAN sem payer_email
    // Isso gera um link de checkout (init_point) que qualquer pessoa pode acessar
    const payload = {
      reason: req.body.business_name || "Assinatura Aparecida",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months", 
        transaction_amount: 10,
        currency_id: "BRL"
      },
      back_url: "https://www.mercadopago.com.br"
      // SEM payer_email - MP vai gerar um link de checkout!
    };
    
    console.log('Payload (SEM payer_email):', JSON.stringify(payload, null, 2));
    
    const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ SUCESSO! Link de checkout gerado!');
      console.log('🔗 Sandbox Link:', result.sandbox_init_point);
      console.log('🔗 Prod Link:', result.init_point);
      
      res.json({ 
        success: true, 
        message: 'Assinatura criada com sucesso!',
        checkout_link: result.sandbox_init_point || result.init_point,
        plan_id: result.id,
        data: result 
      });
    } else {
      res.status(response.status).json({ 
        error: true, 
        message: result.message,
        details: result 
      });
    }
    
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: true, message: error.message });
  }
});

const port = 3002; // Porta diferente para não conflitar
app.listen(port, () => {
  console.log(`🚀 Servidor TESTE rodando em http://localhost:${port}`);
  console.log(`🧪 Teste: POST http://localhost:${port}/api/test-mp-simple`);
  
  // Teste automático após 2 segundos
  setTimeout(async () => {
    try {
      console.log('\n🧪 EXECUTANDO TESTE AUTOMÁTICO...');
      const fetch = await import('node-fetch');
      
      const response = await fetch.default(`http://localhost:${port}/api/test-mp-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "test_user_6829630025187321779@testuser.com",  // USUÁRIO CORRETO para o novo token!
          business_name: "Teste Automático"
        })
      });
      
      const data = await response.text();
      console.log('\n✅ RESPOSTA DO TESTE:');
      console.log('Status:', response.status);
      console.log('Body:', data);
      
    } catch (error) {
      console.error('❌ ERRO NO TESTE:', error.message);
    }
  }, 2000);
});