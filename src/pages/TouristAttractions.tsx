import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Camera, Info } from 'lucide-react';

const touristAttractions = [
  {
    id: 1,
    name: "Basílica Nacional de Nossa Senhora Aparecida",
    description: "O maior santuário mariano do mundo, com capacidade para 45 mil pessoas. Local sagrado onde está exposta a imagem original de Nossa Senhora Aparecida.",
    address: "Praça Nossa Senhora Aparecida, s/n - Centro",
    phone: "(12) 3104-1000",
    rating: 5.0,
    hours: "07:00 - 17:30",
    entrance: "Gratuito",
    highlights: ["Imagem original", "Arquitetura moderna", "Capela das Velas"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Museu Nossa Senhora Aparecida",
    description: "Museu que conta a história da aparição da imagem de Nossa Senhora e a evolução da devoção ao longo dos séculos.",
    address: "Praça Nossa Senhora Aparecida, s/n - Centro",
    phone: "(12) 3104-1001",
    rating: 4.7,
    hours: "09:00 - 17:00",
    entrance: "R$ 10",
    highlights: ["História da aparição", "Exposições temporárias", "Arte sacra"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Mirante do Morro do Cruzeiro",
    description: "Mirante com vista panorâmica de toda a cidade de Aparecida e da Basílica Nacional. Local ideal para fotos e contemplação.",
    address: "Morro do Cruzeiro - Centro",
    phone: "(12) 3104-1002",
    rating: 4.5,
    hours: "08:00 - 18:00",
    entrance: "Gratuito",
    highlights: ["Vista panorâmica", "Fotografias", "Contemplação"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "Centro de Apoio ao Romeiro",
    description: "Centro de apoio que oferece informações, banheiros, restaurantes e lojas para os peregrinos que visitam a cidade.",
    address: "Av. Dr. Júlio Prestes, s/n - Centro",
    phone: "(12) 3104-1003",
    rating: 4.3,
    hours: "06:00 - 22:00",
    entrance: "Gratuito",
    highlights: ["Informações turísticas", "Restaurantes", "Lojas"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    name: "Passarela da Fé",
    description: "Passarela que liga a Basílica Velha à Basílica Nova, oferecendo uma caminhada espiritual com vista para a cidade.",
    address: "Entre Basílica Velha e Nova - Centro",
    phone: "(12) 3104-1004",
    rating: 4.6,
    hours: "24 horas",
    entrance: "Gratuito",
    highlights: ["Caminhada espiritual", "Vista da cidade", "Conecta as basílicas"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Basílica Velha (Igreja Matriz)",
    description: "Primeira igreja construída em homenagem a Nossa Senhora Aparecida, com arquitetura colonial e história centenária.",
    address: "Praça Nossa Senhora Aparecida, s/n - Centro",
    phone: "(12) 3104-1005",
    rating: 4.8,
    hours: "08:00 - 17:00",
    entrance: "Gratuito",
    highlights: ["Arquitetura colonial", "História centenária", "Primeira igreja"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 7,
    name: "Porto Itaguaçu",
    description: "Local onde a imagem de Nossa Senhora Aparecida foi encontrada pelos pescadores em 1717. Local histórico e sagrado.",
    address: "Porto Itaguaçu - Zona Rural",
    phone: "(12) 3104-1006",
    rating: 4.4,
    hours: "08:00 - 17:00",
    entrance: "Gratuito",
    highlights: ["Local da aparição", "História", "Rio Paraíba"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 8,
    name: "Santuário Nacional",
    description: "Complexo religioso que inclui a Basílica Nacional, museus, lojas e áreas de lazer para os peregrinos.",
    address: "Praça Nossa Senhora Aparecida, s/n - Centro",
    phone: "(12) 3104-1007",
    rating: 4.9,
    hours: "07:00 - 18:00",
    entrance: "Gratuito",
    highlights: ["Complexo completo", "Múltiplas atrações", "Área de lazer"],
    image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

const TouristAttractions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Pontos turísticos em Aparecida do Norte (SP)
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubra o que fazer em Aparecida: santuários, mirantes, passarelas da fé e locais
              históricos que fazem da cidade o principal destino de turismo religioso do Brasil.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {touristAttractions.map((attraction) => (
            <div key={attraction.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{attraction.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{attraction.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{attraction.description}</p>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{attraction.address}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{attraction.hours}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Info className="w-4 h-4" />
                  <span>Entrada: {attraction.entrance}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {attraction.highlights.slice(0, 3).map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visita Recomendada</span>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Saiba Mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristAttractions;
