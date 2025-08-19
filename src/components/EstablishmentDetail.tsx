import React from 'react';
import { ArrowLeft, MapPin, Phone, Star, MessageCircle, Clock, Users, Globe } from 'lucide-react';
import { useEstablishment } from '../hooks/useEstablishments';
import { EstablishmentType } from '../lib/supabase';

interface EstablishmentDetailProps {
  type: EstablishmentType;
  id: number;
  onBack: () => void;
}

const EstablishmentDetail: React.FC<EstablishmentDetailProps> = ({ type, id, onBack }) => {
  const { establishment, loading, error } = useEstablishment(type, id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (error || !establishment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar estabelecimento</p>
          <button 
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (type: EstablishmentType) => {
    switch (type) {
      case 'hotels': return 'bg-blue-600';
      case 'restaurants': return 'bg-green-600';
      case 'shops': return 'bg-orange-600';
      case 'attractions': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryName = (type: EstablishmentType) => {
    switch (type) {
      case 'hotels': return 'Hospedagem';
      case 'restaurants': return 'Restaurante';
      case 'shops': return 'Loja';
      case 'attractions': return 'Atração';
      default: return 'Estabelecimento';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${establishment.image})` }}>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {establishment.featured && (
          <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm">
            ⭐ DESTAQUE DO MÊS
          </div>
        )}

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className={`${getCategoryColor(type)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {getCategoryName(type)}
          </span>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-semibold text-sm">{establishment.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{establishment.name}</h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{establishment.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Endereço</p>
                      <p className="text-gray-600">{establishment.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Telefone</p>
                      <p className="text-gray-600">{establishment.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Categoria</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-800">{establishment.category}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{establishment.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">de 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional features based on type */}
            {type === 'hotels' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Wi-Fi Gratuito</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Café da Manhã</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Estacionamento</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Ar Condicionado</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">TV a Cabo</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Recepção 24h</span>
                  </div>
                </div>
              </div>
            )}

            {type === 'restaurants' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações do Restaurante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Horário de Funcionamento</p>
                      <p className="text-gray-600">Seg-Dom: 11:00 - 22:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Capacidade</p>
                      <p className="text-gray-600">Até 80 pessoas</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Entre em Contato</h3>
              
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/55${establishment.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                
                <a 
                  href={`tel:${establishment.phone}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Ligar Agora
                </a>

                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ver no Mapa
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Compartilhar</h4>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDetail;