import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
//  AJUSTE DA ONDA — mexa apenas aqui
//
//  WAVE_PEAK  → altura do pico (quanto a onda sobe no centro)
//               menor número = onda MAIOR  |  ex: 20 (grande) → 70 (quase nada)
//
//  WAVE_BASE  → altura das laterais (quão reto fica nas bordas)
//               maior número = laterais mais RETAS  |  ex: 70 a 79
//
//  WAVE_HEIGHT → altura total do SVG em pixels
//               maior número = área total da onda mais alta
// ═══════════════════════════════════════════════════════════════
const WAVE_PEAK   = 50; // 0–79  (menor = onda maior)
const WAVE_BASE   = 75; // 0–80  (maior = laterais mais retas)
const WAVE_HEIGHT = 80; // px    (altura total do bloco da onda)
// ═══════════════════════════════════════════════════════════════

/** Remove diacríticos para casar "hoteis" com "hotéis", "almoco" com "almoço", etc. */
function normalizeSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

const CATEGORY_ROUTES: Record<string, string> = {
  'Hotéis e Pousadas': '/hoteis-em-aparecida-sp',
  Restaurantes: '/restaurantes-em-aparecida-sp',
  'Lojas Religiosas': '/lojas-religiosas-em-aparecida-sp',
  'Pontos Turísticos': '/pontos-turisticos-em-aparecida-sp',
  Eventos: '/eventos',
};

