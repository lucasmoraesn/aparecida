import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingSearch from '../components/BookingSearch';
import HotelCard from '../components/HotelCard';
import { hotels } from '../data/hotels';

const Hotels = () => {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';
    document.title = 'Hotéis em Aparecida SP perto da Basílica';
    meta?.setAttribute('content', 'Reserve com antecedência hospedagem em Aparecida (SP). Encontre hotéis perto da Basílica, veja disponibilidade na Booking e fale direto com hotéis parceiros pelo WhatsApp. Portal independente com foco em romarias e famílias.');
    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white page-container">

      {/* ── HERO: busca principal via Booking ─────────────────── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Encontre hotéis em Aparecida perto da Basílica
            </h1>
            <p className="mt-3 text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
              Compare preços em dezenas de hotéis via Booking — escolha as datas e veja disponibilidade em segundos.
            </p>
          </div>
          <BookingSearch />
        </div>
      </div>

      {/* ── Texto SEO ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-700 space-y-4 leading-relaxed">
        <p>
          Aparecida (SP) é o principal destino de turismo religioso do Brasil e recebe milhões de visitantes ao longo do ano. Em datas de grande devoção, como a Novena e a Festa da Padroeira (12 de Outubro), a cidade costuma registrar alta procura por hospedagem e vários hotéis ficam com disponibilidade limitada rapidamente. Reservar com antecedência é a melhor forma de garantir acomodações próximas ao Santuário Nacional.
        </p>
        <p>
          Se hospedar perto da Basílica facilita o acesso às celebrações, missas e atrações do complexo, como a Passarela da Fé, o Mirante e o Centro de Eventos. Para caravanas e romarias, estar na região central reduz o tempo de transporte e ajuda na logística de grupos.
        </p>
      </div>

      {/* ── Divisor forte ─────────────────────────────────────── */}
      <div className="border-t-4 border-gray-200">
        <div className="flex items-center justify-center py-4 px-4">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase whitespace-nowrap">
              Área para hotéis parceiros
            </span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
        </div>
      </div>

      {/* ── Seção de hotéis parceiros ─────────────────────────── */}
      <section aria-labelledby="hotels-partners" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-8">
            <h2 id="hotels-partners" className="text-xl font-semibold text-gray-600">
              Hotéis parceiros em destaque
            </h2>
            <p className="text-sm text-gray-400 mt-1">Em breve mais opções disponíveis</p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 inline-block mt-3 px-4 py-2 rounded-full">
              Estes são exemplos. Hotéis reais aparecerão aqui após cadastro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.slug} hotel={hotel} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── Conteúdo SEO + CTA ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

<section aria-labelledby="budget-stays" className="mb-12">
          <h3 id="budget-stays" className="text-xl font-semibold text-gray-900 mb-3">Hospedagem econômica em Aparecida</h3>
          <p className="text-gray-700">
            Para romarias, famílias e grupos, opções econômicas próximas ao centro podem oferecer ótimo custo-benefício. Verifique sempre as comodidades mais importantes para sua viagem e utilize os links para conferir preços atualizados e avaliações reais.
          </p>
        </section>

        {/* CTA menor — não compete com a busca principal */}
        <section aria-labelledby="cta-owners" className="mb-16">
          <div className="bg-green-600 rounded-xl p-6 text-center">
            <h2 id="cta-owners" className="text-xl font-bold text-white mb-2">
              Tem um hotel em Aparecida?
            </h2>
            <p className="text-green-100 text-sm mb-4 max-w-md mx-auto">
              Cadastre gratuitamente e apareça para milhares de peregrinos que visitam a cidade todos os anos.
            </p>
            <Link
              to="/cadastrar-negocio"
              className="inline-flex items-center justify-center bg-white text-green-700 hover:bg-green-50 font-bold text-sm px-6 py-3 rounded-lg transition-colors shadow"
            >
              Cadastrar meu hotel
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hotels;
