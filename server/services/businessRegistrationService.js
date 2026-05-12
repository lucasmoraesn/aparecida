/**
 * Business Registration Service
 * Centraliza lógica reutilizável para Hotels, Restaurantes e Motoristas
 * Padroniza: Upload, BD, Emails, Approval
 */

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendNewBusinessNotification, sendBusinessAnalisisEmail } from "./emailService.js";
import logger from "./logger.js";

// ⚠️ Lazy initialization para evitar problemas com ES modules hoisting
// Os clientes Supabase e Stripe são criados apenas quando necessários
let supabase = null;
let stripe = null;

function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: "2024-06-20"
    });
  }
  return stripe;
}

/**
 * Configuração por tipo de negócio
 */
const BUSINESS_CONFIG = {
  motorista: {
    table: 'motoristas',
    storageBucket: 'motoristas-fotos',
    emailTemplate: 'motorista',
    priceIds: {
      'price_1TGkA6JRpc53eVmKCYLeNscU': { nome: 'basico', destaque: false, verificado: false },
      'price_1TGkA6JRpc53eVmKJE8ff09p': { nome: 'destaque', destaque: true, verificado: true },
      'price_1TGkA7JRpc53eVmKM0gNo3FZ': { nome: 'premium', destaque: true, verificado: true },
    }
  },
  hotel: {
    table: 'hotels',
    storageBucket: 'hoteis-fotos',
    emailTemplate: 'hotel',
    priceIds: {
      'price_1TK30uJRpc53eVmKbuPx37LJ': { nome: 'basico', destaque: false, verificado: false },
      'price_1TK31vJRpc53eVmKK8Wlk35D': { nome: 'destaque', destaque: true, verificado: true },
    }
  },
  restaurante: {
    table: 'restaurantes',
    storageBucket: 'restaurantes-fotos',
    emailTemplate: 'restaurante',
    priceIds: {
      'price_1TK32IJRpc53eVmKZ5G4rC0X': { nome: 'basico', destaque: false, verificado: false },
      'price_1TK32aJRpc53eVmKQT3U2Ff9': { nome: 'destaque', destaque: true, verificado: true },
    }
  }
};

/**
 * Validar sessão Stripe e extrair informações do plano
 */
export async function validateStripeSession(sessionId, businessType) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });

    if (!session || session.payment_status !== 'paid') {
      throw new Error('Pagamento não confirmado ou sessão inválida');
    }

    const config = BUSINESS_CONFIG[businessType];
    if (!config) {
      throw new Error(`Tipo de negócio inválido: ${businessType}`);
    }

    const priceId = session.line_items?.data[0]?.price?.id;
    const planInfo = config.priceIds[priceId] || { nome: 'basico', destaque: false, verificado: false };

    logger.info(`✅ Sessão Stripe validada para ${businessType}`, { sessionId, planInfo });

    return {
      session,
      planInfo,
      customerEmail: session.customer_details?.email
    };
  } catch (error) {
    logger.error(`❌ Erro ao validar sessão Stripe para ${businessType}:`, error);
    throw error;
  }
}

/**
 * Upload de foto para o bucket apropriado
 */
