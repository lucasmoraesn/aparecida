import React, { useEffect, useState } from 'react';
import { Check, Star, Shield, Award, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRICE_IDS: Record<string, string> = {
  basico: 'price_1TK32IJRpc53eVmKZ5G4rC0X',
  destaque: 'price_1TK32aJRpc53eVmKQT3U2Ff9',
  premium: 'price_1TK33IJRpc53eVmKM8Wk64nH'
};

// Use environment variable or relative URL
const API_BASE = import.meta.env.VITE_API_URL || "";

const PlanosRestaurantes = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Planos para Restaurantes | Explore Aparecida';
  }, []);

  const handleChoosePlan = async (plano: string) => {
    const priceId = PRICE_IDS[plano];
    if (!priceId) return;

    setLoadingPlan(plano);
    try {
      const response = await fetch(`${API_BASE}/api/create-restaurantes-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId,
          successUrl: `${window.location.origin}/cadastro-sucesso?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/planos-restaurantes`
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // Redireciona para o Stripe Checkout
      } else {
        throw new Error(data.error || 'Erro ao criar sessão');
      }
    } catch (error) {
      console.error('Erro ao redirecionar para o Stripe:', error);
      alert('Tivemos um problema ao conectar com o provedor de pagamentos. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Cadastre seu Restaurante em Aparecida
          </h1>
          <p className="text-xl text-gray-600">
            Aumente sua visibilidade entre romeiros e turistas
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Plano Básico */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Básico</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-gray-900">R$ 49,90</span>
              <span className="text-gray-500">/mês</span>
            </div>
            
            <ul className="w-full space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Nome do restaurante</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Endereço e horário</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>WhatsApp direto</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Tipo de culinária</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>1 foto</span>
              </li>
            </ul>

            <button 
              onClick={() => handleChoosePlan('basico')}
              disabled={loadingPlan === 'basico'}
              className="mt-auto w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loadingPlan === 'basico' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Escolher Plano'}
            </button>
          </div>

          {/* Plano Destaque */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-green-500 p-8 flex flex-col items-center relative transform md:-translate-y-4">
            <div className="absolute top-0 transform -translate-y-1/2 bg-green-500 text-white font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-md">
              <Shield className="w-4 h-4" /> Mais Popular
            </div>
            
            <h3 className="text-xl font-semibold text-green-600 mb-2">Destaque</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-gray-900">R$ 99,90</span>
              <span className="text-gray-500">/mês</span>
            </div>
            
            <ul className="w-full space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-gray-900 font-medium pb-2 border-b border-gray-100">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Tudo do plano básico</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Destaque na listagem</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Selo "Restaurante Verificado"</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Até 5 fotos</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Especialidades listadas</span>
              </li>
            </ul>

            <button 
              onClick={() => handleChoosePlan('destaque')}
              disabled={loadingPlan === 'destaque'}
              className="mt-auto w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loadingPlan === 'destaque' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Escolher Plano'}
            </button>
          </div>

          {/* Plano Premium */}
          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-2xl shadow-lg border border-orange-700 p-8 flex flex-col items-center hover:shadow-xl transition-shadow relative">
            
            <h3 className="text-xl font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" /> Premium
            </h3>
            <div className="flex items-baseline gap-1 mb-6 text-white">
              <span className="text-4xl font-extrabold">R$ 199,90</span>
              <span className="text-orange-300">/mês</span>
            </div>
            
            <ul className="w-full space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-white font-medium pb-2 border-b border-orange-700/50">
                <Check className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Tudo do plano destaque</span>
              </li>
              <li className="flex items-start gap-3 text-orange-100">
                <Check className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Destaque no topo da listagem</span>
              </li>
              <li className="flex items-start gap-3 text-orange-100">
                <Check className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Badge "Recomendado"</span>
              </li>
              <li className="flex items-start gap-3 text-orange-100">
                <Check className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Até 15 fotos + galeria</span>
              </li>
              <li className="flex items-start gap-3 text-orange-100">
                <Check className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Menu e valores</span>
              </li>
              <li className="flex items-start gap-3 text-orange-100">
                <Check className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Mapa de localização</span>
              </li>
            </ul>

            <button 
              onClick={() => handleChoosePlan('premium')}
              disabled={loadingPlan === 'premium'}
              className="mt-auto w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-orange-900 font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loadingPlan === 'premium' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Escolher Plano'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PlanosRestaurantes;
