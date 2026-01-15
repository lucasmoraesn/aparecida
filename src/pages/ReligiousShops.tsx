import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Clock, ShoppingBag } from 'lucide-react';

const religiousShops = [
   {
      id: 1,
      name: "Casa de Artigos Religiosos Nossa Senhora",
      description: "Loja tradicional com ampla variedade de artigos religiosos, velas e imagens sacras.",
      address: "Rua das Flores, 123 - Centro",
      phone: "(12) 3104-3001",
      rating: 4.5,
      specialties: ["Imagens sacras", "Velas", "Terços", "Bíblias"],
      hours: "08:00 - 18:00",
      priceRange: "R$ 5-200",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 2,
      name: "Santuário das Velas",
      description: "Especializada em velas de todos os tamanhos e cores para devoções religiosas.",
      address: "Av. Aparecida, 456 - Centro",
      phone: "(12) 3104-3002",
      rating: 4.2,
      specialties: ["Velas coloridas", "Velas aromáticas", "Velas de 7 dias"],
      hours: "07:00 - 19:00",
      priceRange: "R$ 2-50",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 3,
      name: "Loja dos Terços",
      description: "Loja especializada em terços artesanais e rosários de diversos materiais.",
      address: "Rua do Santuário, 789 - Centro",
      phone: "(12) 3104-3003",
      rating: 4.7,
      specialties: ["Terços artesanais", "Rosários", "Pulseiras religiosas"],
      hours: "09:00 - 17:00",
      priceRange: "R$ 10-150",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 4,
      name: "Casa das Imagens",
      description: "Loja com grande variedade de imagens sacras de diferentes tamanhos e materiais.",
      address: "Rua dos Romeiros, 321 - Centro",
      phone: "(12) 3104-3004",
      rating: 4.0,
      specialties: ["Imagens de Nossa Senhora", "Santos", "Crucifixos"],
      hours: "08:30 - 18:30",
      priceRange: "R$ 20-500",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 5,
      name: "Livraria Religiosa Aparecida",
      description: "Livraria especializada em livros religiosos, Bíblias e literatura católica.",
      address: "Av. Basílica, 654 - Centro",
      phone: "(12) 3104-3005",
      rating: 4.8,
      specialties: ["Bíblias", "Livros religiosos", "Revistas católicas"],
      hours: "09:00 - 18:00",
      priceRange: "R$ 15-300",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 6,
      name: "Loja de Presentes Religiosos",
      description: "Loja com presentes e lembranças religiosas para peregrinos e devotos.",
      address: "Rua da Fé, 987 - Centro",
      phone: "(12) 3104-3006",
      rating: 4.3,
      specialties: ["Lembranças", "Presentes", "Souvenirs religiosos"],
      hours: "08:00 - 20:00",
      priceRange: "R$ 5-100",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 7,
      name: "Casa das Medalhas",
      description: "Especializada em medalhas religiosas, pingentes e joias sacras.",
      address: "Av. Mariana, 147 - Centro",
      phone: "(12) 3104-3007",
      rating: 4.6,
      specialties: ["Medalhas", "Pingentes", "Joias sacras"],
      hours: "09:00 - 17:30",
      priceRange: "R$ 15-200",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 8,
      name: "Loja dos Devotos",
      description: "Loja completa com todos os tipos de artigos religiosos para devoção.",
      address: "Rua São José, 258 - Centro",
      phone: "(12) 3104-3008",
      rating: 4.1,
      specialties: ["Artigos diversos", "Produtos religiosos", "Acessórios"],
      hours: "08:00 - 19:00",
      priceRange: "R$ 3-300",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   }
];

const ReligiousShops = () => {
   return (
      <div className="min-h-screen bg-gray-50">
         <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                     Lojas religiosas em Aparecida do Norte (SP)
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                     Encontre artigos religiosos, lembranças da Basílica e souvenirs típicos de Aparecida
                     para levar a fé e a memória da sua peregrinação para casa.
                  </p>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {religiousShops.map((shop) => (
                  <div key={shop.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                     <div className="h-48 overflow-hidden">
                        <img
                           src={shop.image}
                           alt={shop.name}
                           className="w-full h-full object-cover"
                        />
                     </div>

                     <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-xl font-bold text-gray-800">{shop.name}</h3>
                           <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{shop.rating}</span>
                           </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{shop.description}</p>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                           <MapPin className="w-4 h-4" />
                           <span>{shop.address}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                           <Phone className="w-4 h-4" />
                           <span>{shop.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                           <Clock className="w-4 h-4" />
                           <span>{shop.hours}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                           {shop.specialties.slice(0, 3).map((specialty, index) => (
                              <span
                                 key={index}
                                 className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                 {specialty}
                              </span>
                           ))}
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-lg font-semibold text-gray-800">{shop.priceRange}</span>
                           <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                              Visitar Loja
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

export default ReligiousShops;
