import React, { useEffect } from 'react';
import { Check, Star, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlanosMotoristas = () => {
  useEffect(() => {
    document.title = 'Planos para Motoristas | Explore Aparecida';
  }, []);

  const handleChoosePlan = (plano: string) => {
    // Para simplificar, direciona para o cadastro passando o plano como query
    window.location.href = `/cadastrar-negocio?tipo=motorista&plano=${plano}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Cadastre-se como Motorista em Aparecida
          </h1>
          <p className="text-xl text-gray-600">
            Receba contatos diretos de romeiros e hotéis da região
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Plano Básico */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Básico</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-gray-900">R$ 39,90</span>
              <span className="text-gray-500">/mês</span>
            </div>
            
            <ul className="w-full space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Nome do motorista</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Tipo de veículo</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>WhatsApp direto</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Até 3 cidades atendidas</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Listagem padrão</span>
              </li>
            </ul>

            <button 
              onClick={() => handleChoosePlan('basico')}
              className="mt-auto w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Escolher Plano
            </button>
          </div>

          {/* Plano Destaque */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 flex flex-col items-center relative transform md:-translate-y-4">
            <div className="absolute top-0 transform -translate-y-1/2 bg-blue-500 text-white font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-md">
              <Shield className="w-4 h-4" /> Mais Escolhido
            </div>
            
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Destaque</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-gray-900">R$ 49,90</span>
              <span className="text-gray-500">/mês</span>
            </div>
            
            <ul className="w-full space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-gray-900 font-medium pb-2 border-b border-gray-100">
                <Check className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Tudo do plano básico</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Destaque na listagem</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Selo "Motorista Verificado"</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Até 6 cidades atendidas</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-blue-500 shrink-0" />
                <span>1 foto do veículo</span>
              </li>
            </ul>

            <button 
              onClick={() => handleChoosePlan('destaque')}
              className="mt-auto w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Escolher Plano
            </button>
          </div>

          {/* Plano Premium */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg border border-slate-700 p-8 flex flex-col items-center hover:shadow-xl transition-shadow relative">
            
            <h3 className="text-xl font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" /> Premium
            </h3>
            <div className="flex items-baseline gap-1 mb-6 text-white">
              <span className="text-4xl font-extrabold">R$ 89,90</span>
              <span className="text-slate-400">/mês</span>
            </div>
            
            <ul className="w-full space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-white font-medium pb-2 border-b border-slate-700/50">
                <Check className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Tudo do plano destaque</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Destaque máximo no topo</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Badge "Recomendado"</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Até 10 cidades atendidas</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Galeria com fotos</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Descrição completa do serviço</span>
              </li>
            </ul>

            <button 
              onClick={() => handleChoosePlan('premium')}
              className="mt-auto w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-md transition-colors"
            >
              Escolher Plano
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PlanosMotoristas;
