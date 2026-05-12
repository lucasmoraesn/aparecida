import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingCardProps {
  title: string;
  price: number; // Valor em reais (ex: 99.90)
  description?: string;
  features: string[];
  isRecommended?: boolean;
  isLoading?: boolean;
  onChoose: () => void;
  icon?: LucideIcon;
  oldPrice?: number; // Preço antigo riscado (opcional)
  buttonText?: string;
  variant?: 'light' | 'dark' | 'highlighted';
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isRecommended = false,
  isLoading = false,
  onChoose,
  icon: Icon,
  oldPrice,
  buttonText = 'Escolher Plano',
  variant = 'light',
}) => {
  // Variants de cores
  const variantStyles = {
    light: {
      container: 'bg-white border border-gray-200 hover:shadow-lg',
      badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      button: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      icon: 'text-green-500',
      title: 'text-gray-900',
      price: 'text-gray-900',
    },
    highlighted: {
      container: 'bg-white border-2 border-blue-500 shadow-xl hover:shadow-2xl',
      badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
      icon: 'text-blue-500',
      title: 'text-blue-600',
      price: 'text-gray-900',
    },
    dark: {
      container: 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:shadow-xl',
      badge: 'bg-amber-500 text-slate-900',
      button: 'bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold',
      icon: 'text-amber-400',
      title: 'text-amber-400',
      price: 'text-white',
    },
  };

  const currentVariant = variantStyles[variant];
  const discountPercent = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <motion.div
      className={`rounded-2xl shadow-md p-8 flex flex-col items-center h-full transition-all duration-300 relative ${currentVariant.container}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: isRecommended ? -8 : -4 }}
    >
      {/* Badge "Mais Escolhido" ou customizado */}
      {isRecommended && (
        <motion.div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${currentVariant.badge} font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-lg`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          viewport={{ once: true }}
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span>Mais Escolhido</span>
        </motion.div>
      )}

      {/* Espaço para o badge */}
      {isRecommended && <div className="h-6" />}

      {/* Ícone (se fornecido) */}
      {Icon && !isRecommended && (
        <div className={`mb-3 p-3 bg-opacity-10 rounded-full`}>
          <Icon className={`w-6 h-6 ${currentVariant.icon}`} />
        </div>
      )}

      {/* Título */}
      <h3 className={`text-xl font-bold mb-2 ${currentVariant.title}`}>
        {title}
      </h3>

      {/* Descrição (opcional) */}
      {description && (
        <p className={`text-sm mb-4 text-center ${variant === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}

      {/* Preço com desconto opcional */}
      <div className="mb-6 text-center w-full">
        {oldPrice && (
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className={`text-sm line-through ${variant === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}>
              R$ {oldPrice.toFixed(2).replace('.', ',')}
            </span>
            {discountPercent > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>
        )}

        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-5xl font-extrabold ${currentVariant.price}`}>
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
          <span className={`text-sm ${variant === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
            /mês
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className={`w-full space-y-3 mb-8 text-sm flex-1 ${variant === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 shrink-0 mt-0.5 ${currentVariant.icon}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className={isRecommended && variant === 'highlighted' && index === 0 ? 'font-medium' : ''}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <motion.button
        onClick={onChoose}
        disabled={isLoading}
        className={`mt-auto w-full py-3 px-4 font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${currentVariant.button} disabled:opacity-60 disabled:cursor-not-allowed`}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          buttonText
        )}
      </motion.button>
    </motion.div>
  );
};

export default PricingCard;
