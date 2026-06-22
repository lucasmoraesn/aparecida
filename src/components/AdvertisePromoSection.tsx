import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { DESIGN_SYSTEM } from '../config/designSystem';

const AdvertisePromoSection = () => {
  return (
    <section 
      className={`${DESIGN_SYSTEM.spacing.sectionPadding} text-white relative overflow-hidden`}
      style={{ backgroundColor: DESIGN_SYSTEM.colors.azulMariano }}
    >
      <div className={`${DESIGN_SYSTEM.spacing.container} relative z-10`}>
        <motion.div
          className="text-center max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Badge Editorial */}
          <motion.div
            className="inline-block"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            
          </motion.div>

          {/* Headline (Forum) */}
          <div className="space-y-4">
            <h2 className={DESIGN_SYSTEM.typography.h2}>
              Sua empresa vista por milhares de romeiros todos os dias
            </h2>
            <div 
              className="h-[1px] w-12 mx-auto" 
              style={{ backgroundColor: DESIGN_SYSTEM.colors.douradoDiscreto }}
            ></div>
          </div>

          {/* Subheadline (Poppins) */}
          <p className={`${DESIGN_SYSTEM.typography.subtitleLight} max-w-2xl mx-auto`}>
            Destaque seu hotel, pousada, restaurante, loja ou serviço de transporte diretamente para os peregrinos que planejam sua visita à Capital Mariana do Brasil.
          </p>

          {/* Diferenciais Editoriais e Limpos (Poppins) - Substitui as métricas berrantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left py-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
                <Check className="w-4 h-4 shrink-0" />
                <h4 className="font-semibold text-xs tracking-wider uppercase">PÚBLICO QUALIFICADO</h4>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed" style={{ fontFamily: 'Verdana, sans-serif' }}>
                ALCANCE VISITANTES NO MOMENTO EXATO EM QUE DECIDEM ONDE COMER, DORMIR, COMPRAR E CONTRATAR TRANSPORTE. NOSSA PLATAFORMA CONECTA PEREGRINOS EM BUSCA DE SERVIÇOS COM NEGÓCIOS QUALIFICADOS, GERANDO DEMANDA REAL E IMEDIATA.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
                <Check className="w-4 h-4 shrink-0" />
                <h4 className="font-semibold text-xs tracking-wider uppercase">ATIVAÇÃO PRÁTICA</h4>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed" style={{ fontFamily: 'Verdana, sans-serif' }}>
                CONFIGURE E COLOQUE SEU ANÚNCIO NO AR RAPIDAMENTE COM INTEGRAÇÃO DIRETA COM NOSSA EQUIPE. SEM BUROCRACIA, SEM ESPERA. SEU NEGÓCIO COMEÇA A APARECER PARA POTENCIAIS CLIENTES EM QUESTÃO DE HORAS.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
                <Check className="w-4 h-4 shrink-0" />
                <h4 className="font-semibold text-xs tracking-wider uppercase">MARCA DE CONFIANÇA</h4>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed" style={{ fontFamily: 'Verdana, sans-serif' }}>
                APAREÇA EM UM PORTAL LIMPO, ORGANIZADO E FOCADO NA MELHOR EXPERIÊNCIA E SEGURANÇA DO ROMEIRO. SUA MARCA SE BENEFICIA DA CONFIANÇA E REPUTAÇÃO QUE CONSTRUÍMOS DIARIAMENTE COM NOSSOS USUÁRIOS.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              to="/cadastrar-negocio"
              className={DESIGN_SYSTEM.buttons.primary}
            >
              <span>Quero aparecer agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={DESIGN_SYSTEM.buttons.secondaryLight}
            >
              Saiba mais
            </button>
          </motion.div>

          {/* Nota de rodapé */}
          <p className="text-slate-400 text-xs font-light">
            Planos de destaque pagos • Cadastro básico gratuito • Cancele quando quiser
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvertisePromoSection;
