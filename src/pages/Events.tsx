import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star } from 'lucide-react';

const events = [
   {
      id: 1,
      name: "Missa Solene do Dia de Nossa Senhora Aparecida",
      description: "Missa solene em homenagem ao dia de Nossa Senhora Aparecida, padroeira do Brasil.",
      date: "12 de Outubro",
      time: "10:00h",
      location: "Basílica Nacional de Nossa Senhora Aparecida",
      address: "Praça Nossa Senhora Aparecida, s/n - Centro",
      type: "Religioso",
      attendance: "45.000 pessoas",
      highlights: ["Missa solene", "Procissão", "Bênção especial"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 2,
      name: "Festa de São Benedito",
      description: "Festa tradicional em homenagem a São Benedito, com missas, procissão e comidas típicas.",
      date: "5 de Janeiro",
      time: "19:00h",
      location: "Igreja de São Benedito",
      address: "Rua São Benedito, 123 - Centro",
      type: "Religioso",
      attendance: "5.000 pessoas",
      highlights: ["Procissão", "Comidas típicas", "Danças tradicionais"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 3,
      name: "Missa das 18h - Todos os Domingos",
      description: "Missa dominical na Basílica Nacional, com participação especial de corais e orquestras.",
      date: "Todos os Domingos",
      time: "18:00h",
      location: "Basílica Nacional",
      address: "Praça Nossa Senhora Aparecida, s/n - Centro",
      type: "Religioso",
      attendance: "15.000 pessoas",
      highlights: ["Missa dominical", "Coral", "Orquestra"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 4,
      name: "Novena de Nossa Senhora Aparecida",
      description: "Novena tradicional em preparação para o dia de Nossa Senhora Aparecida.",
      date: "3 a 11 de Outubro",
      time: "19:30h",
      location: "Basílica Nacional",
      address: "Praça Nossa Senhora Aparecida, s/n - Centro",
      type: "Religioso",
      attendance: "20.000 pessoas",
      highlights: ["Novena", "Orações", "Bênçãos"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 5,
      name: "Festival de Inverno de Aparecida",
      description: "Festival cultural com apresentações musicais, danças e exposições de arte.",
      date: "15-22 de Julho",
      time: "19:00h",
      location: "Centro de Eventos",
      address: "Av. Dr. Júlio Prestes, 500 - Centro",
      type: "Cultural",
      attendance: "10.000 pessoas",
      highlights: ["Música", "Dança", "Arte"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 6,
      name: "Missa dos Romeiros",
      description: "Missa especial para grupos de peregrinos e caravanas que visitam a cidade.",
      date: "Todos os Sábados",
      time: "16:00h",
      location: "Basílica Nacional",
      address: "Praça Nossa Senhora Aparecida, s/n - Centro",
      type: "Religioso",
      attendance: "25.000 pessoas",
      highlights: ["Missa especial", "Bênção dos romeiros", "Acolhida"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 7,
      name: "Festa de Santo Antônio",
      description: "Festa em homenagem a Santo Antônio, com missas e distribuição de pães.",
      date: "13 de Junho",
      time: "19:00h",
      location: "Igreja de Santo Antônio",
      address: "Rua Santo Antônio, 456 - Centro",
      type: "Religioso",
      attendance: "3.000 pessoas",
      highlights: ["Distribuição de pães", "Missa", "Procissão"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
      id: 8,
      name: "Missa das 7h - Todos os Dias",
      description: "Missa matinal diária na Basílica Nacional, ideal para começar o dia com fé.",
      date: "Todos os Dias",
      time: "07:00h",
      location: "Basílica Nacional",
      address: "Praça Nossa Senhora Aparecida, s/n - Centro",
      type: "Religioso",
      attendance: "8.000 pessoas",
      highlights: ["Missa matinal", "Oração", "Bênção do dia"],
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800"
   }
];

const Events = () => {
   return (
      <div className="min-h-screen bg-gray-50">
         <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                     Eventos em Aparecida do Norte (SP)
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                     Confira a agenda de missas, festas religiosas e eventos culturais em Aparecida,
                     planeje sua viagem e participe das principais celebrações no Santuário Nacional.
                  </p>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                     <div className="h-48 overflow-hidden">
                        <img
                           src={event.image}
                           alt={event.name}
                           className="w-full h-full object-cover"
                        />
                     </div>

                     <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.type === 'Religioso' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {event.type}
                           </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{event.description}</p>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                           <Calendar className="w-4 h-4" />
                           <span>{event.date}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                           <Clock className="w-4 h-4" />
                           <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                           <MapPin className="w-4 h-4" />
                           <span>{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                           <Users className="w-4 h-4" />
                           <span>{event.attendance}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                           {event.highlights.slice(0, 3).map((highlight, index) => (
                              <span
                                 key={index}
                                 className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                 {highlight}
                              </span>
                           ))}
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Evento Gratuito</span>
                           <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                              Participar
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="text-center mt-12">
               <Link
                  to="/todos-eventos"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
               >
                  Ver Todos os Eventos
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Events;
