import React from 'react';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  showQuantity?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuantity = false }) => {
  const { addItem, removeItem, updateQuantity, isInCart, getItemQuantity } = useCart();
  const currentQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleRemoveFromCart = () => {
    removeItem(product.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.rating && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">{product.rating}</span>
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Últimas {product.stock}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">Esgotado</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          
          <span className="text-xs sm:text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
          </span>
        </div>

        {showQuantity && inCart ? (
          <div className="flex flex-col xs:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                disabled={product.stock === 0}
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              
              <span className="text-base sm:text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                {currentQuantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                disabled={product.stock === 0 || currentQuantity >= product.stock}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={handleRemoveFromCart}
              className="w-full xs:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              Remover
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
