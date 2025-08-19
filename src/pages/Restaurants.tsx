import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Clock, Utensils } from 'lucide-react';

const restaurants = [
  {
    id: 1,
    name: "Restaurante Basílica",
    description: "Restaurante tradicional com pratos da culinária regional e vista para a Basílica Nacional.",
    address: "Rua das Flores, 123 - Centro",
    phone: "(12) 3104-2001",
    rating: 4.5,
    cuisine: "Regional",
    priceRange: "R$ 25-50",
    hours: "11:00 - 22:00",
    specialties: ["Feijão tropeiro", "Frango ao molho", "Pão de queijo"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Lanchonete do Romeiro",
    description: "Lanchonete popular com lanches rápidos e refeições caseiras para peregrinos.",
    address: "Av. Aparecida, 456 - Centro",
    phone: "(12) 3104-2002",
    rating: 4.2,
    cuisine: "Fast Food",
    priceRange: "R$ 15-30",
    hours: "06:00 - 20:00",
    specialties: ["X-burger", "Pastel", "Café com pão"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Pizzaria Santuário",
    description: "Pizzaria com forno a lenha e ambiente familiar, ideal para grupos.",
    address: "Rua do Santuário, 789 - Centro",
    phone: "(12) 3104-2003",
    rating: 4.7,
    cuisine: "Pizza",
    priceRange: "R$ 30-60",
    hours: "18:00 - 23:00",
    specialties: ["Pizza Margherita", "Pizza Quatro Queijos", "Calzone"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "Restaurante da Fé",
    description: "Restaurante self-service com variedade de pratos e preços acessíveis.",
    address: "Rua dos Romeiros, 321 - Centro",
    phone: "(12) 3104-2004",
    rating: 4.0,
    cuisine: "Self-Service",
    priceRange: "R$ 20-35",
    hours: "11:00 - 15:00 / 18:00 - 21:00",
    specialties: ["Prato feito", "Saladas", "Sobremesas"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    name: "Café Mariana",
    description: "Café especializado com doces caseiros e ambiente aconchegante.",
    address: "Av. Basílica, 654 - Centro",
    phone: "(12) 3104-2005",
    rating: 4.8,
    cuisine: "Café",
    priceRange: "R$ 10-25",
    hours: "07:00 - 19:00",
    specialties: ["Café expresso", "Bolo de fubá", "Pão de queijo"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Churrascaria São José",
    description: "Churrascaria tradicional com carnes nobres e buffet completo.",
    address: "Rua da Fé, 987 - Centro",
    phone: "(12) 3104-2006",
    rating: 4.3,
    cuisine: "Churrasco",
    priceRange: "R$ 50-80",
    hours: "11:30 - 15:00 / 19:00 - 23:00",
    specialties: ["Picanha", "Costela", "Linguiça"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 7,
    name: "Sorveteria Nossa Senhora",
    description: "Sorveteria artesanal com sabores tradicionais e especiais da região.",
    address: "Av. Mariana, 147 - Centro",
    phone: "(12) 3104-2007",
    rating: 4.6,
    cuisine: "Sorvetes",
    priceRange: "R$ 8-20",
    hours: "10:00 - 22:00",
    specialties: ["Sorvete de creme", "Açaí", "Milkshake"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 8,
    name: "Restaurante Familiar",
    description: "Restaurante com pratos caseiros e ambiente acolhedor para toda família.",
    address: "Rua São José, 258 - Centro",
    phone: "(12) 3104-2008",
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Restaurantes e Lanchonetes
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubra os melhores sabores da culinária local em Aparecida do Norte
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
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Ver Menu
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

export default Restaurants;
