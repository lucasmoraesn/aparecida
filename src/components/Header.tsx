import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Phone, X, ArrowLeft } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're not on the home page
  const isNotHomePage = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/hoteis', label: 'Hotéis' },
    { to: '/restaurantes', label: 'Restaurantes' },
    { to: '/lojas-religiosas', label: 'Lojas' },
    { to: '/pontos-turisticos', label: 'Pontos Turísticos' },
    { to: '/eventos', label: 'Eventos' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex flex-col">
            <Link
              to="/"
              className={`text-2xl font-bold transition-all duration-300 hover:scale-105 ${isScrolled ? 'text-gray-800' : 'text-white drop-shadow-lg'
                }`}
            >
              Explore Aparecida
            </Link>
            <span className={`text-sm hidden sm:block transition-colors duration-300 ${isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
              Tudo o que você precisa saber antes de visitar a Casa da Mãe
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative font-medium transition-all duration-300 group ${isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Contact & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {isNotHomePage && (
              <Link
                to="/"
                className={`hidden lg:flex items-center gap-2 transition-colors duration-300 hover:scale-105 ${isScrolled ? 'text-gray-600 hover:text-gray-800' : 'text-white/80 hover:text-white'
                  }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar</span>
              </Link>
            )}

            <div className={`hidden lg:flex items-center text-sm transition-colors duration-300 ${isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
              <Phone className="w-4 h-4 mr-1" />
              (12) 3104-1000
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-300 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 p-4 shadow-xl">
            <nav className="flex flex-col space-y-4">
              {isNotHomePage && (
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Link>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center text-sm text-gray-600 pt-2 border-t border-gray-200">
                <Phone className="w-4 h-4 mr-1" />
                (12) 3104-1000
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;