import { randomUUID } from "crypto";
import { pagbankClient } from "./pagbankClient.js";
import { safeLog, safeErrorLog } from "../utils/logger.js";

export class PagBankService {
  /**
   * Cria um pedido (order) com cobrança de cartão de crédito
   * @param {Object} data - Dados do pedido
   * @returns {Promise<Object>} Resposta da API PagBank
   */
  static async createOrder(data) {
    const {
      amount,
      description,
      referenceId,
      customerName,
      customerEmail,
      customerTaxId,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardSecurityCode,
      installments = 1,
      notificationUrl,
    } = data;

    // Validações básicas
    if (!customerEmail || !customerName || !customerTaxId) {
      throw new Error("Dados do cliente incompletos (email, nome, CPF)");
    }

    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardSecurityCode) {
      throw new Error("Dados do cartão incompletos");
    }

    // Converter valor para centavos (PagBank exige valor em centavos)
    const amountInCents = Math.round(amount * 100);

    // ✅ Gerar IDs únicos e idempotentes usando UUID v4
    const orderRef = referenceId || `order_${Date.now()}_${randomUUID()}`;
    const chargeRef = `charge_${Date.now()}_${randomUUID()}`;

    const payload = {
      reference_id: orderRef,
      customer: {
        name: customerName,
        email: customerEmail,
        tax_id: customerTaxId.replace(/\D/g, ""), // Remove formatação do CPF/CNPJ
      },
      items: [
        {
          name: description || "Assinatura",
          quantity: 1,
          unit_amount: amountInCents,
        },
      ],
      charges: [
        {
          reference_id: chargeRef,
          description: description || "Cobrança mensal",
          amount: {
            value: amountInCents,
            currency: "BRL",
          },
          payment_method: {
            type: "CREDIT_CARD",
            installments,
            capture: true, // Captura automática
            card: {
              number: cardNumber.replace(/\s/g, ""), // Remove espaços
              exp_month: String(cardExpMonth).padStart(2, "0"),
              exp_year: String(cardExpYear),
              security_code: cardSecurityCode,
              holder: {
                name: customerName,
              },
            },
          },
          notification_urls: notificationUrl ? [notificationUrl] : undefined,
        },
      ],
    };

    // ✅ Log seguro: mascara dados sensíveis (PAN, CVV, CPF)
    safeLog("📦 PagBank - Criando pedido:", {
      reference_id: payload.reference_id,
      amount: `R$ ${amount}`,
      customer: customerEmail,
      payload: payload // será mascarado automaticamente
    });

    try {
      const { data: responseData } = await pagbankClient.post("/orders", payload);
      
      console.log("✅ PagBank - Pedido criado:", {
        order_id: responseData.id,
        status: responseData.charges?.[0]?.status,
      });

      return responseData;
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error_messages?.[0]?.description || error.message;
      
      // ✅ Log de erro seguro
      safeErrorLog("PagBank - Erro ao criar pedido", error);

      throw new Error(errorMessage);
    }
  }

  /**
   * Processa notificação do webhook
   * @param {Object} body - Body do webhook
   * @param {Object} headers - Headers do webhook
   */
  static async handleWebhook(body, headers) {
    // ✅ Log seguro: mascara dados sensíveis
    safeLog("📥 PagBank Webhook recebido:", {
      headers: headers,
      body: body
    });
    
    // TODO: Validar assinatura do webhook quando PagBank fornecer secret
    // TODO: Consultar API do PagBank para validar dados recebidos
    // TODO: Atualizar status no Supabase (business_registrations, payments)
    
    // Exemplo de estrutura esperada:
    // {
    //   "id": "ORDE_XXX",
    //   "reference_id": "business_123",
    //   "charges": [{
    //     "id": "CHAR_XXX",
    //     "status": "PAID",
    //     "amount": { "value": 1000 }
    //   }]
    // }
    
    return { received: true };
  }

  /**
   * Consulta status de um pedido
   * @param {string} orderId - ID do pedido no PagBank
   * @returns {Promise<Object>} Dados do pedido
   */
  static async getOrder(orderId) {
    try {
      const { data } = await pagbankClient.get(`/orders/${orderId}`);
      console.log("✅ PagBank - Pedido consultado:", orderId);
      return data;
    } catch (error) {
      console.error("❌ PagBank - Erro ao consultar pedido:", error.message);
      throw error;
    }
  }
}
