import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowLeft, ChevronDown } from 'lucide-react';
import { O_QUE_FAZER_NAV_ITEMS } from '../data/oQueFazerGuia';

const mainNavItems = [
  { to: '/hoteis-em-aparecida-sp', label: 'HOTÉIS' },
  { to: '/restaurantes-em-aparecida-sp', label: 'RESTAURANTES' },
  { to: '/lojas-religiosas-em-aparecida-sp', label: 'LOJAS' },
  { to: '/pontos-turisticos-em-aparecida-sp', label: 'PONTOS TURÍSTICOS' },
  { to: '/motoristas-particulares', label: 'MOTORISTAS' },
];

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOQueFazerOpen, setMobileOQueFazerOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isHomePage]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileOQueFazerOpen(false);
  }, [location.pathname]);

  const getHeaderStyle = () => {
    if (isHomePage) {
      return isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent';
    }
    return 'bg-white shadow-md';
  };

  const getTextStyle = () => {
    if (isHomePage) {
      return isScrolled ? 'text-gray-800' : 'text-white drop-shadow-lg';
    }
    return 'text-gray-800';
  };

  const getSubtitleStyle = () => {
    if (isHomePage) {
      return isScrolled ? 'text-gray-600' : 'text-white/80';
    }
    return 'text-gray-600';
  };

  const getNavLinkStyle = () => {
    if (isHomePage) {
      return isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white';
    }
    return 'text-gray-700 hover:text-gray-900';
  };

  const getBackButtonStyle = () => {
    if (isHomePage) {
      return isScrolled ? 'text-gray-600 hover:text-gray-800' : 'text-white/80 hover:text-white';
    }
    return 'text-gray-600 hover:text-gray-800';
  };

  const getMobileMenuButtonStyle = () => {
    if (isHomePage) {
      return isScrolled ? 'text-gray-700' : 'text-white';
    }
    return 'text-gray-700';
  };

  const dropdownLinkClass =
    'block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderStyle()}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <img
              src="/logo-sem-fundo.png"
              alt="Logo Explore Aparecida"
              className="h-10 sm:h-12 w-auto"
            />
            <div className="flex flex-col">
              <Link
                to="/"
                className={`text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105 ${getTextStyle()}`}
              >
                Explore Aparecida
              </Link>
              {isHomePage && (
                <span
                  className={`hidden md:block text-xs lg:text-sm leading-snug max-w-[13rem] xl:max-w-[15rem] transition-colors duration-300 ${getSubtitleStyle()}`}
                >
                  <span className="block">APARECIDA DO NORTE</span>
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
            {mainNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative font-medium transition-all duration-300 group whitespace-nowrap ${getNavLinkStyle()}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-yellow-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* O QUE FAZER — dropdown ao passar o mouse */}
            <div className="relative group focus-within:z-[60]">
              <button
                type="button"
                className={`relative flex items-center gap-1 font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${getNavLinkStyle()}`}
                aria-expanded="false"
                aria-haspopup="true"
                aria-label="Abrir menu O que fazer"
              >
                O QUE FAZER
                <ChevronDown className="w-4 h-4 shrink-0 opacity-90 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-yellow-500 transition-all duration-300 group-hover:w-full group-focus-within:w-full" />
              </button>

              <div
                className="absolute right-0 top-full pt-1.5 opacity-0 invisible translate-y-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto z-[70]"
                role="menu"
                aria-label="O que fazer em Aparecida"
              >
                <div className="min-w-[17.5rem] max-w-[20rem] max-h-[min(70vh,26rem)] overflow-y-auto rounded-xl border border-gray-200/80 bg-white py-2 shadow-xl ring-1 ring-black/5">
                  {O_QUE_FAZER_NAV_ITEMS.map((sub) => (
                    <Link
                      key={sub.label + sub.to}
                      to={sub.to}
                      role="menuitem"
                      className={dropdownLinkClass}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isHomePage && (
              <Link
                to="/"
                className={`hidden lg:flex items-center gap-2 transition-colors duration-300 hover:scale-105 ${getBackButtonStyle()}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar</span>
              </Link>
            )}

            <button
              className="lg:hidden p-2 rounded-lg transition-colors duration-300 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${getMobileMenuButtonStyle()}`} />
              ) : (
                <Menu className={`w-5 h-5 sm:w-6 sm:h-6 ${getMobileMenuButtonStyle()}`} />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 mb-2 p-4 shadow-xl animate-fade-in">
            <nav className="flex flex-col space-y-1">
              {!isHomePage && (
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Link>
              )}
              {mainNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 py-2 border-l-2 border-transparent hover:border-blue-600 pl-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-2 mt-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-gray-800 font-semibold py-2 pl-3 pr-1 text-left"
                  onClick={() => setMobileOQueFazerOpen((o) => !o)}
                  aria-expanded={mobileOQueFazerOpen}
                >
                  O QUE FAZER
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${mobileOQueFazerOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileOQueFazerOpen && (
                  <div className="pl-2 pb-2 flex flex-col border-l-2 border-blue-100 ml-3 mt-1 space-y-0.5">
                    {O_QUE_FAZER_NAV_ITEMS.map((sub) => (
                      <Link
                        key={sub.label + sub.to}
                        to={sub.to}
                        className="text-sm text-gray-600 hover:text-blue-600 py-2 pl-3 rounded-r-md hover:bg-blue-50/80"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setMobileOQueFazerOpen(false);
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
