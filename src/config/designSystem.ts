/**
 * Design System Centralizado - Explore Aparecida (2026)
 * 
 * Este arquivo serve como a única fonte de verdade para a identidade visual do portal,
 * garantindo consistência, aparência editorial premium e facilidade de manutenção.
 */

export const DESIGN_SYSTEM = {
  // Paleta de Cores Coerente com o Tom Mariana & Tradição
  colors: {
    azulMariano: '#0a1c38',       // Dominante para Hero e fundos nobres
    cremePapel: '#faf8f5',        // Fundo principal de páginas e leitura
    douradoDiscreto: '#c5a059',   // Detalhes, bordas decorativas e acentos
    douradoHover: '#b08e4b',      // Estado hover de botões dourados
    cinzaBege: '#f0ede8',         // Fundo secundário para contraste suave
    cinzaClaro: '#faf8f5',        // Variação de fundo claro
    textoPrincipal: '#1e293b',    // Slate 800 para texto principal
    textoSecundario: '#475569',   // Slate 600 para textos menores/suportes
    textoMutado: '#94a3b8',       // Slate 400 para textos auxiliares
  },

  // Tipografia (Segoe UI para todos os elementos)
  typography: {
    // Títulos Clássicos
    h1: "font-['Segoe_UI',_sans-serif] tracking-wide text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.15]",
    h2: "font-['Segoe_UI',_sans-serif] tracking-wide text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.2]",
    h3: "font-['Segoe_UI',_sans-serif] tracking-wider text-xl sm:text-2xl font-normal leading-[1.25] uppercase",
    
    // Rótulos editoriais e badges
    label: "font-['Segoe_UI',_sans-serif] tracking-[0.18em] uppercase text-xs font-semibold text-[#c5a059]",
    
    // Textos Gerais
    body: "font-['Segoe_UI',_sans-serif] text-slate-600 font-light leading-relaxed text-sm sm:text-base",
    bodyLight: "font-['Segoe_UI',_sans-serif] text-slate-300 font-light leading-relaxed text-sm sm:text-base",
    
    // Subtítulos
    subtitle: "font-['Segoe_UI',_sans-serif] text-slate-600 font-light leading-relaxed text-base sm:text-lg md:text-xl",
    subtitleLight: "font-['Segoe_UI',_sans-serif] text-slate-300 font-light leading-relaxed text-base sm:text-lg md:text-xl",
  },

  // Botões Editoriais (Segoe UI)
  buttons: {
    // Primário Dourado
    primary: "font-['Segoe_UI',_sans-serif] bg-[#c5a059] hover:bg-[#b08e4b] text-[#0a1c38] font-bold py-3.5 px-8 rounded-md transition-colors shadow-sm tracking-[0.08em] uppercase text-xs sm:text-sm inline-flex items-center justify-center gap-2",
    
    // Primário Claro
    primaryLight: "font-['Segoe_UI',_sans-serif] bg-[#faf8f5] hover:bg-[#f0ede8] text-[#0a1c38] font-bold py-3.5 px-8 rounded-md transition-colors shadow-sm tracking-[0.08em] uppercase text-xs sm:text-sm inline-flex items-center justify-center gap-2",
    
    // Secundário Dourado (Borda)
    secondary: "font-['Segoe_UI',_sans-serif] border border-[#c5a059]/40 hover:bg-[#c5a059]/10 text-[#0a1c38] font-semibold py-3.5 px-8 rounded-md transition-colors tracking-[0.05em] text-xs sm:text-sm inline-flex items-center justify-center gap-2",
    
    // Secundário Branco (Borda)
    secondaryLight: "font-['Segoe_UI',_sans-serif] border border-white/40 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-md transition-colors tracking-[0.05em] text-xs sm:text-sm inline-flex items-center justify-center gap-2",
  },

  // Badges Editoriais (Segoe UI)
  badges: {
    editorial: "font-['Segoe_UI',_sans-serif] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 text-[#c5a059] bg-transparent text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase",
  },

  // Cards de Conteúdo (Forum + Poppins)
  cards: {
    editorial: "bg-[#faf8f5] border border-[#c5a059]/30 rounded-lg p-6 sm:p-8 relative overflow-hidden transition-all duration-300 hover:border-[#c5a059]/60",
    editorialDark: "bg-[#0a1c38] border border-[#c5a059]/30 rounded-lg p-6 sm:p-8 relative overflow-hidden transition-all duration-300 hover:border-[#c5a059]/60",
  },

  // Sombras Discretas
  shadows: {
    sm: "shadow-[0_2px_4px_rgba(0,0,0,0.05)]",
    md: "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
    lg: "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]",
    editorial: "shadow-[0_15px_35px_-12px_rgba(0,0,0,0.12)]",
  },

  // Arredondamentos
  borderRadius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    editorial: "rounded-lg",
  },

  // Larguras de Containers
  containerWidths: {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  },

  // Espaçamentos verticais/horizontais
  spacing: {
    sectionPadding: "py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8",
    container: "max-w-6xl mx-auto",
  }
};
