import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, TrendingUp } from 'lucide-react';

interface AdvertiseSectionProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

const AdvertiseSection: React.FC<AdvertiseSectionProps> = ({ 
  title = "Sua empresa não está aqui?",
  description = "Anuncie seu negócio gratuitamente e alcance milhares de visitantes.",
  variant = 'default'
}) => {
  const whatsappNumber = '5512992126779';
  const message = encodeURIComponent('Olá! Gostaria de anunciar meu negócio em Aparecida do Norte.');

  const sendWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        className=\"bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg my-8\"\n        initial={{ opacity: 0, x: -20 }}\n        whileInView={{ opacity: 1, x: 0 }}\n        transition={{ duration: 0.5 }}\n        viewport={{ once: true }}\n      >\n        <p className=\"text-gray-700 font-semibold mb-3\">{title}</p>\n        <button\n          onClick={sendWhatsApp}\n          className=\"bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm inline-flex items-center gap-2 transition\"\n        >\n          <MessageCircle className=\"w-4 h-4\" />\n          Anuncie Aqui\n        </button>\n      </motion.div>\n    );\n  }

  if (variant === 'compact') {
    return (\n      <motion.div\n        className=\"bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 my-12 shadow-lg\"\n        initial={{ opacity: 0, y: 20 }}\n        whileInView={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.6 }}\n        viewport={{ once: true }}\n      >\n        <div className=\"flex flex-col md:flex-row items-center justify-between gap-6\">\n          <div>\n            <h3 className=\"text-xl md:text-2xl font-bold mb-2\">{title}</h3>\n            <p className=\"text-blue-100\">{description}</p>\n          </div>\n          <div className=\"flex gap-3\">\n            <motion.button\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              onClick={sendWhatsApp}\n              className=\"bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition whitespace-nowrap\"\n            >\n              Anuncie Agora\n            </motion.button>\n            <motion.button\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              as={Link}\n              to=\"/anuncie-sua-empresa\"\n              className=\"border-2 border-white text-white font-bold py-2 px-6 rounded-lg hover:bg-white/10 transition whitespace-nowrap\"\n            >\n              Ver Planos\n            </motion.button>\n          </div>\n        </div>\n      </motion.div>\n    );\n  }

  // Default variant
  return (\n    <section className=\"py-16 md:py-20 bg-gray-50 rounded-2xl\">\n      <div className=\"max-w-4xl mx-auto px-6 text-center\">\n        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          whileInView={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.6 }}\n          viewport={{ once: true }}\n        >\n          <div className=\"flex items-center justify-center gap-2 mb-4\">\n            <TrendingUp className=\"w-6 h-6 text-blue-600\" />\n            <span className=\"text-sm font-semibold text-blue-600 uppercase tracking-wide\">\n              Monetize seu negócio\n            </span>\n          </div>\n\n          <h2 className=\"text-3xl md:text-4xl font-bold text-gray-900 mb-4\">\n            {title}\n          </h2>\n\n          <p className=\"text-lg text-gray-600 mb-8 max-w-2xl mx-auto\">\n            {description}\n          </p>\n\n          <div className=\"flex flex-col sm:flex-row gap-4 justify-center\">\n            <motion.button\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              onClick={sendWhatsApp}\n              className=\"bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition shadow-lg\"\n            >\n              <MessageCircle className=\"w-5 h-5\" />\n              Anuncie Agora - é Grátis!\n            </motion.button>\n\n            <motion.button\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              as={Link}\n              to=\"/anuncie-sua-empresa\"\n              className=\"border-2 border-blue-600 text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition\"\n            >\n              Ver Planos e Benefícios\n            </motion.button>\n          </div>\n\n          <p className=\"text-sm text-gray-500 mt-6\">\n            ✨ Más de 500+ empresas já anunciando  •  Sem taxa de anúncio  •  Resultados garantidos\n          </p>\n        </motion.div>\n      </div>\n    </section>\n  );\n};

export default AdvertiseSection;
