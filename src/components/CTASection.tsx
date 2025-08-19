import React from 'react';
import { MessageCircle, Users, Store, MapPin } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça Parte do Explore Aparecida
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Conecte-se com milhares de visitantes e promova seu negócio na maior plataforma de turismo religioso do Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Store className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Comerciantes</h3>
              <p className="text-blue-100 text-sm">Cadastre seu estabelecimento e alcance mais clientes</p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Grupos</h3>
              <p className="text-blue-100 text-sm">Organize sua caravana com facilidade e segurança</p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visitantes</h3>
              <p className="text-blue-100 text-sm">Descubra os melhores lugares para sua peregrinação</p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <MessageCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Suporte</h3>
              <p className="text-blue-100 text-sm">Atendimento especializado para suas necessidades</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Para Comerciantes</h3>
            <ul className="space-y-3 mb-6 text-blue-100">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Cadastro gratuito básico
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Planos premium com destaque
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Integração com WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Estatísticas de visualização
              </li>
            </ul>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-colors">
              Cadastrar Meu Negócio
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Para Grupos e Caravanas</h3>
            <ul className="space-y-3 mb-6 text-blue-100">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Planejamento personalizado
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Descontos especiais para grupos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Roteiros exclusivos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Suporte durante a viagem
              </li>
            </ul>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Solicitar Orçamento
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;