import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';

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
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase().trim();
      if (s.includes('hotel') || s.includes('pousada') || s.includes('hospedagem')) {
        navigate('/hoteis-em-aparecida-sp');
        return;
      }
      if (s.includes('restaurante') || s.includes('comida') || s.includes('almoço') || s.includes('jantar') || s.includes('pizzaria')) {
        navigate('/restaurantes');
        return;
      }
      if (s.includes('loja') || s.includes('religioso') || s.includes('souvenir') || s.includes('terço') || s.includes('vela')) {
        navigate('/lojas-religiosas');
        return;
      }
      if (s.includes('ponto') || s.includes('turístico') || s.includes('atração') || s.includes('basílica') || s.includes('museu') || s.includes('mirante')) {
        navigate('/pontos-turisticos');
        return;
      }
      if (s.includes('evento') || s.includes('missa') || s.includes('procissão') || s.includes('festa') || s.includes('celebração') || s.includes('caravana')) {
        navigate('/eventos');
        return;
      }
      navigate('/', { state: { searchTerm: searchTerm.trim() } });
      return;
    }

    if (!selectedCategory || selectedCategory === 'Todas as categorias') {
      navigate('/produtos', { state: { showAllCategories: true } });
    } else if (selectedCategory === 'Hotéis e Pousadas') {
      navigate('/hoteis-em-aparecida-sp');
    } else if (selectedCategory === 'Restaurantes') {
      navigate('/restaurantes');
    } else if (selectedCategory === 'Lojas Religiosas') {
      navigate('/lojas-religiosas');
    } else if (selectedCategory === 'Pontos Turísticos') {
      navigate('/pontos-turisticos');
    } else if (selectedCategory === 'Eventos') {
      navigate('/eventos');
    } else {
      navigate('/');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
                  onKeyPress={handleKeyPress}
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
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
