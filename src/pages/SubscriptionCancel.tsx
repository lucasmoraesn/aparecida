import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const SubscriptionCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>
          
          <p className="text-gray-600 mb-6">
            Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Se você teve algum problema durante o checkout ou tem dúvidas sobre os planos,
              entre em contato conosco pelo WhatsApp.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/cadastrar-negocio')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Tentar Novamente
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold"
            >
              Voltar ao Início
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-2">
              <strong>Precisa de ajuda?</strong>
            </p>
            <a
              href="https://wa.me/5512999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Fale conosco no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
