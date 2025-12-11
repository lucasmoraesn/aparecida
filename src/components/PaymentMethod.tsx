import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod: 'cartao' | null;
  onSelect: (method: 'cartao') => void;
  planPrice: number;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelect,
  planPrice,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Método de Pagamento
      </label>

      <div className="grid grid-cols-1 gap-4">
        {/* Cartão de Crédito */}
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'cartao'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelect('cartao')}
        >
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Cartão de Crédito</h3>
          </div>
          <p className="text-sm text-gray-600">
            Pagamento seguro com Stripe
          </p>
          <p className="text-xs text-gray-500 mt-2">Recorrente em 30 dias</p>
        </div>
      </div>

      {selectedMethod && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Valor a pagar: <strong>R$ {planPrice.toFixed(2).replace('.', ',')}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            ✓ O pagamento será processado de forma segura. A assinatura será ativada após a confirmação.
          </p>
        </div>
      )}
    </div>
  );
};
