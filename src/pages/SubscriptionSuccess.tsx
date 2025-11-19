import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [subscription, setSubscription] = useState<any>(null);

  const businessId = searchParams.get('business_id');

  useEffect(() => {
    if (!businessId) {
      setStatus('error');
      return;
    }

    const checkSubscription = async () => {
      try {
        // Buscar assinatura pelo business_id
        const { data, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            business_plans(name, price, features)
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        setSubscription(data);
        setStatus('success');
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        setStatus('error');
      }
    };

    checkSubscription();
  }, [businessId]);

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

  if (status === 'error' || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao verificar assinatura</h1>
          <p className="text-gray-600 mb-6">
            Não foi possível confirmar sua assinatura. Por favor, entre em contato com o suporte.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subscription.status === 'active' ? '🎉 Assinatura Ativa!' : '✅ Assinatura Criada!'}
            </h1>
            <p className="text-gray-600">
              {subscription.status === 'active'
                ? 'Sua assinatura está ativa e o primeiro pagamento foi confirmado.'
                : 'Sua assinatura foi criada com sucesso e está aguardando confirmação de pagamento.'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes da Assinatura</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plano:</span>
                <span className="font-semibold text-gray-900">
                  {subscription.business_plans?.name || 'Plano Premium'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Valor Mensal:</span>
                <span className="font-semibold text-gray-900">
                  R$ {(subscription.amount_cents / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  subscription.status === 'active' ? 'text-green-600' :
                  subscription.status === 'pending' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {subscription.status === 'active' ? 'Ativa' :
                   subscription.status === 'pending' ? 'Pendente' :
                   subscription.status}
                </span>
              </div>

              {subscription.next_charge_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Próxima Cobrança:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(subscription.next_charge_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📧 Próximos Passos</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Você receberá um e-mail com os detalhes da assinatura</li>
              <li>• A cobrança será realizada automaticamente todo mês</li>
              <li>• Você pode cancelar sua assinatura a qualquer momento</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold"
            >
              Voltar ao Início
            </button>
            <button
              onClick={() => navigate('/minhas-assinaturas')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Ver Minhas Assinaturas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
