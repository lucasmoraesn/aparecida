import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Utensils, Navigation, MessageCircle } from 'lucide-react';
import { generateCompleteSrcSet } from '../lib/imageUtils';

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
  {
    id: 7,
    name: "Café Mariana",
    description: "Café especializado com doces caseiros e ambiente aconchegante.",
    address: "Av. Basílica, 654 - Centro, Aparecida - SP",
    phone: "(12) 3104-2005",
    whatsapp: "",
    rating: 4.8,
    cuisine: "Café",
    priceRange: "R$ 10-25",
    hours: "07:00 - 19:00",
    specialties: ["Café expresso", "Bolo de fubá", "Pão de queijo"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 8,
    name: "Churrascaria São José",
    description: "Churrascaria tradicional com carnes nobres e buffet completo.",
    address: "Rua da Fé, 987 - Centro, Aparecida - SP",
    phone: "(12) 3104-2006",
    whatsapp: "",
    rating: 4.3,
    cuisine: "Churrasco",
    priceRange: "R$ 50-80",
    hours: "11:30 - 15:00 / 19:00 - 23:00",
    specialties: ["Picanha", "Costela", "Linguiça"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 9,
    name: "Sorveteria Nossa Senhora",
    description: "Sorveteria artesanal com sabores tradicionais e especiais da região.",
    address: "Av. Mariana, 147 - Centro, Aparecida - SP",
    phone: "(12) 3104-2007",
    whatsapp: "",
    rating: 4.6,
    cuisine: "Sorvetes",
    priceRange: "R$ 8-20",
    hours: "10:00 - 22:00",
    specialties: ["Sorvete de creme", "Açaí", "Milkshake"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 10,
    name: "Restaurante Familiar",
    description: "Restaurante com pratos caseiros e ambiente acolhedor para toda família.",
    address: "Rua São José, 258 - Centro, Aparecida - SP",
    phone: "(12) 3104-2008",
    whatsapp: "",
    rating: 4.1,
    cuisine: "Caseira",
    priceRange: "R$ 25-45",
    hours: "11:00 - 21:00",
    specialties: ["Frango caipira", "Arroz carreteiro", "Doce de leite"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

const Restaurants = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center text-center mb-12 w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Restaurantes em Aparecida do Norte (SP)
            </h1>
            <h1 className="mt-12 text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                    Restaurantes em Aparecida SP
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto text-center leading-relaxed px-4">
              Onde comer em Aparecida: restaurantes, lanchonetes e cafés próximos à Basílica,
              com opções para romeiros, famílias e grupos de excursão.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                      href={`https://wa.me/${restaurant.whatsapp}`}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section aria-labelledby="restaurants-partners" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 id="restaurants-partners" className="text-2xl font-bold text-gray-900">Anuncie aqui o seu Restaurante</h2>
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm">
              Restaurante Parceiro Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Alcance público turístico qualificado com interesse em gastronomia local. Seu restaurante pode ganhar destaque no portal, com contato direto pelo WhatsApp e acesso a visitantes em busca das melhores opções de comida em Aparecida.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                  <li>Alcance turístico e público religioso qualificado</li>
                  <li>Possibilidade de destaque com selo "Restaurante Parceiro Oficial"</li>
                  <li>Integração simples e atendimento direto ao cliente</li>
                </ul>
                <Link
                  to="/cadastrar-negocio"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Quero anunciar meu restaurante
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Restaurants;
