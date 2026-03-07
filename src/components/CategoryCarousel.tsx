import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  {
    to: '/hoteis-em-aparecida-sp',
    image: '/images/hotel.png',
    title: 'Hotéis e Pousadas',
    description: 'Encontre a melhor hospedagem para sua estadia em Aparecida',
    tag: 'Hospedagem',
    tagColor: '#3B82F6',
  },
  {
    to: '/restaurantes-em-aparecida-sp',
    image: '/images/restaurante.png',
    title: 'Restaurantes',
    description: 'Saborosa culinária local e regional para todos os gostos',
    tag: 'Gastronomia',
    tagColor: '#F59E0B',
  },
  {
    to: '/lojas-religiosas-em-aparecida-sp',
    image: '/images/lojareligiosa.png',
    title: 'Lojas Religiosas',
    description: 'Artigos religiosos, souvenirs e lembranças especiais',
    tag: 'Compras',
    tagColor: '#8B5CF6',
  },
  {
    to: '/pontos-turisticos-em-aparecida-sp',
    image: '/images/pontoturistico.png',
    title: 'Pontos Turísticos',
    description: 'Conheça as principais atrações e experiências da cidade',
    tag: 'Turismo',
    tagColor: '#10B981',
  },
];

// Clone do primeiro card no final — permite loop seamless
const displayItems = [...categories, categories[0]];

const CARD_W   = 320;
const CARD_GAP = 24;
const STEP     = CARD_W + CARD_GAP;

const TRANSITION = 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

const CategoryCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const pausedRef    = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null); // ref direta na trilha
  const touchStartX  = useRef(0);
  const dragging     = useRef(false);

  // Índice lógico (0-3) para dots e highlight
  const activeIndex = current === categories.length ? 0 : current;

  const calcOffset = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const cw     = containerRef.current.offsetWidth;
    const center = (cw - CARD_W) / 2;
    setTrackOffset(center - idx * STEP);
  }, []);

  useEffect(() => {
    calcOffset(current);
    const onResize = () => calcOffset(current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current, calcOffset]);

  // Quando chega no clone (índice 4), aguarda a transição e salta para o card real 0
  useEffect(() => {
    if (current !== categories.length) return;
    const t = setTimeout(() => {
      // Desativa transição diretamente no DOM — sem re-render extra
      if (trackRef.current) trackRef.current.style.transition = 'none';
      setCurrent(0);
      // Reativa transição após o browser pintar o frame sem animação
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (trackRef.current) trackRef.current.style.transition = TRANSITION;
        })
      );
    }, 220);
    return () => clearTimeout(t);
  }, [current]);

  // Auto-play
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent(c => c + 1);
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(categories.length, c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    dragging.current    = true;
    pausedRef.current   = true;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    dragging.current  = false;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    pausedRef.current = false;
  };

  return (
    <section
      className="py-24 sm:py-32 bg-white relative overflow-hidden"
      aria-label="Categorias de Aparecida"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Decoração de fundo — sutil */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-50/50 rounded-full blur-3xl" />

      {/* ── Cabeçalho ──────────────────────────────────────────── */}
      <motion.div
        className="relative text-center mb-14 sm:mb-18 px-4"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.20em] uppercase text-blue-500 mb-3">
          Guia de Aparecida
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Explore{' '}
          <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
            Aparecida
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
          Estabelecimentos selecionados para tornar sua visita inesquecível
        </p>
      </motion.div>

      {/* ── Carrossel ──────────────────────────────────────────── */}
      <div className="relative">

        {/* Trilha */}
        <div
          ref={containerRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ paddingBottom: '4px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={trackRef}
            className="flex select-none"
            style={{
              transform:  `translateX(${trackOffset}px)`,
              transition: TRANSITION,
              gap:        `${CARD_GAP}px`,
            }}
          >
            {displayItems.map((cat, i) => {
              const isActive = i === activeIndex && !(i === 0 && current === categories.length);
              const isClone  = i === categories.length; // último item é o clone
              return (
                <div
                  key={isClone ? `${cat.to}-clone` : cat.to}
                  style={{ width: `${CARD_W}px`, flexShrink: 0 }}
                  className={`transition-all duration-200 ease-in-out ${
                    i === current ? 'scale-100 opacity-100' : 'scale-[0.87] opacity-[0.32]'
                  }`}
                >
                  <Link
                    to={cat.to}
                    tabIndex={i === current ? 0 : -1}
                    draggable={false}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-[28px]"
                  >
                    <div
                      className="bg-white overflow-hidden rounded-[28px] transition-shadow duration-400"
                      style={{
                        boxShadow: i === current
                          ? '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)'
                          : '0 2px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Imagem */}
                      <div className="relative overflow-hidden" style={{ height: '220px' }}>
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                          draggable={false}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.06) 40%, transparent 68%)',
                          }}
                        />
                        <div
                          className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase"
                          style={{ backgroundColor: cat.tagColor }}
                        >
                          {cat.tag}
                        </div>
                      </div>

                      {/* Corpo do card */}
                      <div className="px-6 pt-5 pb-6">
                        <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                          {cat.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all duration-200">
                          Explorar
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seta – esquerda */}
        <button
          onClick={prev}
          disabled={current === 0}
          aria-label="Categoria anterior"
          className={`absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 lg:left-6 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
            current === 0
              ? 'bg-white/60 border border-gray-200/60 text-gray-300 cursor-not-allowed'
              : 'bg-white border border-gray-200 shadow-md text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Seta – direita */}
        <button
          onClick={next}
          disabled={current >= categories.length - 1}
          aria-label="Próxima categoria"
          className={`absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 lg:right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
            current >= categories.length - 1
              ? 'bg-white/60 border border-gray-200/60 text-gray-300 cursor-not-allowed'
              : 'bg-white border border-gray-200 shadow-md text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Dots ──────────────────────────────────────────────── */}
      <div className="relative flex justify-center items-center gap-2 mt-10" role="tablist" aria-label="Slides">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`${categories[i].title}`}
            className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            style={{
              width:           i === activeIndex ? '28px' : '8px',
              height:          '8px',
              backgroundColor: i === activeIndex ? '#3B82F6' : '#D1D5DB',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryCarousel;
