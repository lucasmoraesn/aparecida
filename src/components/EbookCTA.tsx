import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { EBOOK_CONFIG } from '../config/constants';
import { DESIGN_SYSTEM } from '../config/designSystem';

interface EbookCTAProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export default function EbookCTA({ className = '', variant = 'full' }: EbookCTAProps) {
  if (variant === 'compact') {
    return (
      <Link 
        to="/kit-do-romeiro"
        className={`group flex items-center justify-between p-4 rounded-lg shadow-sm border border-[#c5a059]/30 hover:border-[#c5a059]/60 transition-all duration-300 ${className}`}
        style={{ backgroundColor: DESIGN_SYSTEM.colors.azulMariano }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#faf8f5]/10 text-[#c5a059] rounded-md shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-['Segoe_UI',_sans-serif] font-semibold text-sm sm:text-base leading-tight text-white group-hover:text-[#c5a059] transition-colors">
              Baixe o Kit Oficial do Romeiro 2026
            </h4>
            <p className="font-['Segoe_UI',_sans-serif] text-xs text-slate-300 mt-0.5 sm:block hidden font-light">
              O guia digital definitivo para planejar sua romaria por apenas {EBOOK_CONFIG.priceFormatted}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#c5a059] shrink-0 font-['Segoe_UI',_sans-serif] tracking-wider uppercase">
          <span>Ver Guia</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    );
  }

  return (
    <div 
      className={`${DESIGN_SYSTEM.cards.editorialDark} ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Lado Esquerdo */}
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <h3 className="font-['Segoe_UI',_sans-serif] text-2xl sm:text-3xl md:text-3xl font-semibold leading-snug text-white tracking-wide">
            Vai viajar para Aparecida? Planeje com o Kit Oficial do Romeiro 2026!
          </h3>
          <p className="font-['Segoe_UI',_sans-serif] text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Tenha em mãos roteiros prontos de 1, 2 e 3 dias, lista de hotéis e restaurantes recomendados, checklist de mala e dicas valiosas de segurança para evitar golpes. Leve no celular por apenas <strong className="text-[#c5a059] font-bold">{EBOOK_CONFIG.priceFormatted}</strong>.
          </p>
        </div>

        {/* Lado Direito */}
        <div className="shrink-0 w-full md:w-auto text-center">
          <Link
            to="/kit-do-romeiro"
            className={DESIGN_SYSTEM.buttons.primary}
          >
            <BookOpen className="w-4 h-4" />
            <span>Baixar Kit Oficial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
