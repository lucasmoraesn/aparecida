// Serviço específico para Mercado Pago Sandbox
export interface SandboxPaymentRequest {
   amount: number;
   description: string;
   payer_email: string;
   payment_method: 'pix' | 'credit_card';
   external_reference?: string;
   notification_url?: string;
   back_urls?: {
      success: string;
      failure: string;
      pending: string;
   };
}

export interface SandboxPaymentResponse {
   id: string;
   status: string;
   payment_method_id: string;
   payment_type_id: string;
   transaction_amount: number;
   pix_code?: string;
   pix_expires_at?: string;
   external_reference?: string;
   init_point?: string; // URL para redirecionamento
}

export class MercadoPagoSandboxService {
   private static readonly ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
   private static readonly PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
   private static readonly NGROK_URL = import.meta.env.VITE_PUBLIC_URL_NGROK || window.location.origin;


   // Verificar credenciais (você já tem assim)
private static checkCredentials(): void {
  if (!this.PUBLIC_KEY) {
    throw new Error('Credenciais do Mercado Pago Sandbox não configuradas');
  }
}

// Use a URL da sua API (defina em VITE_API_URL no .env do front)
private static readonly API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_PUBLIC_URL_NGROK ||
  window.location.origin;

// Criar preferência de pagamento (chama o BACKEND)
static async createPaymentPreference(request: SandboxPaymentRequest): Promise<SandboxPaymentResponse> {
  this.checkCredentials();

  try {
    const resp = await fetch(`${this.API_URL}/api/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request), // { amount, description, payer_email, external_reference }
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data?.message || 'Falha ao criar preferência de pagamento');
    }

    // data do backend deve conter init_point (ou sandbox_init_point)
    return {
      id: data.id,
      status: 'pending',
      payment_method_id: 'preference',
      payment_type_id: 'preference',
      transaction_amount: request.amount,
      external_reference: request.external_reference,
      init_point: data.init_point || data.sandbox_init_point || '',
    };
  } catch (err) {
    console.error('Erro ao criar preferência de pagamento:', err);
    throw new Error('Falha ao criar preferência de pagamento');
  }
}


   // Criar pagamento PIX direto (alternativa)
   static async createPixPayment(request: SandboxPaymentRequest): Promise<SandboxPaymentResponse> {
      this.checkCredentials();

      const paymentData = {
         transaction_amount: request.amount,
         description: request.description,
         payment_method_id: 'pix',
         payer: {
            email: request.payer_email
         },
         external_reference: request.external_reference,
         notification_url: `${this.NGROK_URL}/api/payment-webhook`
      };

      try {
         const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao criar pagamento PIX: ${errorData.message || response.statusText}`);
         }

         const payment = await response.json();
         console.log('Pagamento PIX criado:', payment);

         return {
            id: payment.id.toString(),
            status: payment.status,
            payment_method_id: payment.payment_method_id,
            payment_type_id: payment.payment_type_id,
            transaction_amount: payment.transaction_amount,
            pix_code: payment.point_of_interaction?.transaction_data?.qr_code,
            pix_expires_at: payment.point_of_interaction?.transaction_data?.qr_code_base64 ?
               new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined,
            external_reference: payment.external_reference
         };
      } catch (error) {
         console.error('Erro ao criar pagamento PIX:', error);
         throw new Error('Falha ao processar pagamento PIX');
      }
   }

   // Verificar status do pagamento
   static async getPaymentStatus(paymentId: string): Promise<any> {
      this.checkCredentials();

      try {
         const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${this.ACCESS_TOKEN}`
            }
         });

         if (!response.ok) {
            throw new Error(`Erro ao consultar pagamento: ${response.statusText}`);
         }

         return await response.json();
      } catch (error) {
         console.error('Erro ao consultar pagamento:', error);
         throw new Error('Falha ao consultar status do pagamento');
      }
   }

   // Simular pagamento para desenvolvimento (quando não há credenciais)
   static async simulatePayment(request: SandboxPaymentRequest): Promise<SandboxPaymentResponse> {
      console.log('Simulando pagamento Sandbox:', request);

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentId = Math.random().toString(36).substr(2, 9);

      if (request.payment_method === 'pix') {
         return {
            id: paymentId,
            status: 'pending',
            payment_method_id: 'pix',
            payment_type_id: 'digital_currency',
            transaction_amount: request.amount,
            pix_code: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Teste Empresa6008Brasilia62070503***6304E2CA',
            pix_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            external_reference: request.external_reference
         };
      } else {
         return {
            id: paymentId,
            status: 'pending',
            payment_method_id: 'preference',
            payment_type_id: 'preference',
            transaction_amount: request.amount,
            external_reference: request.external_reference,
            init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789'
         };
      }
   }
}

