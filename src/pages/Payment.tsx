import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { BusinessService } from '../lib/businessService';

// TODO: Este componente precisa ser refatorado para usar Stripe
// Por enquanto, apenas exibe mensagem informativa

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const { registrationId, formData, plan } = location.state || {};

  if (!formData || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dados não encontrados</h1>
          <p className="text-gray-600 mb-6">Por favor, preencha o formulário de cadastro primeiro.</p>
          <button
            onClick={() => navigate('/cadastrar-negocio')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Cadastro
          </button>
        </div>
      </div>
    );
  }

  // TODO: Implementar checkout com Stripe
  const handlePayment = async () => {
    setIsProcessing(true);
    setError('Sistema de pagamento em manutenção. Por favor, entre em contato pelo WhatsApp.');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/cadastrar-negocio')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao formulário
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento em Manutenção
            </h1>
            <p className="text-gray-600">
              Estamos atualizando nosso sistema de pagamentos
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Resumo do Pedido */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Cadastro</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{formData.establishmentName}</h3>
                  <p className="text-sm text-gray-600">{formData.category}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Plano Escolhido</h3>
                  <p className="text-lg font-bold text-blue-600">{plan.name}</p>
                  <p className="text-sm text-gray-600">R$ {plan.price.toFixed(2).replace('.', ',')}/mês</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem informativa */}
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Sistema em Atualização</h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    Estamos integrando um novo sistema de pagamentos para oferecer uma experiência ainda melhor. 
                    Seu cadastro foi salvo com sucesso!
                  </p>
                  <p className="text-yellow-800 text-sm font-medium">
                    Entre em contato conosco pelo WhatsApp para finalizar seu cadastro:
                  </p>
                  <a 
                    href={`https://wa.me/55${formData.whatsapp?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Contatar pelo WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Mensagem de Erro (se houver) */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Botão voltar */}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
