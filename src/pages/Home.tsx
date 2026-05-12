import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CategoryCarousel from '../components/CategoryCarousel';
import AdvertisePromoSection from '../components/AdvertisePromoSection';

const Home = () => {
  const bookingAffiliateURL = 'https://tidd.ly/4puN43K';

  const events = [
    {
      title: 'Missa Solene do Dia de Nossa Senhora',
      date: '12 de Outubro às 10:00h',
      location: 'Basílica Nacional',
      type: 'Religioso',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Festival de Inverno de Aparecida',
      date: '15-22 de Julho às 19:00h',
      location: 'Centro de Eventos',
      type: 'Cultural',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <>
      <Hero />

      <CategoryCarousel />

      <AdvertisePromoSection />

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Eventos e <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">Celebrações</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Participe dos principais eventos religiosos e culturais da cidade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 hover-lift"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{event.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{event.date}</p>
                <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">{event.location}</p>
                <span className={`${event.color} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold`}>
                  {event.type}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/todos-eventos"
              className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-75 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Ver Todos os Eventos
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>


    </>
  );
};

export default Home;
