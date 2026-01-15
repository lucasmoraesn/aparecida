import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Wifi, Car, Coffee } from 'lucide-react';
import BookingSearch from '../components/BookingSearch';

const hotels = [
  {
    id: 1,
    name: "Hotel Aparecida Palace",
    description: "Hotel 4 estrelas localizado próximo à Basílica Nacional, com vista panorâmica e conforto premium.",
    address: "Rua das Flores, 123 - Centro",
    phone: "(12) 3104-1001",
    rating: 4.5,
    price: "R$ 280",
    amenities: ["Wi-Fi", "Estacionamento", "Café da manhã", "Ar condicionado"],
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Pousada Nossa Senhora",
    description: "Pousada familiar com ambiente acolhedor e proximidade aos principais pontos turísticos.",
    address: "Av. Aparecida, 456 - Centro",
    phone: "(12) 3104-1002",
    rating: 4.2,
    price: "R$ 180",
    amenities: ["Wi-Fi", "Café da manhã", "Quartos familiares"],
    image: "https://images.pexels.com/photos/261106/pexels-photo-261106.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Hotel Santuário",
    description: "Hotel moderno com excelente localização e serviços de qualidade para peregrinos.",
    address: "Rua do Santuário, 789 - Centro",
    phone: "(12) 3104-1003",
    rating: 4.7,
    price: "R$ 320",
    amenities: ["Wi-Fi", "Estacionamento", "Restaurante", "Spa"],
    image: "https://images.pexels.com/photos/261105/pexels-photo-261105.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "Pousada do Romeiro",
    description: "Pousada tradicional com ambiente religioso e preços acessíveis para grupos.",
    address: "Rua dos Romeiros, 321 - Centro",
    phone: "(12) 3104-1004",
    rating: 4.0,
    price: "R$ 150",
    amenities: ["Wi-Fi", "Café da manhã", "Capela"],
    image: "https://images.pexels.com/photos/261104/pexels-photo-261104.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    name: "Hotel Basílica",
    description: "Hotel de luxo com vista direta para a Basílica Nacional e serviços premium.",
    address: "Av. Basílica, 654 - Centro",
    phone: "(12) 3104-1005",
    rating: 4.8,
    price: "R$ 450",
    amenities: ["Wi-Fi", "Estacionamento", "Piscina", "Restaurante gourmet"],
    image: "https://images.pexels.com/photos/261103/pexels-photo-261103.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Pousada da Fé",
    description: "Pousada simples e acolhedora, ideal para peregrinos em busca de tranquilidade.",
    address: "Rua da Fé, 987 - Centro",
    phone: "(12) 3104-1006",
    rating: 3.8,
    price: "R$ 120",
    amenities: ["Wi-Fi", "Café da manhã", "Jardim"],
    image: "https://images.pexels.com/photos/261107/pexels-photo-261107.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 7,
    name: "Hotel Mariana",
    description: "Hotel executivo com salas de reunião e conforto para viagens de negócios.",
    address: "Av. Mariana, 147 - Centro",
    phone: "(12) 3104-1007",
    rating: 4.3,
    price: "R$ 350",
    amenities: ["Wi-Fi", "Estacionamento", "Sala de reunião", "Business center"],
    image: "https://images.pexels.com/photos/261108/pexels-photo-261108.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 8,
    name: "Pousada São José",
    description: "Pousada familiar com quartos espaçosos e ambiente tranquilo para descanso.",
    address: "Rua São José, 258 - Centro",
    phone: "(12) 3104-1008",
    rating: 4.1,
    price: "R$ 200",
    amenities: ["Wi-Fi", "Estacionamento", "Café da manhã", "Área de lazer"],
    image: "https://images.pexels.com/photos/261109/pexels-photo-261109.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

const Hotels = () => {
  // Função para obter ícones 3D para as amenidades
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    
    if (amenityLower.includes('wi-fi') || amenityLower.includes('wifi')) {
      return { type: 'image', src: '/images/icon8-wifi.png' };
    } else if (amenityLower.includes('café') || amenityLower.includes('cafe')) {
      return { type: 'image', src: '/images/icons8-café-da-manhã-80.png' };
    } else if (amenityLower.includes('capela') || amenityLower.includes('igreja')) {
      return { type: 'emoji', content: '⛪' };
    } else if (amenityLower.includes('estacionamento')) {
      return { type: 'image', src: '/images/icons8-estacionamento-64.png' };
    } else if (amenityLower.includes('ar condicionado')) {
      return { type: 'image', src: '/images/icons8-ar-condicionado-64.png' };
    } else if (amenityLower.includes('piscina')) {
      return { type: 'emoji', content: '🏊' };
    } else if (amenityLower.includes('restaurante')) {
      return { type: 'image', src: '/images/icons8-talheres-64.png' };
    } else if (amenityLower.includes('spa')) {
      return { type: 'emoji', content: '💆' };
    } else if (amenityLower.includes('jardim')) {
      return { type: 'emoji', content: '🌳' };
    } else if (amenityLower.includes('sala de reunião') || amenityLower.includes('business')) {
      return { type: 'image', src: '/images/icons8-sala-de-reuniões-50.png' };
    } else if (amenityLower.includes('área de lazer')) {
      return { type: 'emoji', content: '🎯' };
    } else if (amenityLower.includes('quartos familiares')) {
      return { type: 'image', src: '/images/icons8-família-50.png' };
    } else {
      return { type: 'emoji', content: '✨' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Hotéis e pousadas em Aparecida do Norte (SP)
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Encontre hospedagem em Aparecida do Norte perto da Basílica, com opções de hotéis,
              pousadas e acomodações para romeiros, famílias e grupos.
            </p>
          </div>
          
          <BookingSearch />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{hotel.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.address}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Phone className="w-4 h-4" />
                  <span>{hotel.phone}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity, index) => {
                    const icon = getAmenityIcon(amenity);
                    return (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        {icon.type === 'image' ? (
                          <img 
                            src={icon.src} 
                            alt="icon" 
                            className="w-5 h-5 object-contain"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                          />
                        ) : (
                          <span className="text-xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                            {icon.content}
                          </span>
                        )}
                        {amenity}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-800">{hotel.price}</span>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Reservar
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

export default Hotels;