const Hero = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'todas', name: 'Todas as categorias', options: [] },
    {
      id: 'hoteis',
      name: 'Hotéis e Pousadas',
      options: [
        'Hotel Aparecida Palace',
        'Pousada Nossa Senhora',
        'Hotel Santuário',
        'Pousada do Romeiro',
        'Hotel Basílica',
        'Pousada da Fé',
        'Hotel Mariana',
        'Pousada São José'
      ]
    },
    {
      id: 'restaurantes',
      name: 'Restaurantes',
      options: [
        'Restaurante Basílica',
        'Cantina Italiana',
        'Churrascaria Gaúcha',
        'Restaurante Familiar',
        'Pizzaria Romana',
        'Café da Manhã',
        'Restaurante Gourmet',
        'Lanchonete Rápida'
      ]
    },
    {
      id: 'lojas',
      name: 'Lojas Religiosas',
      options: [
        'Loja de Artigos Religiosos',
        'Souvenirs da Basílica',
        'Livraria Católica',
        'Loja de Velas',
        'Artesanato Religioso',
        'Loja de Imagens',
        'Loja de Terços',
        'Loja de Roupas Religiosas'
      ]
    },
    {
      id: 'pontos',
      name: 'Pontos Turísticos',
      options: [
        'Basílica Nacional',
        'Museu de Cera',
        'Mirante da Basílica',
        'Passarela da Fé',
        'Porto Itaguaçu',
        'Morro do Cruzeiro',
        'Santuário Nacional',
        'Centro de Eventos'
      ]
    },
    {
      id: 'eventos',
      name: 'Eventos',
      options: [
        'Missa da Mãe Aparecida',
        'Procissão das Velas',
        'Festa de Nossa Senhora',
        'Celebração da Padroeira',
        'Encontro de Caravanas',
        'Retiro Espiritual',
        'Novena de Nossa Senhora',
        'Celebração Eucarística'
      ]
    }
  ];

  const handleSearch = () => {
    const rawTerm = searchTerm.trim();
    const norm = normalizeSearch(searchTerm);

    const searchState = rawTerm ? { searchTerm: rawTerm } : undefined;

    // 1) Categoria específica no dropdown (prioridade sobre o texto)
    if (selectedCategory && selectedCategory !== 'Todas as categorias') {
      const path = CATEGORY_ROUTES[selectedCategory];
      if (path) {
        navigate(path, { state: searchState });
        return;
      }
    }

    // 2) Inferir pelo texto (acentos já normalizados)
    if (norm) {
      if (
        norm.includes('hotel') ||
        norm.includes('hoteis') ||
        norm.includes('pousad') ||
        norm.includes('hosped') ||
        norm.includes('hostel')
      ) {
        navigate('/hoteis-em-aparecida-sp', { state: searchState });
        return;
      }
      if (
        norm.includes('restaurant') ||
        norm.includes('comida') ||
        norm.includes('almoco') ||
        norm.includes('jantar') ||
        norm.includes('lanche') ||
        norm.includes('pizz') ||
        norm.includes('gastronom') ||
        norm.includes('cantina') ||
        norm.includes('churrasc')
      ) {
        navigate('/restaurantes-em-aparecida-sp', { state: searchState });
        return;
      }
      if (
        norm.includes('loja') ||
        norm.includes('souvenir') ||
        norm.includes('terco') ||
        norm.includes('religios') ||
        norm.includes('vela') ||
        norm.includes('imagem') ||
        norm.includes('compra') ||
        norm.includes('artigo')
      ) {
        navigate('/lojas-religiosas-em-aparecida-sp', { state: searchState });
        return;
      }
      if (
        norm.includes('turismo') ||
        norm.includes('passeio') ||
        norm.includes('atra') ||
        norm.includes('basilic') ||
        norm.includes('santuario') ||
        norm.includes('museu') ||
        norm.includes('mirante') ||
        norm.includes('ponto tur') ||
        norm.includes('pontos tur')
      ) {
        navigate('/pontos-turisticos-em-aparecida-sp', { state: searchState });
        return;
      }
      if (
        norm.includes('evento') ||
        norm.includes('missa') ||
        norm.includes('procissa') ||
        norm.includes('novena') ||
        norm.includes('festa') ||
        norm.includes('celebra') ||
        norm.includes('caravana') ||
        norm.includes('retiro')
      ) {
        navigate('/eventos', { state: searchState });
        return;
      }
    }

    // 3) Sem match ou sem texto: levar às categorias na home (evita rota inexistente /produtos)
    navigate({ pathname: '/', hash: 'categorias' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isDropdownOpen]);

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/aparecida.jpg"
          alt="Aparecida do Norte"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Descubra Aparecida
            </span>
            <motion.span
              className="block text-white mt-2 text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Terra da Fé
            </motion.span>
          </motion.h1>

          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto mb-6 sm:mb-8 border border-white/20 relative z-20"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <div className="flex-1 md:flex-initial md:w-[340px]">
                <input
                  type="text"
                  placeholder="O que você está procurando?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-0 bg-white/90 text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-75 text-sm sm:text-base"
                />
              </div>
              <div className="flex-1 md:flex-initial md:w-[340px] relative dropdown-container">
                <div
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-0 bg-white/90 text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-75 text-sm sm:text-base cursor-pointer flex justify-between items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="truncate">{selectedCategory || 'Categoria'}</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ml-2" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg sm:rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto py-1">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="px-3 sm:px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm sm:text-base"
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <motion.button
                onClick={handleSearch}
                className="bg-white/90 text-blue-800 hover:bg-white hover:text-blue-900 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-75 text-sm sm:text-base shadow-md hover:shadow-lg whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.075 }}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Buscar</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center relative z-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <motion.div
              className="flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 transition-all duration-75 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.075 }}
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="font-medium text-white text-sm sm:text-base md:text-lg">Centro Histórico</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 transition-all duration-75 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.075 }}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="font-medium text-white text-sm sm:text-base md:text-lg">Eventos Principais</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 transition-all duration-75 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.075 }}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="font-medium text-white text-sm sm:text-base md:text-lg">Grupos e Caravanas</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 hidden sm:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <svg
          viewBox={`0 0 1440 ${WAVE_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: `${WAVE_HEIGHT}px` }}
        >
          <path
            fill="#ffffff"
            d={`M0,${WAVE_HEIGHT} L0,${WAVE_BASE} C320,${WAVE_BASE} 460,${WAVE_PEAK} 720,${WAVE_PEAK} C980,${WAVE_PEAK} 1120,${WAVE_BASE} 1440,${WAVE_BASE} L1440,${WAVE_HEIGHT} Z`}
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
