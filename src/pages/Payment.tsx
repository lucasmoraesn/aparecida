import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, CheckCircle, ArrowLeft, Copy, AlertCircle, ExternalLink } from 'lucide-react';
import { MercadoPagoSandboxService } from '../lib/mercadopagoSandbox';
import { BusinessService } from '../lib/businessService';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'preference' | 'pix'>('preference');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pixCode, setPixCode] = useState<string>('');
  const [pixExpiresAt, setPixExpiresAt] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  console.log('DEBUG VITE_MP_PUBLIC_KEY =', import.meta.env.VITE_MP_PUBLIC_KEY);
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

  // Verificar status do pagamento periodicamente (para PIX)
  useEffect(() => {
    if (pixCode && paymentMethod === 'pix') {
      const interval = setInterval(async () => {
        try {
          // Aqui você pode implementar verificação de status do PIX
          console.log('Verificando status do PIX...');
        } catch (error) {
          console.error('Erro ao verificar status do pagamento:', error);
        }
      }, 5000); // Verificar a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [pixCode, paymentMethod]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      if (!registrationId) {
        throw new Error('ID do cadastro não encontrado');
      }

      let paymentResponse: any;

      if (paymentMethod === 'preference') {
        // Payload SEM payment_method para preference/checkout
        const preferenceRequest = {
          amount: plan.price,
          description: `Cadastro - ${formData.establishmentName}`,
          payer_email: 'test_user_123456@testuser.com', // Email de teste do Sandbox
          external_reference: registrationId.toString(),
        };

        // O service está tipado exigindo payment_method; usamos assertion local
        paymentResponse = await MercadoPagoSandboxService.createPaymentPreference(
          preferenceRequest as any
        );

        setPaymentUrl(
          (paymentResponse && (paymentResponse.init_point || paymentResponse.sandbox_init_point)) || ''
        );
      } else {
        // PIX direto – aqui sim precisa de payment_method: 'pix'
        const pixRequest = {
          amount: plan.price,
          description: `Cadastro - ${formData.establishmentName}`,
          payer_email: 'test_user_123456@testuser.com', // Email de teste do Sandbox
          payment_method: 'pix' as const,
          external_reference: registrationId.toString(),
        };

        paymentResponse = await MercadoPagoSandboxService.createPixPayment(pixRequest as any);
        setPixCode((paymentResponse && paymentResponse.pix_code) || '');
        setPixExpiresAt((paymentResponse && paymentResponse.pix_expires_at) || '');
      }

      console.log('Pagamento criado:', paymentResponse);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  const copyPixCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      alert('Código PIX copiado!');
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagamento Aprovado!</h1>
          <p className="text-gray-600 mb-6">
            Seu cadastro foi enviado com sucesso e está sendo analisado.
            Você receberá um e-mail de confirmação em breve.
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
              Finalizar Pagamento (Sandbox)
            </h1>
            <p className="text-gray-600">
              Escolha a forma de pagamento para ativar seu cadastro
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumo do Pedido */}
            <div className="bg-gray-50 rounded-lg p-6">
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

            {/* Métodos de Pagamento */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Forma de Pagamento</h2>

              <div className="space-y-4">
                {/* Checkout Mercado Pago */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'preference' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  onClick={() => setPaymentMethod('preference')}
                >
                  <div className="flex items-center">
                    <ExternalLink className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Checkout Mercado Pago</h3>
                      <p className="text-sm text-gray-600">Página de pagamento completa (Recomendado)</p>
                    </div>
                  </div>
                </div>

                {/* PIX */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <div className="flex items-center">
                    <QrCode className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">PIX</h3>
                      <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos de Pagamento */}
              {paymentMethod === 'pix' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  {pixCode ? (
                    <div className="text-center">
                      <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Escaneie o QR Code com seu app bancário
                      </p>
                      <div className="bg-white p-3 rounded border mb-4">
                        <p className="text-xs text-gray-500 mb-2">Código PIX</p>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm break-all">{pixCode}</p>
                          <button
                            onClick={copyPixCode}
                            className="ml-2 p-1 text-blue-600 hover:text-blue-800"
                            title="Copiar código"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {pixExpiresAt && (
                        <p className="text-xs text-gray-500">
                          Expira em: {new Date(pixExpiresAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">
                        Clique em "Gerar PIX" para obter o código de pagamento
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'preference' && paymentUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-sm text-green-700 mb-4">
                      Pagamento criado com sucesso! Clique no botão abaixo para acessar o checkout.
                    </p>
                    <button
                      onClick={redirectToPayment}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Acessar Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagem de Erro */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Botão de Pagamento */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod === 'preference' && !!paymentUrl)}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing
                  ? 'Processando...'
                  : paymentMethod === 'pix' && !pixCode
                  ? 'Gerar PIX'
                  : paymentMethod === 'preference' && paymentUrl
                  ? 'Checkout Criado'
                  : `Criar Pagamento R$ ${plan.price.toFixed(2).replace('.', ',')}`}
              </button>

              {import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN?.startsWith('TEST-') && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  <strong>MODO SANDBOX:</strong> Use os dados de teste do Mercado Pago para testar o pagamento.
                </p>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                Ao finalizar o pagamento, você concorda com nossos{' '}
                <a href="/termos" className="text-blue-600 hover:underline">termos de uso</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
