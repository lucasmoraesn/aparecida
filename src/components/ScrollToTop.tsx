import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Componente global para scroll automático ao topo
 * 
 * Detecta mudanças de rota via useLocation e executa window.scrollTo(0, 0)
 * Não renderiza nada (retorna null) - apenas efeito colateral
 * 
 * Deve ser colocado dentro do <BrowserRouter> mas fora do <Routes>
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