export async function uploadBusinessPhoto(file, businessType) {
  if (!file) return '';

  try {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) throw new Error(`Tipo de negócio inválido: ${businessType}`);

    const ext = file.originalname.split('.').pop() || 'jpg';
    const fileName = `${businessType}_${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadError } = await getSupabase().storage
      .from(config.storageBucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      logger.error(`❌ Erro ao fazer upload da foto (${businessType}):`, uploadError);
      return '';
    }

    const { data: publicUrlData } = getSupabase().storage
      .from(config.storageBucket)
      .getPublicUrl(fileName);

    const photoUrl = publicUrlData?.publicUrl || '';
    logger.info(`✅ Foto enviada para ${businessType}:`, photoUrl);
    return photoUrl;
  } catch (error) {
    logger.error(`❌ Erro inesperado no upload da foto (${businessType}):`, error);
    return '';
  }
}

/**
 * Registrar novo negócio (Hotel, Restaurante, Motorista)
 */
export async function registerBusiness(businessType, sessionId, businessData, photoUrls = []) {
  try {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) throw new Error(`Tipo de negócio inválido: ${businessType}`);

    const [sessionInfo] = await Promise.all([
      validateStripeSession(sessionId, businessType)
    ]);

    logger.info(`✅ Criando ${businessType} no banco de dados...`, {
      table: config.table,
      status: 'pending_review',
      totalFotos: Array.isArray(photoUrls) ? photoUrls.length : 0
    });

    // Se photoUrls for string (retrocompatibilidade), converter para array
    const fotoArray = Array.isArray(photoUrls) ? photoUrls : (photoUrls ? [photoUrls] : []);

    const registrationData = {
      nome: businessData.nome,
      whatsapp: businessData.whatsapp,
      telefone: businessData.telefone || businessData.whatsapp,
      email: businessData.email,
      endereco: businessData.endereco,
      cidades: businessData.cidades || [],
      descricao: businessData.descricao || '',
      foto_url: fotoArray.length > 0 ? fotoArray[0] : '', // Primeira foto como principal
      fotos_urls: fotoArray, // Array completo de fotos
      plano: sessionInfo.planInfo.nome,
      destaque: sessionInfo.planInfo.destaque,
      verificado: sessionInfo.planInfo.verificado,
      status: 'pending_review', // Aguarda aprovação do admin
      stripe_session_id: sessionId,
      stripe_subscription_id: sessionInfo.session?.subscription || null,
      ...( businessType === 'restaurante' && { especialidade: businessData.especialidade || '' } )
    };

    const { data, error } = await getSupabase()
      .from(config.table)
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      logger.error(`❌ Erro ao inserir ${businessType}:`, error);
      throw error;
    }

    logger.info(`✅ ${businessType} registrado com sucesso:`, data.id);

    // Enviar e-mails (sem bloquear a resposta)
    try {
      await sendNewBusinessNotification({
        type: businessType,
        nome: businessData.nome,
        whatsapp: businessData.whatsapp,
        email: sessionInfo.customerEmail,
        plano: sessionInfo.planInfo.nome
      });
      logger.info(`✅ E-mail de notificação enviado ao admin para ${businessType}`);
    } catch (emailErr) {
      logger.error(`⚠️ Erro ao enviar e-mail ao admin:`, emailErr);
    }

    try {
      if (sessionInfo.customerEmail) {
        await sendBusinessAnalisisEmail({
          type: businessType,
          nome: businessData.nome,
          email: sessionInfo.customerEmail
        });
        logger.info(`✅ E-mail de análise enviado para ${businessType}:`, sessionInfo.customerEmail);
      }
    } catch (emailErr) {
      logger.error(`⚠️ Erro ao enviar e-mail de análise:`, emailErr);
    }

    return data;
  } catch (error) {
    logger.error(`❌ Erro ao registrar ${businessType}:`, error);
    throw error;
  }
}

/**
 * Listar registros pendentes de aprovação
 */
export async function getPendingRegistrations(businessType) {
  try {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) throw new Error(`Tipo de negócio inválido: ${businessType}`);

    const { data, error } = await getSupabase()
      .from(config.table)
      .select('*')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(`❌ Erro ao listar pendentes de ${businessType}:`, error);
    throw error;
  }
}

/**
 * Listar registros ativos
 */
export async function getActiveRegistrations(businessType) {
  try {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) throw new Error(`Tipo de negócio inválido: ${businessType}`);

    const { data, error } = await getSupabase()
      .from(config.table)
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(`❌ Erro ao listar ativos de ${businessType}:`, error);
    throw error;
  }
}

/**
 * Aprovar registro
 */
export async function approveBusiness(businessType, id) {
  try {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) throw new Error(`Tipo de negócio inválido: ${businessType}`);

    const { error } = await getSupabase()
      .from(config.table)
      .update({ status: 'active' })
      .eq('id', id);

    if (error) throw error;
    logger.info(`✅ ${businessType} aprovado:`, id);
    return true;
  } catch (error) {
    logger.error(`❌ Erro ao aprovar ${businessType}:`, error);
    throw error;
  }
}

/**
 * Rejeitar registro
 */
export async function rejectBusiness(businessType, id, reason = '') {
  try {
    const config = BUSINESS_CONFIG[businessType];
    if (!config) throw new Error(`Tipo de negócio inválido: ${businessType}`);

    const { error } = await getSupabase()
      .from(config.table)
      .update({
        status: 'rejected',
        descricao: `REJEITADO: ${reason}` // Salva razão da rejeição
      })
      .eq('id', id);

    if (error) throw error;
    logger.info(`✅ ${businessType} rejeitado:`, id);
    return true;
  } catch (error) {
    logger.error(`❌ Erro ao rejeitar ${businessType}:`, error);
    throw error;
  }
}

/**
 * Detectar tipo de negócio pela metadata do Stripe
 */
export function detectBusinessType(metadata) {
  if (!metadata) return null;
  const type = metadata.type || metadata.businessType;
  if (BUSINESS_CONFIG[type]) return type;
  return null;
}

export default {
  validateStripeSession,
  uploadBusinessPhoto,
  registerBusiness,
  getPendingRegistrations,
  getActiveRegistrations,
  approveBusiness,
  rejectBusiness,
  detectBusinessType,
  BUSINESS_CONFIG
};
