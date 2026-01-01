/**
 * 📧 NEWSLETTER ROUTES
 * 
 * Endpoints para gerenciamento de inscrições na newsletter
 */

import express from 'express';
import { sendNewsletterWelcomeEmail } from '../services/emailService.js';

// Factory function que recebe o supabase client
export default function createNewsletterRouter(supabase) {
  const router = express.Router();

  /**
   * POST /api/newsletter/subscribe
   * Inscreve um e-mail na newsletter
   */
  router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Validação do e-mail
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'E-mail inválido'
      });
    }

    // Normalizar e-mail (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar se já existe
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reativar inscrição
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ status: 'active' })
          .eq('email', normalizedEmail);

        if (updateError) {
          console.error('Erro ao reativar inscrição:', updateError);
          return res.status(500).json({
            success: false,
            message: 'Erro ao processar inscrição'
          });
        }

        // Enviar e-mail de boas-vindas novamente
        await sendNewsletterWelcomeEmail({ email: normalizedEmail });

        return res.json({
          success: true,
          message: 'Inscrição reativada com sucesso!'
        });
      }

      // Já está inscrito e ativo
      return res.json({
        success: true,
        message: 'E-mail já está inscrito na newsletter!'
      });
    }

    // Inserir novo inscrito
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email: normalizedEmail,
        status: 'active'
      }]);

    if (insertError) {
      console.error('Erro ao inserir inscrito:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar inscrição'
      });
    }

    // Enviar e-mail de boas-vindas
    const emailResult = await sendNewsletterWelcomeEmail({ email: normalizedEmail });

    if (!emailResult.success) {
      console.error('Erro ao enviar e-mail:', emailResult.error);
      // Mesmo com erro no e-mail, a inscrição foi feita
    }

    return res.json({
      success: true,
      message: 'Inscrição realizada com sucesso! Verifique seu e-mail.'
    });

  } catch (error) {
    console.error('Erro ao processar inscrição na newsletter:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar inscrição'
    });
  }
});

  return router;
}
