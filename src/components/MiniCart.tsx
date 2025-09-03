import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface MiniCartProps {
  isVisible: boolean;
}

const MiniCart: React.FC<MiniCartProps> = ({ isVisible }) => {
  const { state, removeItem, updateQuantity } = useCart();

  if (!isVisible || state.items.length === 0) {
    return null;
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Seu Carrinho</h3>
          <span className="text-sm text-gray-500">
            {state.itemCount} item{state.itemCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Items */}
        <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
          {state.items.slice(0, 3).map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {item.product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  R$ {item.product.price.toFixed(2).replace('.', ',')} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {state.items.length > 3 && (
            <div className="text-center text-sm text-gray-500 py-2">
              +{state.items.length - 3} mais item{state.items.length - 3 !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-bold text-blue-600">
              R$ {state.total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link
            to="/carrinho"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Ver Carrinho
          </Link>
          
          <Link
            to="/carrinho"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Finalizar Compra
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
