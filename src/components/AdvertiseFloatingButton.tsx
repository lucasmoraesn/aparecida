import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const AdvertiseFloatingButton = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to="/anuncie-sua-empresa"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        title="Anunciar empresa"
      >
        <Megaphone className="w-6 h-6" />
        <span className="hidden sm:inline font-bold text-sm lg:text-base whitespace-nowrap">
          Anunciar
        </span>
      </Link>
    </motion.div>
  );
};

export default AdvertiseFloatingButton;
