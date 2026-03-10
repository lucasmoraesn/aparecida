import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CategoryCarousel from '../components/CategoryCarousel';

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

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <motion.div
            className="text-center mb-10 sm:mb-12 md:mb-16 relative z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Seu Negócio em <span className="text-yellow-400">Aparecida</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
              Conecte-se com milhares de peregrinos todos os meses. Cadastre seu estabelecimento
              e faça parte da maior rede de turismo religioso do país.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16 relative z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div className="text-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-2 sm:mb-3">500K+</div>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">Visitantes por mês</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-2 sm:mb-3">2000+</div>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">Negócios cadastrados</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-2 sm:mb-3">95%</div>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">Satisfação dos clientes</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center space-y-6 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/cadastrar-negocio"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg md:text-xl transition-all duration-300 inline-flex items-center gap-2 sm:gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              Cadastrar Negócio
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
