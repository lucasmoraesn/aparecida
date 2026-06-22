import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Utensils, Navigation, MessageCircle } from 'lucide-react';
import { generateCompleteSrcSet } from '../lib/imageUtils';
import EbookCTA from '../components/EbookCTA';

const restaurants = [
  {
    id: 1,
    name: "Augusto Restaurante e Petiscaria",
    description: "Augusto Restaurante e Petiscaria conta com 40 anos de tradição! Amplo cardápio para almoço, jantar e happy hour em um ambiente moderno e com atmosfera acolhedora. Ponto de encontro perfeito para sua família e amigos. Opção de serviço: Refeição no local - Para viagem - Delivery.",
    address: "Rua Barão do Rio Branco, 360 - Centro, Aparecida - SP",
    phone: "(12) 3311-3991",
    whatsapp: "551233113991",
    rating: 4.8,
    cuisine: "Restaurante",
    priceRange: "R$ 30-60",
    hours: "11:00 - 23:00",
    specialties: ["Petiscos", "Refeições", "Happy Hour"],
    image: "/images/augustorestaurante2.jpg"
  },
  {
    id: 2,
    name: "Lanchonete Barão",
    description: "Lanchonete Barão desde 2014 servindo produtos da melhor qualidade e sabor, com o diferenciado Hambúrguer Artesanal e uma maionese de sabor inigualável.",
    address: "Rua Barão do Rio Branco, 213 - Centro, Aparecida - SP",
    phone: "(12) 99120-2030",
    whatsapp: "5512991202030",
    rating: 4.6,
    cuisine: "Lanchonete",
    priceRange: "R$ 15-40",
    hours: "10:00 - 22:00",
    specialties: ["Hambúrguer Artesanal", "Açaí", "Sucos"],
    image: "/images/lanchonetebarao2.jpg"
  },
  {
    id: 3,
    name: "Restaurante Basílica",
    description: "Restaurante tradicional com pratos da culinária regional e vista para a Basílica Nacional.",
    address: "Rua das Flores, 123 - Centro, Aparecida - SP",
    phone: "(12) 3104-2001",
    whatsapp: "",
    rating: 4.5,
    cuisine: "Regional",
    priceRange: "R$ 25-50",
    hours: "11:00 - 22:00",
    specialties: ["Feijão tropeiro", "Frango ao molho", "Pão de queijo"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "Lanchonete do Romeiro",
    description: "Lanchonete popular com lanches rápidos e refeições caseiras para peregrinos.",
    address: "Av. Aparecida, 456 - Centro, Aparecida - SP",
    phone: "(12) 3104-2002",
    whatsapp: "",
    rating: 4.2,
    cuisine: "Fast Food",
    priceRange: "R$ 15-30",
    hours: "06:00 - 20:00",
    specialties: ["X-burger", "Pastel", "Café com pão"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    name: "Pizzaria Santuário",
    description: "Pizzaria com forno a lenha e ambiente familiar, ideal para grupos.",
    address: "Rua do Santuário, 789 - Centro, Aparecida - SP",
    phone: "(12) 3104-2003",
    whatsapp: "",
    rating: 4.7,
    cuisine: "Pizza",
    priceRange: "R$ 30-60",
    hours: "18:00 - 23:00",
    specialties: ["Pizza Margherita", "Pizza Quatro Queijos", "Calzone"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Restaurante da Fé",
    description: "Restaurante self-service com variedade de pratos e preços acessíveis.",
    address: "Rua dos Romeiros, 321 - Centro, Aparecida - SP",
    phone: "(12) 3104-2004",
    whatsapp: "",
    rating: 4.0,
    cuisine: "Self-Service",
    priceRange: "R$ 20-35",
    hours: "11:00 - 15:00 / 18:00 - 21:00",
    specialties: ["Prato feito", "Saladas", "Sobremesas"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
];


const Restaurants = () => {
  return (
    <div className="min-h-screen bg-gray-50 page-container">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center text-center mb-12 w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Restaurantes em Aparecida do Norte (SP)
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto text-center leading-relaxed px-4">
              Onde comer em Aparecida: restaurantes, lanchonetes e cafés próximos à Basílica,
              com opções para romeiros, famílias e grupos de excursão.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Banner CTA Ebook */}
        <EbookCTA className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  srcSet={generateCompleteSrcSet(restaurant.image)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{restaurant.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{restaurant.description}</p>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Utensils className="w-4 h-4" />
                  <span>{restaurant.cuisine}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.hours}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">{restaurant.priceRange}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Como chegar
                  </a>
                  {restaurant.whatsapp && (
                    <a
                      href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent('Olá, vim do site Aparecida do Norte Tour e gostaria de ver o cardápio...')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
