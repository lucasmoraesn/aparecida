// Serviço de pagamento usando Mercado Pago
// Você precisará instalar: npm install mercadopago

export interface PaymentRequest {
   amount: number;
   description: string;
   payer_email: string;
   payment_method: 'pix' | 'credit_card';
   external_reference?: string;
}

export interface PaymentResponse {
   id: string;
   status: string;
   payment_method_id: string;
   payment_type_id: string;
   transaction_amount: number;
   pix_code?: string;
   pix_expires_at?: string;
   external_reference?: string;
}

export class PaymentService {
   private static readonly MERCADO_PAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
   private static readonly MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

   // Verificar se as credenciais estão configuradas
   private static checkCredentials(): void {
      if (!this.MERCADO_PAGO_ACCESS_TOKEN || !this.MERCADO_PAGO_PUBLIC_KEY) {
         throw new Error('Credenciais do Mercado Pago não configuradas. Configure as variáveis de ambiente VITE_MERCADO_PAGO_ACCESS_TOKEN e VITE_MERCADO_PAGO_PUBLIC_KEY');
      }
   }

   // Criar pagamento PIX
   static async createPixPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
      this.checkCredentials();

      const paymentData = {
         transaction_amount: paymentRequest.amount,
         description: paymentRequest.description,
         payment_method_id: 'pix',
         payer: {
            email: paymentRequest.payer_email
         },
         external_reference: paymentRequest.external_reference
      };

      try {
         const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${this.MERCADO_PAGO_ACCESS_TOKEN}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao criar pagamento PIX: ${errorData.message || response.statusText}`);
         }

         const payment = await response.json();

         return {
            id: payment.id.toString(),
            status: payment.status,
            payment_method_id: payment.payment_method_id,
            payment_type_id: payment.payment_type_id,
            transaction_amount: payment.transaction_amount,
            pix_code: payment.point_of_interaction?.transaction_data?.qr_code,
            pix_expires_at: payment.point_of_interaction?.transaction_data?.qr_code_base64 ?
               new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined, // 30 minutos
            external_reference: payment.external_reference
         };
      } catch (error) {
         console.error('Erro ao criar pagamento PIX:', error);
         throw new Error('Falha ao processar pagamento PIX');
      }
   }

   // Criar pagamento com cartão de crédito
   static async createCreditCardPayment(paymentRequest: PaymentRequest, cardData: any): Promise<PaymentResponse> {
      this.checkCredentials();

      const paymentData = {
         transaction_amount: paymentRequest.amount,
         description: paymentRequest.description,
         payment_method_id: 'master',
         payer: {
            email: paymentRequest.payer_email
         },
         external_reference: paymentRequest.external_reference,
         installments: 1,
         token: cardData.token
      };

      try {
         const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${this.MERCADO_PAGO_ACCESS_TOKEN}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao criar pagamento com cartão: ${errorData.message || response.statusText}`);
         }

         const payment = await response.json();

         return {
            id: payment.id.toString(),
            status: payment.status,
            payment_method_id: payment.payment_method_id,
            payment_type_id: payment.payment_type_id,
            transaction_amount: payment.transaction_amount,
            external_reference: payment.external_reference
         };
      } catch (error) {
         console.error('Erro ao criar pagamento com cartão:', error);
         throw new Error('Falha ao processar pagamento com cartão');
      }
   }

   // Verificar status do pagamento
   static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
      this.checkCredentials();

      try {
         const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${this.MERCADO_PAGO_ACCESS_TOKEN}`
            }
         });

         if (!response.ok) {
            throw new Error(`Erro ao consultar pagamento: ${response.statusText}`);
         }

         const payment = await response.json();

         return {
            id: payment.id.toString(),
            status: payment.status,
            payment_method_id: payment.payment_method_id,
            payment_type_id: payment.payment_type_id,
            transaction_amount: payment.transaction_amount,
            external_reference: payment.external_reference
         };
      } catch (error) {
         console.error('Erro ao consultar pagamento:', error);
         throw new Error('Falha ao consultar status do pagamento');
      }
   }

   // Gerar token do cartão (para usar com SDK do Mercado Pago)
   static async generateCardToken(cardData: {
      cardNumber: string;
      cardholderName: string;
      expirationMonth: string;
      expirationYear: string;
      securityCode: string;
   }): Promise<string> {
      this.checkCredentials();

      const tokenData = {
         card_number: cardData.cardNumber.replace(/\s/g, ''),
         cardholder: {
            name: cardData.cardholderName
         },
         expiration_month: cardData.expirationMonth,
         expiration_year: cardData.expirationYear,
         security_code: cardData.securityCode
      };

      try {
         const response = await fetch('https://api.mercadopago.com/v1/card_tokens', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${this.MERCADO_PAGO_PUBLIC_KEY}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(tokenData)
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao gerar token do cartão: ${errorData.message || response.statusText}`);
         }

         const token = await response.json();
         return token.id;
      } catch (error) {
         console.error('Erro ao gerar token do cartão:', error);
         throw new Error('Falha ao processar dados do cartão');
      }
   }

   // Simular pagamento (para desenvolvimento)
   static async simulatePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentId = Math.random().toString(36).substr(2, 9);

      if (paymentRequest.payment_method === 'pix') {
         return {
            id: paymentId,
            status: 'pending',
            payment_method_id: 'pix',
            payment_type_id: 'digital_currency',
            transaction_amount: paymentRequest.amount,
            pix_code: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Teste Empresa6008Brasilia62070503***6304E2CA',
            pix_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            external_reference: paymentRequest.external_reference
         };
      } else {
         return {
            id: paymentId,
            status: 'approved',
            payment_method_id: 'master',
            payment_type_id: 'credit_card',
            transaction_amount: paymentRequest.amount,
            external_reference: paymentRequest.external_reference
         };
      }
   }

   // Verificar se o pagamento foi aprovado
   static isPaymentApproved(status: string): boolean {
      return status === 'approved' || status === 'authorized';
   }

   // Verificar se o pagamento está pendente
   static isPaymentPending(status: string): boolean {
      return status === 'pending' || status === 'in_process';
   }

   // Verificar se o pagamento falhou
   static isPaymentFailed(status: string): boolean {
      return status === 'rejected' || status === 'cancelled' || status === 'refunded';
   }
}
