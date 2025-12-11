import React, { useState } from 'react';

interface CardPaymentProps {
  subscriptionId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const CardPayment: React.FC<CardPaymentProps> = ({
  subscriptionId,
  onSuccess,
  onError,
}) => {
  const [cardData, setCardData] = useState({
    holder_name: '',
    number: '',
    exp_month: '',
    exp_year: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // Validações básicas
    if (field === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
    }
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    if (field === 'exp_month') {
      value = value.replace(/\D/g, '').slice(0, 2);
    }
    if (field === 'exp_year') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validações básicas
      if (!cardData.holder_name.trim()) {
        throw new Error('Nome do titular é obrigatório');
      }
      if (cardData.number.length !== 16) {
        throw new Error('Número do cartão inválido');
      }
      if (!cardData.exp_month || !cardData.exp_year) {
        throw new Error('Data de vencimento inválida');
      }
      if (cardData.cvv.length < 3) {
        throw new Error('CVV inválido');
      }

      console.log('Processando pagamento com cartão:', { ...cardData, cvv: '***' });

      // Chamar onSuccess se o pagamento for processado
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar cartão';
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Pagar com Cartão de Crédito</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome do Titular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Titular *
          </label>
          <input
            type="text"
            value={cardData.holder_name}
            onChange={(e) => handleInputChange('holder_name', e.target.value)}
            placeholder="Como aparece no cartão"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
        </div>

        {/* Número do Cartão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número do Cartão *
          </label>
          <input
            type="text"
            value={cardData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            placeholder="0000 0000 0000 0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            {cardData.number.length}/16 dígitos
          </p>
        </div>

        {/* Data e CVV */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mês *
            </label>
            <input
              type="text"
              value={cardData.exp_month}
              onChange={(e) => handleInputChange('exp_month', e.target.value)}
              placeholder="MM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano *
            </label>
            <input
              type="text"
              value={cardData.exp_year}
              onChange={(e) => handleInputChange('exp_year', e.target.value)}
              placeholder="YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV *
            </label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              disabled={isProcessing}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
        </button>

        <p className="text-xs text-gray-600 text-center">
          Seus dados de cartão são seguros. O pagamento será processado imediatamente.
        </p>
      </form>
    </div>
  );
};
