import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getCategoryByPath } from '../data/categories';

const CategoryLanding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = getCategoryByPath(location.pathname);

  useEffect(() => {
    if (!category) {
      navigate('/');
      return;
    }

    // Set page title and meta description for SEO
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';
    
    document.title = `${category.name} | Explore Aparecida`;
    meta?.setAttribute('content', category.description);

    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, [category, navigate]);

  if (!category) {
    return null;
  }

  const handleOptionClick = (optionName: string) => {
    // Navigate to the full listing page
    // This preserves the main routes with SEO-friendly URLs
    const categoryRoutes: Record<string, string> = {
      'hoteis': '/hoteis-em-aparecida-sp',
      'restaurantes': '/restaurantes-em-aparecida-sp',
      'lojas': '/lojas-religiosas-em-aparecida-sp',
      'pontos-turisticos': '/pontos-turisticos-em-aparecida-sp'
    };

    const categoryId = getCategoryByPath(location.pathname)?.id || '';
    const pathname = categoryRoutes[categoryId] || '/';
    navigate(pathname, { 
      state: { selectedFilter: optionName !== 'Tudo' ? optionName : null }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option.name)}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300" />

              {/* Content */}
              <div className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {option.name}
                  </h2>
                  {option.description && (
                    <p className="text-gray-600 text-base mb-4">
                      {option.description}
                    </p>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="font-semibold">Ver opção</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* SEO Content Section */}
        <section className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {category.name} em Aparecida do Norte
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Aparecida do Norte (SP) é um destino de turismo religioso muito importante no Brasil e recebe
            milhões de visitantes. Aqui você encontrará as melhores opções de {category.name.toLowerCase()} da região,
            tudo próximo à Basílica Nacional e com facilidades para romeiros, famílias e grupos de excursão.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CategoryLanding;
