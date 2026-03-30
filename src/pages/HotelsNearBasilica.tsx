import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import { hotels } from '../data/hotels';

const bookingAffiliateURL = 'https://www.awin1.com/cread.php?awinmid=18120&awinaffid=2711492&ued=https%3A%2F%2Fwww.booking.com%2Fcity%2Fbr%2Faparecida.pt-br.html';

const HotelsNearBasilica = () => {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';
    document.title = 'Hotéis perto da Basílica de Aparecida (até 500 metros)';
    meta?.setAttribute('content', 'Encontre hotéis a até 500 metros da Basílica Nacional de Aparecida SP. Compare preços na Booking, reserve com antecedência e hospede-se pertinho do Santuário. Ideal para romeiros, famílias e grupos de excursão.');
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
              Hotéis perto da Basílica de Aparecida (até 500 metros)
            </h1>
            <p className="mt-2 text-base text-gray-500 font-medium">
              {hotels.length} hotéis parceiros próximos ao Santuário Nacional
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-gray-700 space-y-4 leading-relaxed px-2 sm:px-0 mt-6">

            {/* CTA – comparador de preços */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 text-base">Compare preços de hotéis perto da Basílica</p>
                <p className="text-gray-600 text-sm mt-0.5">Veja disponibilidade e preços dos hotéis mais próximos do Santuário Nacional.</p>
              </div>
              <a
                href={bookingAffiliateURL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Ver disponibilidade
              </a>
            </div>

            <p>
              Hospedar-se a menos de 500 metros da Basílica Nacional de Aparecida é a escolha ideal para romeiros, famílias e grupos de excursão que desejam comodidade e proximidade às celebrações. Em datas de grande devoção, como a Novena e a Festa da Padroeira (12 de Outubro), hotéis nessa faixa de distância se esgotam rapidamente — reservar com antecedência é fundamental para garantir sua vaga.
            </p>
            <p>
              A poucos passos do Santuário, você tem acesso direto às missas, à Passarela da Fé, ao Museu Nossa Senhora Aparecida e ao complexo de lojas e alimentação do entorno. Para grupos com idosos ou crianças pequenas, a proximidade elimina a necessidade de transporte e reduz o cansaço durante a peregrinação. Confira abaixo os hotéis parceiros do portal e verifique disponibilidade diretamente com cada estabelecimento pelo WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* ── Conteúdo principal ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hotéis parceiros próximos da Basílica */}
        <section aria-labelledby="hotels-near-basilica" className="mb-16">
          <h2 id="hotels-near-basilica" className="text-2xl font-bold text-gray-900 mb-2">
            Hotéis parceiros próximos da Basílica
          </h2>
          <p className="text-gray-600 mb-8">
            Hotéis com contato direto pelo WhatsApp. Reserve sem intermediários.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.slug} hotel={hotel} />
            ))}
          </div>
        </section>

        {/* Booking affiliate */}
        <section aria-labelledby="ver-mais-opcoes" className="mb-16">
          <h2 id="ver-mais-opcoes" className="text-2xl font-bold text-gray-900 mb-6">
            Mais opções de hospedagem em Aparecida
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Ver todos os hotéis na Booking</h3>
              <p className="text-gray-600 text-sm mt-1">
                Acesse dezenas de opções com fotos, avaliações reais e preços atualizados para Aparecida.
              </p>
            </div>
            <a
              href={bookingAffiliateURL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Ver opções na Booking
            </a>
          </div>
        </section>

        {/* SEO content */}
        <section aria-labelledby="dicas-hospedagem" className="mb-16">
          <h2 id="dicas-hospedagem" className="text-2xl font-bold text-gray-900 mb-4">
            Dicas para escolher seu hotel perto da Basílica
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3 text-gray-700">
            <p>
              <strong>Reservar com antecedência</strong> é essencial, especialmente para o período de outubro. Em datas como 12/10, alguns hotéis próximos ao Santuário chegam a lotar com meses de antecedência.
            </p>
            <p>
              <strong>Verifique a distância real</strong> até a Basílica antes de confirmar. Hotéis até 500 metros permitem deslocamento a pé, o que é muito mais prático para romarias com idosos e crianças.
            </p>
            <p>
              <strong>Pergunte sobre café da manhã e estacionamento</strong> — duas comodidades muito valorizadas por grupos de excursão. Muitos hotéis parceiros do portal oferecem esses serviços incluídos ou com valor adicional.
            </p>
          </div>
        </section>

        {/* CTA para proprietários */}
        <section aria-labelledby="cta-owners" className="mb-20">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 sm:p-10 text-center shadow-lg">
            <h2 id="cta-owners" className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Seu hotel está perto da Basílica?
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

export default HotelsNearBasilica;
