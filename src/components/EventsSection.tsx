import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: "Missa Solene do Dia de Nossa Senhora",
      date: "12 de Outubro",
      time: "10:00h",
      location: "Basílica Nacional",
      attendees: "50.000+",
      image: "https://images.pexels.com/photos/3618162/pexels-photo-3618162.jpeg?auto=compress&cs=tinysrgb&w=800",
      type: "Religioso"
    },
    {
      id: 2,
      title: "Festival de Inverno de Aparecida",
      date: "15-22 de Julho",
      time: "19:00h",
      location: "Centro de Eventos",
      attendees: "10.000+",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
      type: "Cultural"
    },
    {
      id: 3,
      title: "Caminhada da Fé",
      date: "1º Domingo do Mês",
      time: "06:00h",
      location: "Santuário Nacional",
      attendees: "5.000+",
      image: "https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=800",
      type: "Espiritual"
    }
  ];

  return (
    <section id="eventos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-full mb-4">
            <Calendar className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Eventos e Celebrações</h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Participe dos principais eventos religiosos e culturais da cidade
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.type === 'Religioso' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'Cultural' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{event.attendees} participantes</span>
                    </div>
                  </div>

                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Saiba Mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Agenda Completa de Eventos</h3>
          <p className="mb-6 text-purple-100">
            Não perca nenhum evento importante! Acesse nossa agenda completa e planeje sua visita.
          </p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors">
            Ver Agenda Completa
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;