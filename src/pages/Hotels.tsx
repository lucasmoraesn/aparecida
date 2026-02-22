import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Star } from 'lucide-react';
import BookingSearch from '../components/BookingSearch';

const bookingAffiliateURL = 'https://tidd.ly/4puN43K';

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
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Hotéis em Aparecida SP perto da Basílica
            </h1>
          </div>

          <div className="max-w-4xl mx-auto text-gray-700 space-y-4 leading-relaxed px-2 sm:px-0">
            <p>
              Aparecida (SP) é o principal destino de turismo religioso do Brasil e recebe milhões de visitantes ao longo do ano. Em datas de grande devoção, como a Novena e a Festa da Padroeira (12 de Outubro), a cidade costuma registrar alta procura por hospedagem e vários hotéis ficam com disponibilidade limitada rapidamente. Reservar com antecedência é a melhor forma de garantir acomodações próximas ao Santuário Nacional, evitar deslocamentos longos e garantir uma experiência tranquila para romeiros, famílias e grupos organizados.
            </p>
            <p>
              Se hospedar perto da Basílica facilita o acesso às celebrações, missas e atrações do complexo, como a Passarela da Fé, o Mirante e o Centro de Eventos. Para caravanas e romarias, estar na região central reduz o tempo de transporte e ajuda na logística de grupos. Famílias com crianças e idosos também se beneficiam ao escolher hotéis com comodidades como Wi-Fi, café da manhã, estacionamento e quartos acessíveis. Nossa recomendação é sempre verificar disponibilidade e condições atualizadas antes de confirmar a viagem.
            </p>
          
            
          </div>

          <div className="mt-10">
            <BookingSearch />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Onde se hospedar em Aparecida</h2>
          <p className="text-gray-700">
            Confira abaixo as opções de hospedagem próximas à Basílica e na região central, com acesso rápido às principais celebrações e pontos de interesse do Santuário Nacional.
          </p>
        </section>

        <section aria-labelledby="hotels-partners" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 id="hotels-partners" className="text-2xl font-bold text-gray-900">Hotéis Parceiros</h2>
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm">
              Hotel Parceiro Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Estado vazio: sem informações fictícias */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-sm mb-3">
                  Destaque da Semana
                </div>
                <p className="text-gray-700 mb-4">
                  Em breve você verá aqui os Hotéis Parceiros oficiais, com contato direto pelo WhatsApp, endereço e comodidades. Não exibimos preços fixos nem avaliações estáticas.
                </p>
                <Link
                  to="/cadastrar-negocio"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Quero anunciar meu hotel
                </Link>
              </div>
            </div>
          </div>
        </section>

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

        <section aria-labelledby="commercial" className="mb-20">
          <h2 id="commercial" className="text-2xl font-bold text-gray-900 mb-4">Anuncie seu hotel aqui</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-700 mb-4">
              Alcance público turístico qualificado com interesse em hospedagem próxima ao Santuário. Seu hotel pode ganhar destaque no portal, com selo de parceiro oficial e contato direto pelo WhatsApp.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Alcance turístico e público religioso qualificado</li>
              <li>Possibilidade de destaque com selo “Hotel Parceiro Oficial”</li>
              <li>Integração simples e atendimento direto ao cliente</li>
            </ul>
            <Link
              to="/cadastrar-negocio"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Quero anunciar meu hotel
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hotels;
