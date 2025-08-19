import React from 'react';
import { MapPin, Phone, Star, ExternalLink, MessageCircle } from 'lucide-react';
import { useEstablishments } from '../hooks/useEstablishments';
import { EstablishmentType } from '../lib/supabase';

interface Establishment {
  id: number;
  name: string;
  category: string;
  rating: number;
  address: string;
  phone: string;
  whatsapp: string;
  image: string;
  description: string;
  featured: boolean;
}

interface CategorySectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  establishmentType: EstablishmentType;
  color: string;
  onEstablishmentClick: (type: EstablishmentType, id: number) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  id,
  title,
  icon,
  establishmentType,
  color,
  onEstablishmentClick
}) => {
  const { establishments, loading, error } = useEstablishments(establishmentType);

  if (loading) {
    return (
      <section id={id} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando {title.toLowerCase()}...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id={id} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar {title.toLowerCase()}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 ${color} text-white px-6 py-3 rounded-full mb-4`}>
            {icon}
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça os melhores estabelecimentos selecionados especialmente para sua visita
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {establishments.map((place) => (
            <div
              key={place.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer ${place.featured ? 'ring-2 ring-yellow-400' : ''
                }`}
              onClick={() => onEstablishmentClick(establishmentType, place.id)}
            >
              {place.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-center py-2 font-semibold text-sm">
                  ⭐ DESTAQUE DO MÊS
                </div>
              )}

              <div className="relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-sm">{place.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>

                <div className="flex items-start gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mt-1 text-blue-600" />
                  <span className="text-sm">{place.address}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{place.phone}</span>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/55${place.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEstablishmentClick(establishmentType, place.id);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver Mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className={`${color} hover:opacity-90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105`}>
            Ver Todos os {title}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;