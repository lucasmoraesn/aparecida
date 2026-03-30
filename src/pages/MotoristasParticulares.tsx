import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, Shield, Clock, Star } from 'lucide-react';
import MotoristaCard from '../components/MotoristaCard';
import { getMotoristasOrdenados } from '../data/motoristas';

const MotoristasParticulares = () => {
  const motoristas = getMotoristasOrdenados();
  const [busca, setBusca] = useState('');

  // Filtrar motoristas por nome, cidade ou veículo
  const motoristasFiltrados = motoristas.filter((m) => {
    const termo = busca.toLowerCase();
    if (!termo) return true;
    return (
      m.nome.toLowerCase().includes(termo) ||
      m.veiculo.toLowerCase().includes(termo) ||
      m.cidades.some((c) => c.toLowerCase().includes(termo))
    );
  });

  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';

    document.title = 'Motoristas particulares em Aparecida do Norte | Explore Aparecida';
    meta?.setAttribute(
      'content',
      'Encontre motoristas particulares em Aparecida do Norte (SP). Translados, tours religiosos e viagens para Campos do Jordão, São Paulo e região. Contato direto via WhatsApp.'
    );

    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 page-container">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section 
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay escuro (opacity ~0.6) */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-amber-400/30">
              <Car className="w-4 h-4" />
              Motoristas verificados
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Motoristas particulares em{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Aparecida do Norte
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Encontre motoristas de confiança para translados, tours religiosos e viagens pela região.
              Contato direto via WhatsApp.
            </p>

            {/* Barra de busca */}
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, cidade ou veículo..."
                id="busca-motoristas"
                className="
                  w-full pl-12 pr-4 py-4 rounded-2xl
                  bg-white/95 backdrop-blur-sm
                  text-gray-800 placeholder-gray-400
                  border border-white/20
                  shadow-xl shadow-black/10
                  focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                  transition-all duration-300
                  text-base
                "
              />
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 80L48 72C96 64 192 48 288 42.7C384 37 480 43 576 48C672 53 768 59 864 56C960 53 1056 43 1152 40C1248 37 1344 43 1392 45.3L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* ── Seção de Benefícios ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-600 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Motoristas de Confiança</h3>
              <p className="text-xs text-gray-500 mt-0.5">Profissionais verificados e bem avaliados</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Resposta Rápida</h3>
              <p className="text-xs text-gray-500 mt-0.5">Contato direto via WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Veículos Confortáveis</h3>
              <p className="text-xs text-gray-500 mt-0.5">Do sedan ao van executiva</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid de Motoristas ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nossos Motoristas
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {motoristasFiltrados.length} motorista{motoristasFiltrados.length !== 1 ? 's' : ''} disponíve{motoristasFiltrados.length !== 1 ? 'is' : 'l'}
            </p>
          </div>
        </div>

        {motoristasFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {motoristasFiltrados.map((motorista) => (
              <MotoristaCard key={motorista.id} motorista={motorista} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhum motorista encontrado
            </h3>
            <p className="text-gray-500 text-sm">
              Tente buscar por outra cidade, nome ou tipo de veículo.
            </p>
          </div>
        )}
      </section>

      {/* ── SEO Content ──────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Transporte particular em Aparecida do Norte
            </h2>
            <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
              <p>
                Aparecida do Norte é o maior centro de turismo religioso do Brasil, recebendo milhões de visitantes anualmente.
                Contar com um motorista particular facilita o deslocamento dentro da cidade, entre hotéis, a Basílica Nacional
                e os pontos turísticos da região.
              </p>
              <p>
                Os motoristas listados nesta página oferecem translados para diversas cidades do Vale do Paraíba,
                incluindo Guaratinguetá, Lorena, Campos do Jordão, São José dos Campos e até São Paulo e Rio de Janeiro.
                Para caravanas e grupos maiores, há opções de vans com capacidade de até 15 passageiros.
              </p>
              <p>
                Todos os motoristas podem ser contatados diretamente pelo WhatsApp, sem intermediários.
                Combine valores, horários e roteiros personalizados para sua viagem. Para grupos de romaria,
                translados de aeroporto ou passeios turísticos, um motorista particular é sempre a opção mais cômoda
                e segura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA para motoristas ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-10 text-center shadow-xl overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-14 -left-14 w-56 h-56 bg-white/5 rounded-full" />
          
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              É motorista particular em Aparecida?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-6 max-w-xl mx-auto">
              Cadastre-se e apareça para milhares de visitantes que procuram transporte na cidade todos os meses.
            </p>
            <Link
              to="/planos-motoristas"
              className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Cadastrar meu serviço
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotoristasParticulares;
