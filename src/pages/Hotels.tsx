import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingSearch from '../components/BookingSearch';
import HotelCard from '../components/HotelCard';
import { hotels } from '../data/hotels';

const bookingAffiliateURL = 'https://www.awin1.com/cread.php?awinmid=18120&awinaffid=2711492&ued=https%3A%2F%2Fwww.booking.com%2Fcity%2Fbr%2Faparecida.pt-br.html';

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
    <div className="min-h-screen bg-gray-50 page-container">

      {/* ── Banda branca: SEO header ───────────────────────────── */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Hotéis em Aparecida SP perto da Basílica
            </h1>
            <p className="mt-2 text-base text-gray-500 font-medium">
              Mais de {hotels.length} hotéis em Aparecida SP
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-gray-700 space-y-4 leading-relaxed px-2 sm:px-0 mt-6">
            {/* CTA 1 – comparador de preços */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 text-base">Compare preços de hotéis em Aparecida</p>
                <p className="text-gray-600 text-sm mt-0.5">Veja disponibilidade e preços em dezenas de hotéis próximos da Basílica.</p>
              </div>
              <a
                href={bookingAffiliateURL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Ver preços e disponibilidade
              </a>
            </div>

            <p>
              Aparecida (SP) é o principal destino de turismo religioso do Brasil e recebe milhões de visitantes ao longo do ano. Em datas de grande devoção, como a Novena e a Festa da Padroeira (12 de Outubro), a cidade costuma registrar alta procura por hospedagem e vários hotéis ficam com disponibilidade limitada rapidamente. Reservar com antecedência é a melhor forma de garantir acomodações próximas ao Santuário Nacional, evitar deslocamentos longos e garantir uma experiência tranquila para romeiros, famílias e grupos organizados.
            </p>
            <p>
              Se hospedar perto da Basílica facilita o acesso às celebrações, missas e atrações do complexo, como a Passarela da Fé, o Mirante e o Centro de Eventos. Para caravanas e romarias, estar na região central reduz o tempo de transporte e ajuda na logística de grupos. Famílias com crianças e idosos também se beneficiam ao escolher hotéis com comodidades como Wi-Fi, café da manhã, estacionamento e quartos acessíveis. Nossa recomendação é sempre verificar disponibilidade e condições atualizadas antes de confirmar a viagem.
            </p>
          </div>
        </div>
      </div>

      {/* ── Banda azul: bloco de busca ────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase">
              Buscar Hospedagem em Aparecida
            </h2>
            <p className="mt-2 text-blue-100 text-base sm:text-lg">
              Compare preços e disponibilidade em dezenas de hotéis próximos da Basílica.
            </p>
          </div>
          <BookingSearch />
        </div>
      </div>

      {/* ── Conteúdo principal ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Separador + cards de hotéis parceiros */}
        <section aria-labelledby="hotels-partners" className="mb-16">
          <div className="flex items-center gap-4 py-8">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm font-semibold text-gray-500 tracking-widest uppercase whitespace-nowrap">
              Ou reserve diretamente com hotéis parceiros
            </span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.slug} hotel={hotel} />
            ))}
          </div>
        </section>

        {/* Booking affiliate */}
        <section aria-labelledby="other-options" className="mb-16">
          <h2 id="other-options" className="text-2xl font-bold text-gray-900 mb-6">Outras opções em Aparecida</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src="/aparecida.jpg"
                  alt="hotel em aparecida sp perto da basílica de aparecida"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ver opções na Booking</h3>
                <p className="text-gray-700 mb-4">
                  Acesse a página de Aparecida na Booking para conferir hotéis disponíveis, fotos reais e avaliações dos hóspedes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={bookingAffiliateURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
                  >
                    Ver preço atualizado
                  </a>
                  <a
                    href={bookingAffiliateURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
                  >
                    Reservar na Booking
                  </a>
                </div>
                <div className="mt-3">
                  <a
                    href={bookingAffiliateURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver avaliações na Booking
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO content */}
        <section aria-labelledby="social-proof" className="mb-16">
          <h2 id="social-proof" className="text-2xl font-bold text-gray-900 mb-4">Hotel perto da Basílica</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-700">
              Aparecida recebe grande fluxo de visitantes durante todo o ano. Em datas como 12 de Outubro, a demanda por hospedagem aumenta significativamente e as vagas se esgotam com rapidez. Para garantir disponibilidade, recomendamos reservar com antecedência e considerar hotéis próximos ao Santuário Nacional, facilitando deslocamentos e acesso às celebrações.
            </p>
          </div>
        </section>

        <section aria-labelledby="budget-stays" className="mb-16">
          <h3 id="budget-stays" className="text-xl font-semibold text-gray-900 mb-3">Hospedagem econômica em Aparecida</h3>
          <p className="text-gray-700">
            Para romarias, famílias e grupos, opções econômicas próximas ao centro podem oferecer ótimo custo-benefício. Verifique sempre as comodidades mais importantes para sua viagem e utilize os links para conferir preços atualizados e avaliações reais.
          </p>
        </section>

        {/* Main CTA */}
        <section aria-labelledby="cta-owners" className="mb-20">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 sm:p-10 text-center shadow-lg">
            <h2 id="cta-owners" className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Tem um hotel ou pousada em Aparecida?
            </h2>
            <p className="text-green-100 text-base sm:text-lg mb-6 max-w-xl mx-auto">
              Cadastre gratuitamente e apareça para milhares de peregrinos que visitam a cidade todos os anos.
            </p>
            <Link
              to="/cadastrar-negocio"
              className="inline-flex items-center justify-center bg-white text-green-700 hover:bg-green-50 font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-colors shadow"
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
