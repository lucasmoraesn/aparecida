import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Users, TrendingUp } from 'lucide-react';

const AdvertisePromoSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="inline-block mb-5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-yellow-400/20 border border-yellow-400/40 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-bold text-sm sm:text-base tracking-wide"> Oportunidade Premium</span>
            </div>
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Sua empresa vista por milhares{' '}
            <span className="text-white">todo dia.</span>
          </h2>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed px-2 mb-10 sm:mb-12">
            Destaque seu negócio para turistas e peregrinos em Aparecida —
            o maior destino religioso do Brasil.
          </p>

          {/* Métricas */}
          <motion.div
            className="grid grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-1">5K+</div>
              <div className="text-xs sm:text-base text-blue-100">Visitas/mês</div>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-1">+50%</div>
              <div className="text-xs sm:text-base text-blue-100">Mais visibilidade</div>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-1">Rápido</div>
              <div className="text-xs sm:text-base text-blue-100">Ative hoje</div>
            </motion.div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
  to="/cadastrar-negocio"
  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl inline-flex items-center justify-center gap-3 text-base sm:text-lg"
>
  Quero aparecer agora
</Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg"
            >
              Saiba mais
            </button>
          </motion.div>

          {/* Nota de rodapé */}
          <p className="text-blue-200/70 text-xs sm:text-sm mt-6">
            Planos de destaque pagos · Cadastro básico gratuito · Cancele quando quiser
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvertisePromoSection;
