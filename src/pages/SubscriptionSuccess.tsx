import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      console.error('session_id não encontrado na URL');
      setStatus('error');
      return;
    }

    const verifySession = async () => {
      try {
        console.log('🔍 Verificando sessão no backend:', sessionId);

        const response = await fetch(
          `/api/check-session?session_id=${sessionId}`
        );

        const data = await response.json();

        if (!data.success) {
          console.error('❌ Erro ao verificar sessão:', data);
          setStatus('error');
          return;
        }

        console.log('✅ Sessão válida:', data);
        setSessionData(data);
        setStatus('success');
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        setStatus('error');
      }
    };

    verifySession();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando assinatura...</h1>
          <p className="text-gray-600">Aguarde enquanto confirmamos sua assinatura.</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao verificar assinatura</h1>
          <p className="text-gray-600 mb-6">
            Não foi possível confirmar sua assinatura. Por favor, tente novamente mais tarde.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const { status: paymentStatus, subscriptionId, customerEmail, amountTotal } = sessionData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Assinatura Confirmada!
            </h1>
            <p className="text-gray-600">
              Pagamento processado com sucesso. Obrigado pela assinatura!
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes do Pagamento</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status do Pagamento:</span>
                <span className="font-semibold text-green-600">
                  {paymentStatus === 'paid' ? 'Pago' : paymentStatus}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Valor Pago:</span>
                <span className="font-semibold text-gray-900">
                  R$ {(amountTotal / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">E-mail:</span>
                <span className="font-semibold text-gray-900">
                  {customerEmail}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">ID da Assinatura:</span>
                <span className="font-semibold text-gray-900">
                  {subscriptionId}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
