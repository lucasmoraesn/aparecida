import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import EventsSection from '../components/EventsSection';

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const categories = [
    {
      to: '/hoteis',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      title: 'Hotéis e Pousadas',
      description: 'Encontre a melhor hospedagem para sua estadia',
      color: 'from-blue-500 to-blue-600'
    },
    {
      to: '/restaurantes',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      title: 'Restaurantes',
      description: 'Saborosa culinária local e regional',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      to: '/lojas-religiosas',
      image: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      title: 'Lojas Religiosas',
      description: 'Artigos religiosos e souvenirs',
      color: 'from-purple-500 to-purple-600'
    },
    {
      to: '/pontos-turisticos',
      image: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      title: 'Pontos Turísticos',
      description: 'Conheça as principais atrações da cidade',
      color: 'from-green-500 to-green-600'
    }
  ];

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

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Explore <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">Aparecida</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubra os melhores estabelecimentos selecionados especialmente para sua visita
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.to}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <Link
                  to={category.to}
                  className="group block h-full"
                >
                  <motion.div
                    className="bg-white rounded-3xl shadow-lg p-8 text-center hover-lift border border-gray-100 relative overflow-hidden h-full flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.075 }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-75`}></div>

                    {/* Image */}
                    <motion.div
                      className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-75 shadow-lg"
                      transition={{ duration: 0.075 }}
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-75"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-75`}></div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-75">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Eventos e <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">Celebrações</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Participe dos principais eventos religiosos e culturais da cidade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg p-8 border border-gray-100 hover-lift"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.date}</p>
                <p className="text-gray-500 mb-4">{event.location}</p>
                <span className={`${event.color} px-4 py-2 rounded-full text-sm font-semibold`}>
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
              className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-75 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Ver Todos os Eventos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Business Registration Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Seu Negócio em <span className="text-yellow-400">Aparecida</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Conecte-se com milhares de peregrinos todos os meses. Cadastre seu estabelecimento
              e faça parte da maior rede de turismo religioso do país.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-3">500K+</div>
              <p className="text-blue-100 text-lg">Visitantes por mês</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-3">2000+</div>
              <p className="text-blue-100 text-lg">Negócios cadastrados</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-3">95%</div>
              <p className="text-blue-100 text-lg">Satisfação dos clientes</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/cadastrar-negocio"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-12 py-5 rounded-xl font-semibold text-xl transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              Cadastrar Negócio
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div>
              <Link
                to="/saiba-mais"
                className="text-blue-100 hover:text-white underline text-lg transition-colors duration-300"
              >
                Saiba Mais
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
