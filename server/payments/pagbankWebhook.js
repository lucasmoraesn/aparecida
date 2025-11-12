import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { safeLog, safeErrorLog } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Serviço para processar webhooks do PagBank
 * Documentação: https://dev.pagseguro.uol.com.br/reference/webhooks
 */
export class PagBankWebhookService {
  /**
   * Verifica a assinatura HMAC do webhook
   * PagBank usa HMAC-SHA256 com secret configurado no painel
   * 
   * @param {string} signature - Assinatura recebida no header
   * @param {string} rawBody - Body raw da requisição
   * @returns {boolean} True se a assinatura é válida
   */
  static verifySignature(signature, rawBody) {
    try {
      const secret = process.env.PAGBANK_WEBHOOK_SECRET;
      
      if (!secret) {
        safeErrorLog("⚠️  PAGBANK_WEBHOOK_SECRET não configurado");
        return false;
      }

      if (!signature) {
        safeErrorLog("⚠️  Signature não fornecida no header");
        return false;
      }

      // PagBank envia a assinatura no formato: sha256=<hash>
      const expectedSignature = `sha256=${crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex")}`;

      // Comparação segura contra timing attacks
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

      if (!isValid) {
        safeErrorLog("❌ Assinatura inválida no webhook PagBank", {
          received: signature.substring(0, 20) + "...",
          expected: expectedSignature.substring(0, 20) + "...",
        });
      }

      return isValid;
    } catch (error) {
      safeErrorLog("❌ Erro ao verificar assinatura do webhook", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Persiste o webhook recebido no banco de dados
   * 
   * @param {Object} webhookData - Dados do webhook
   * @returns {Promise<Object>} Resultado da inserção
   */
  static async persistWebhook(webhookData) {
    try {
      const {
        provider = "pagbank",
        event_type,
        signature,
        signature_valid,
        payload,
        order_id,
        charge_id,
        reference_id,
        amount,
      } = webhookData;

      const { data, error } = await supabase
        .from("payment_webhooks")
        .insert({
          provider,
          event_type,
          signature,
          signature_valid,
          payload,
          order_id,
          charge_id,
          reference_id,
          amount,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      safeLog("✅ Webhook persistido no banco", {
        webhook_id: data.id,
        event_type,
        order_id,
      });

      return data;
    } catch (error) {
      safeErrorLog("❌ Erro ao persistir webhook", {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Processa o evento do webhook e atualiza o status do pedido
   * 
   * @param {Object} payload - Payload do webhook
   * @param {string} webhookId - ID do webhook no banco
   * @returns {Promise<Object>} Resultado do processamento
   */
  static async processWebhookEvent(payload, webhookId) {
    try {
      safeLog("🔄 Processando evento do webhook", {
        webhook_id: webhookId,
        charges: payload.charges?.length || 0,
      });

      // Extrair dados do payload
      const orderId = payload.id;
      const referenceId = payload.reference_id;
      const charge = payload.charges?.[0];
      
      if (!charge) {
        throw new Error("Nenhuma cobrança encontrada no payload");
      }

      const chargeId = charge.id;
      const chargeStatus = charge.status;
      const amount = charge.amount?.value ? charge.amount.value / 100 : 0;

      // Mapear status do PagBank para nosso sistema
      const statusMap = {
        AUTHORIZED: "AUTHORIZED",
        PAID: "PAID",
        DECLINED: "DECLINED",
        CANCELED: "CANCELED",
        IN_ANALYSIS: "IN_ANALYSIS",
        REFUNDED: "REFUNDED",
      };

      const mappedStatus = statusMap[chargeStatus] || chargeStatus;

      // Verificar se o pedido já existe
      const { data: existingOrder } = await supabase
        .from("pagbank_orders")
        .select("*")
        .eq("order_id", orderId)
        .single();

      let orderResult;

      if (existingOrder) {
        // Atualizar pedido existente
        const { data, error } = await supabase
          .from("pagbank_orders")
          .update({
            status: mappedStatus,
            charge_id: chargeId,
            charge_status: chargeStatus,
            full_response: payload,
            updated_at: new Date().toISOString(),
            paid_at: chargeStatus === "PAID" ? new Date().toISOString() : existingOrder.paid_at,
          })
          .eq("order_id", orderId)
          .select()
          .single();

        if (error) throw error;
        
        orderResult = data;
        safeLog("✅ Pedido atualizado", {
          order_id: orderId,
          old_status: existingOrder.status,
          new_status: mappedStatus,
        });
      } else {
        // Criar novo pedido
        const { data, error } = await supabase
          .from("pagbank_orders")
          .insert({
            order_id: orderId,
            reference_id: referenceId,
            status: mappedStatus,
            customer_name: payload.customer?.name,
            customer_email: payload.customer?.email,
            customer_tax_id: payload.customer?.tax_id,
            amount,
            currency: charge.amount?.currency || "BRL",
            payment_method: charge.payment_method?.type,
            installments: charge.payment_method?.installments || 1,
            charge_id: chargeId,
            charge_status: chargeStatus,
            full_response: payload,
            created_at: payload.created_at || new Date().toISOString(),
            paid_at: chargeStatus === "PAID" ? new Date().toISOString() : null,
          })
          .select()
          .single();

        if (error) throw error;
        
        orderResult = data;
        safeLog("✅ Novo pedido criado", {
          order_id: orderId,
          status: mappedStatus,
        });
      }

      // Marcar webhook como processado
      await supabase
        .from("payment_webhooks")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
        })
        .eq("id", webhookId);

      return {
        success: true,
        order: orderResult,
        event_type: mappedStatus,
      };
    } catch (error) {
      safeErrorLog("❌ Erro ao processar evento do webhook", {
        webhook_id: webhookId,
        error: error.message,
      });

      // Marcar webhook como falho
      await supabase
        .from("payment_webhooks")
        .update({
          status: "failed",
          error_message: error.message,
          processed_at: new Date().toISOString(),
        })
        .eq("id", webhookId);

      throw error;
    }
  }

  /**
   * Fluxo completo de recebimento e processamento de webhook
   * 
   * @param {string} signature - Assinatura do header
   * @param {string} rawBody - Body raw da requisição
   * @param {Object} payload - Payload JSON parseado
   * @returns {Promise<Object>} Resultado do processamento
   */
  static async handleWebhook(signature, rawBody, payload) {
    try {
      // 1. Verificar assinatura
      const isValidSignature = this.verifySignature(signature, rawBody);

      // 2. Extrair informações do payload
      const orderId = payload.id;
      const chargeId = payload.charges?.[0]?.id;
      const referenceId = payload.reference_id;
      const eventType = payload.charges?.[0]?.status;
      const amount = payload.charges?.[0]?.amount?.value
        ? payload.charges[0].amount.value / 100
        : 0;

      // 3. Persistir webhook
      const webhookRecord = await this.persistWebhook({
        provider: "pagbank",
        event_type: eventType,
        signature,
        signature_valid: isValidSignature,
        payload,
        order_id: orderId,
        charge_id: chargeId,
        reference_id: referenceId,
        amount,
      });

      // 4. Se assinatura inválida, não processar mas retornar sucesso (já persistimos)
      if (!isValidSignature) {
        safeErrorLog("⚠️  Webhook com assinatura inválida (persistido mas não processado)", {
          webhook_id: webhookRecord.id,
        });
        
        return {
          success: false,
          error: "Invalid signature",
          webhook_id: webhookRecord.id,
          persisted: true,
        };
      }

      // 5. Processar evento
      const result = await this.processWebhookEvent(payload, webhookRecord.id);

      safeLog("✅ Webhook processado com sucesso", {
        webhook_id: webhookRecord.id,
        order_id: orderId,
        event_type: eventType,
      });

      return {
        success: true,
        webhook_id: webhookRecord.id,
        ...result,
      };
    } catch (error) {
      safeErrorLog("❌ Erro no handleWebhook", {
        error: error.message,
      });
      throw error;
    }
  }
}
