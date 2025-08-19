import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Calendar, Users, Play, Star, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todas as categorias');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

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
    }
  ];

  const currentCategory = categories.find(cat => cat.name === selectedCategory);

  // Handle search button click
  const handleSearch = () => {
    if (selectedCategory === 'Hotéis e Pousadas') {
      navigate('/hoteis');
    } else if (selectedCategory === 'Restaurantes') {
      navigate('/restaurantes');
    } else if (selectedCategory === 'Lojas Religiosas') {
      navigate('/lojas-religiosas');
    } else if (selectedCategory === 'Pontos Turísticos') {
      navigate('/pontos-turisticos');
    } else {
      // For "Todas as categorias" or specific search terms, navigate to home
      navigate('/');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        >
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-full h-full text-yellow-400" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 opacity-15"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-full h-full text-blue-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 opacity-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-full h-full text-yellow-300" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Descubra Aparecida
            </span>
            <motion.span
              className="block text-white mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Terra da Fé
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-200 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Encontre os melhores hotéis, restaurantes, lojas e pontos turísticos
            para sua peregrinação à Basílica de Nossa Senhora Aparecida
          </motion.p>

          {/* Search Box */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-5xl mx-auto mb-12 border border-white/20 relative z-20"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="O que você está procurando?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 rounded-xl border-0 bg-white/90 text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300 text-lg"
                />
              </div>
              <div className="flex-1 relative dropdown-container z-50">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-6 py-4 rounded-xl border-0 bg-white/90 text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300 text-lg flex items-center justify-between"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-80 overflow-y-auto"
                  >
                    {categories.map((category) => (
                      <div key={category.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors duration-200 ${selectedCategory === category.name ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-800'
                            }`}
                        >
                          {category.name}
                        </button>

                        {/* Sub-options for selected category */}
                        {selectedCategory === category.name && category.options.length > 0 && (
                          <div className="border-t border-gray-100">
                            {category.options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSearchTerm(option);
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full px-6 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200 pl-12"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
              <motion.button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
                Buscar
              </motion.button>
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <motion.div
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Centro Histórico</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Calendar className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Eventos do Mês</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Grupos & Caravanas</span>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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