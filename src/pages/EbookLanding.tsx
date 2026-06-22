import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, CheckCircle, AlertTriangle, MapPin, Hotel, 
  Utensils, Calendar, Phone, ArrowRight, 
  ShieldCheck, Star, Globe
} from 'lucide-react';
import { EBOOK_CONFIG } from '../config/constants';
import { trackKitView, trackKitCheckoutStarted } from '../lib/analytics';
import { startEbookCheckout } from '../lib/ebookApi';
import { DESIGN_SYSTEM } from '../config/designSystem';

export default function EbookLanding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 📊 Analytics: Visualização da página
    trackKitView();

    // 🔍 SEO Dinâmico
    document.title = `${EBOOK_CONFIG.title} - O Guia Definitivo do Romeiro em Aparecida`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `${EBOOK_CONFIG.description} Contém roteiros de 1, 2 e 3 dias, checklist completo, contatos úteis e dicas de hospedagem/alimentação.`);

    // Open Graph SEO
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', `${EBOOK_CONFIG.title} - Guia Digital Oficial`);
    document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', EBOOK_CONFIG.description);
    document.head.appendChild(ogDesc);

    // Schema.org Product JSON-LD
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": EBOOK_CONFIG.title,
      "description": EBOOK_CONFIG.description,
      "image": "https://aparecidadonortesp.com.br/images/ebook-cover.jpg",
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "BRL",
        "price": EBOOK_CONFIG.price.toString(),
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      // Limpeza de Scripts de SEO ao desmontar
      document.head.removeChild(schemaScript);
    };
  }, []);

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    
    // 📊 Analytics: Clique no checkout
    trackKitCheckoutStarted();

    try {
      const checkoutUrl = await startEbookCheckout();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error(err);
      setError('Ocorreu um erro ao iniciar a compra. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <div 
      className="min-h-screen text-slate-800 font-sans"
      style={{ backgroundColor: DESIGN_SYSTEM.colors.cremePapel }}
    >
      
      {/* ── Hero Section (Azul Mariano Sólido & Amplo Respiro) ────────────────── */}
      <section 
        className="relative text-white pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-8 overflow-hidden"
        style={{ backgroundColor: DESIGN_SYSTEM.colors.azulMariano }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Coluna Texto */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span 
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-[0.15em] uppercase bg-transparent"
                style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto, borderColor: `${DESIGN_SYSTEM.colors.douradoDiscreto}40` }}
              >
                Kit Romeiro · Edição Especial de Ano Santo
              </span>
              <h1 className={DESIGN_SYSTEM.typography.h1}>
                Kit Romeiro 2026
              </h1>
            </div>
            
            <p className={DESIGN_SYSTEM.typography.subtitleLight}>
              Guia completo para sua viagem a Aparecida. Fé, roteiros e dicas práticas em um único kit — feito especialmente para o Ano Santo 2026.
            </p>
            
            {/* Benefícios rápidos - Minimalista */}
            <div className="space-y-3 text-sm md:text-base max-w-lg">
              <div className="flex items-center gap-3 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DESIGN_SYSTEM.colors.douradoDiscreto }}></span>
                <span>Roteiros completos e práticos para 1, 2 e 3 dias</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DESIGN_SYSTEM.colors.douradoDiscreto }}></span>
                <span>Como evitar golpes, táxis abusivos e armadilhas locais</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DESIGN_SYSTEM.colors.douradoDiscreto }}></span>
                <span>Indicações honestas de hospedagem e alimentação rápida</span>
              </div>
            </div>

            {/* CTA do Hero - Sóbrio e Elegante */}
            <div className="pt-4 space-y-4">
              <button
                onClick={handlePurchase}
                disabled={loading}
                className={DESIGN_SYSTEM.buttons.primary}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#0a1c38]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Acessando pagamento...
                  </span>
                ) : (
                  <>
                    <span>GARANTIR MEU GUIA POR APENAS {EBOOK_CONFIG.priceFormatted}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
              
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck 
                  className="w-4 h-4 shrink-0" 
                  style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}
                />
                <span>Compra segura. Acesso imediato no seu e-mail em formato digital (PDF).</span>
              </div>
            </div>
          </div>

          {/* Coluna Imagem Real do Kit Romeiro 2026 */}
          <div className="lg:col-span-5 flex justify-center items-center mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                animation: 'floatKit 4s ease-in-out infinite',
              }}
            >
              <style>{`
                @keyframes floatKit {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>
              <img
                src="/images/imagemkit2.png"
                alt="Kit Romeiro 2026 — Guia completo para sua viagem a Aparecida"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full"
                style={{
                  maxWidth: '420px',
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.45))',
                }}
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── Seção de Benefícios Detalhados (Simplicidade & Respiro) ───────────── */}
      <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className={DESIGN_SYSTEM.typography.h2}>
            Tudo o que você precisa para viajar com tranquilidade
          </h2>
          <div className="h-[1px] w-12 mx-auto mt-4 mb-6" style={{ backgroundColor: DESIGN_SYSTEM.colors.douradoDiscreto }}></div>
          <p className={DESIGN_SYSTEM.typography.body}>
            Esqueça materiais promocionais rasos. Este guia reúne informações valiosas, fruto de experiência real na cidade, estruturadas de forma simples para ler direto no celular.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16"
        >
          {/* Benefício 1: Principais atrações */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className={DESIGN_SYSTEM.typography.h3}>
              As Atrações de Verdade
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              Horários de missa recomendados, rotas otimizadas na Basílica, o melhor momento para visitar a Imagem e como conhecer o Caminho do Rosário e Porto Itaguaçu sem pressa.
            </p>
          </motion.div>

          {/* Benefício 2: Onde se hospedar */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
              <Hotel className="w-5 h-5" />
            </div>
            <h3 className={DESIGN_SYSTEM.typography.h3}>
              Hospedagem Confiável
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              Dicas honestas de hotéis e pousadas bem localizados. Saiba como escolher hospedagem perto do Santuário e os cuidados fundamentais para evitar golpes ao reservar online.
            </p>
          </motion.div>

          {/* Benefício 3: Onde comer */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className={DESIGN_SYSTEM.typography.h3}>
              Alimentação Prática
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              Onde comer bem sem pagar preços abusivos. Indicações de restaurantes de comida caseira tradicional e alternativas rápidas e limpas próximas às áreas de peregrinação.
            </p>
          </motion.div>

          {/* Benefício 4: Roteiros de 1, 2 e 3 dias */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className={DESIGN_SYSTEM.typography.h3}>
              Roteiros Passo a Passo
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              Seja uma viagem de bate-volta de 1 dia ou um final de semana completo (2 ou 3 dias), tenha em mãos o roteiro exato organizado de maneira lógica e sem correria.
            </p>
          </motion.div>

          {/* Benefício 5: Contatos úteis */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
              <Phone className="w-5 h-5" />
            </div>
            <h3 className={DESIGN_SYSTEM.typography.h3}>
              Guia de Telefones & Apoio
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              Contatos imediatos das secretarias das igrejas, serviços de saúde locais, táxis credenciados de confiança e telefones de emergência para levar salvos no seu aparelho.
            </p>
          </motion.div>

          {/* Benefício 6: Checklist do Romeiro */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className={DESIGN_SYSTEM.typography.h3}>
              Checklist de Bagagem
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              O que realmente levar na mochila para um dia inteiro de caminhada: roupas adequadas para o clima e os templos, calçados certos e itens práticos que fazem a diferença.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Box de Bônus (Visual Clássico de Editora) ────────────────────────── */}
        <div 
          className="mt-20 bg-white rounded-lg p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start shadow-sm border"
          style={{ borderColor: `${DESIGN_SYSTEM.colors.douradoDiscreto}40` }}
        >
          <div 
            className="p-3 bg-white rounded-md shrink-0 border"
            style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto, borderColor: `${DESIGN_SYSTEM.colors.douradoDiscreto}20` }}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <h3 className={DESIGN_SYSTEM.typography.h3} style={{ color: DESIGN_SYSTEM.colors.azulMariano }}>
              Capítulo Exclusivo: Os maiores erros que você deve evitar
            </h3>
            <p className={DESIGN_SYSTEM.typography.body}>
              O maior valor deste guia está no que você vai economizar. Revelamos as abordagens falsas mais comuns na cidade, golpes de estacionamentos clandestinos, como fugir de preços abusivos e a forma segura de se deslocar pelas áreas de grande movimentação sem dores de cabeça.
            </p>
          </div>
        </div>
      </section>

      {/* ── Seção de Depoimentos (Simples, Editorial) ───────────────────────── */}
      <section 
        className={`${DESIGN_SYSTEM.spacing.sectionPadding} border-t border-b border-slate-200/40`}
        style={{ backgroundColor: DESIGN_SYSTEM.colors.cinzaBege }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className={DESIGN_SYSTEM.typography.h2}>
              A palavra de quem já usou o guia
            </h2>
            <div className="h-[1px] w-8 mx-auto mt-3" style={{ backgroundColor: DESIGN_SYSTEM.colors.douradoDiscreto }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex text-sm" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-light italic">
                "O roteiro de 2 dias salvou nossa viagem! Conseguimos ir na missa, passear de bondinho e ir até o Porto Itaguaçu sem pressa e sem nos perdermos."
              </p>
              <div className="h-[1px] w-6 bg-slate-300"></div>
              <h5 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">— Maria do Carmo, Belo Horizonte (MG)</h5>
            </div>
            
            <div className="space-y-4">
              <div className="flex text-sm" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-light italic">
                "Gostei muito das indicações sobre a segurança e os estacionamentos locais. Evitamos cair em armadilhas de ambulantes graças às dicas."
              </p>
              <div className="h-[1px] w-6 bg-slate-300"></div>
              <h5 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">— José Roberto, S. J. do Rio Preto (SP)</h5>
            </div>

            <div className="space-y-4">
              <div className="flex text-sm" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }}>
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-light italic">
                "Viajei sozinha com meus filhos pequenos e o guia de bolso no celular me ajudou demais nos contatos e no que levar na mala. Excelente manual!"
              </p>
              <div className="h-[1px] w-6 bg-slate-300"></div>
              <h5 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">— Aparecida Ferreira, Londrina (PR)</h5>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing and Final CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <div 
          className="rounded-xl p-8 md:p-16 text-white border relative overflow-hidden"
          style={{ backgroundColor: DESIGN_SYSTEM.colors.azulMariano, borderColor: `${DESIGN_SYSTEM.colors.douradoDiscreto}30` }}
        >
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <h2 className={DESIGN_SYSTEM.typography.h2}>
                Garanta o seu Guia do Romeiro 2026
              </h2>
              <p className={DESIGN_SYSTEM.typography.subtitleLight}>
                Tenha em mãos o material mais prático e sincero para organizar sua viagem a Aparecida de forma segura e proveitosa.
              </p>
            </div>

            <div className="py-4">
              <span className="text-slate-400 text-xs line-through tracking-wider">De R$ 29,90</span>
              <div 
                className="text-5xl md:text-6xl tracking-wider my-2 font-normal"
                style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto, fontFamily: 'Segoe UI' }}
              >
                {EBOOK_CONFIG.priceFormatted}
              </div>
              <span className="text-slate-400 text-xs font-light block mt-1">Valor único. Acesso enviado imediatamente para seu e-mail.</span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handlePurchase}
                disabled={loading}
                className={DESIGN_SYSTEM.buttons.primary}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#0a1c38]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Acessando pagamento...
                  </span>
                ) : (
                  <>
                    <span>COMPRAR AGORA</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t text-slate-300 text-xs font-light max-w-2xl mx-auto"
              style={{ borderTopColor: `${DESIGN_SYSTEM.colors.douradoDiscreto}20` }}
            >
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 opacity-80" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }} />
                <span>Pagamento Seguro Stripe</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Star className="w-5 h-5 opacity-80" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }} />
                <span>Informações Práticas</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Globe className="w-5 h-5 opacity-80" style={{ color: DESIGN_SYSTEM.colors.douradoDiscreto }} />
                <span>Leitura Fácil no Celular</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
