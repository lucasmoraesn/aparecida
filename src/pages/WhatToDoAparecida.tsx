import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const bookingAffiliateURL =
  'https://www.awin1.com/cread.php?awinmid=18120&awinaffid=2711492&ued=https%3A%2F%2Fwww.booking.com%2Fcity%2Fbr%2Faparecida.pt-br.html';

const attractions = [
  {
    name: 'Basílica de Nossa Senhora Aparecida',
    description:
      'O principal santuário mariano do Brasil e um dos maiores do mundo. A Basílica Nacional comporta até 45 mil fiéis e recebe mais de 12 milhões de visitantes por ano. É o coração espiritual da cidade e ponto de chegada de romeiros de todo o país.',
    tip: 'Chegue cedo para participar das missas e evitar filas nos dias de maior movimento.',
    icon: '⛪',
  },
  {
    name: 'Passarela da Fé',
    description:
      'Corredor de pedestres que liga a Basílica Nova à Basílica Velha, repleto de lojas de artigos religiosos, restaurantes e barracas de comida típica. O percurso de aproximadamente 700 metros é o centro comercial e devocional da cidade.',
    tip: 'O melhor horário para passear é logo pela manhã ou no fim da tarde, quando o movimento é menor.',
    icon: '🚶',
  },
  {
    name: 'Morro do Cruzeiro',
    description:
      'Ponto mais alto de Aparecida, com uma grande cruz iluminada no topo e vista panorâmica da cidade, do Rio Paraíba e da Basílica. O acesso pode ser feito a pé pela trilha ou de carro pelo caminho alternativo.',
    tip: 'A vista ao entardecer é um dos cenários mais bonitos da cidade.',
    icon: '✝️',
  },
  {
    name: 'Porto Itaguaçu',
    description:
      'Área de lazer às margens do Rio Paraíba do Sul com opções de passeios de barco, pesca esportiva, quiosques e restaurantes. É um contraponto agradável à intensa rotina religiosa da cidade.',
    tip: 'Combine a visita com um almoço de peixe fresco nos restaurantes beira-rio.',
    icon: '⛵',
  },
  {
    name: 'Teleférico',
    description:
      'Passeio aéreo que oferece uma vista privilegiada da cidade e da Basílica. O teleférico conecta dois pontos da cidade em trajeto de aproximadamente 10 minutos, sendo uma atração muito procurada por famílias.',
    tip: 'Dias de semana têm menor espera. Verifique o horário de funcionamento antes de visitar.',
    icon: '🚡',
  },
  {
    name: 'Museu de Cera',
    description:
      'Museu com figuras em cera de personagens religiosos e históricos, incluindo papas, santos e líderes mundiais. É uma atração diferenciada especialmente para crianças e grupos de excursão.',
    tip: 'A entrada é paga. Ideal para visitar no início do dia antes das grandes filas.',
    icon: '🎨',
  },
  {
    name: 'Trem do Devoto',
    description:
      'Passeio de trem turístico que percorre trechos históricos da cidade, passando por pontos religiosos e culturais. Uma forma charmosa e diferente de conhecer Aparecida, com narração sobre a história da cidade.',
    tip: 'Consulte a programação e horários diretamente com a operadora, pois as saídas são em horários fixos.',
    icon: '🚂',
  },
];

const WhatToDoAparecida = () => {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';

    document.title = 'O que fazer em Aparecida SP – Guia de Turismo';
    meta?.setAttribute(
      'content',
      'Descubra o que fazer em Aparecida SP: Basílica Nacional, Passarela da Fé, Morro do Cruzeiro, Porto Itaguaçu, Teleférico, Museu de Cera e Trem do Devoto. Guia completo de turismo para romeiros e visitantes.'
    );

    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28">

      {/* ── Banda branca: header SEO ──────────────────────────── */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              O que fazer em Aparecida SP – guia de turismo
            </h1>
          </div>

          <div className="max-w-4xl mx-auto text-gray-700 space-y-4 leading-relaxed">
            <p>
              Aparecida do Norte, no interior de São Paulo, é a capital da fé do Brasil. Com a{' '}
              <strong>Basílica Nacional de Nossa Senhora Aparecida</strong> — o maior santuário
              mariano do mundo em número de visitantes —, a cidade recebe anualmente mais de{' '}
              <strong>12 milhões de romeiros e turistas</strong> de todas as regiões do país e do
              exterior.
            </p>
            <p>
              Além da dimensão religiosa, Aparecida oferece atrações culturais, gastronômicas e de
              lazer que tornam a visita ainda mais completa. Seja você um peregrino em busca de fé ou
              um turista curioso pela história local, este guia reúne os <strong>principais pontos
              turísticos de Aparecida SP</strong> para ajudar no planejamento da sua visita.
            </p>

            {/* CTA hospedagem */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div>
                <p className="font-semibold text-gray-900 text-base">
                  Compare preços de hotéis em Aparecida
                </p>
                <p className="text-gray-600 text-sm mt-0.5">
                  Veja disponibilidade em dezenas de hotéis próximos da Basílica.
                </p>
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
          </div>
        </div>
      </div>

      {/* ── Conteúdo principal ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Lista de atrações */}
        <section aria-labelledby="principais-atracoes" className="mb-16">
          <h2
            id="principais-atracoes"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Principais pontos turísticos de Aparecida SP
          </h2>
          <p className="text-gray-600 mb-8">
            Confira os locais imperdíveis para incluir no seu roteiro.
          </p>

          <div className="space-y-6">
            {attractions.map((item, index) => (
              <div
                key={item.name}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex gap-5"
              >
                <div className="text-3xl leading-none shrink-0 mt-1" aria-hidden="true">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    <span className="text-blue-600 mr-2 font-normal text-sm">
                      #{index + 1}
                    </span>
                    {item.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">{item.description}</p>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                    <span className="shrink-0 font-semibold">Dica:</span>
                    <span>{item.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bloco afiliado Booking */}
        <section aria-labelledby="hospedagem-aparecida" className="mb-16">
          <div className="bg-blue-600 rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg">
            <div>
              <h2 id="hospedagem-aparecida" className="text-2xl font-bold mb-1">
                Compare preços de hotéis em Aparecida
              </h2>
              <p className="text-blue-100">
                Veja disponibilidade em dezenas de hotéis próximos da Basílica.
              </p>
            </div>
            <a
              href={bookingAffiliateURL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-colors shadow whitespace-nowrap"
            >
              Ver disponibilidade
            </a>
          </div>
        </section>

        {/* Dicas gerais */}
        <section aria-labelledby="dicas-visita" className="mb-16">
          <h2 id="dicas-visita" className="text-2xl font-bold text-gray-900 mb-4">
            Dicas para planejar sua visita a Aparecida
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3 text-gray-700">
            <p>
              <strong>Melhor época para visitar:</strong> a cidade recebe visitantes o ano inteiro,
              mas outubro é o mês de maior movimento por conta da Festa da Padroeira no dia 12.
              Reservas de hotel devem ser feitas com meses de antecedência para este período.
            </p>
            <p>
              <strong>Como se locomover:</strong> o centro da cidade é bastante compacto e pode ser
              percorrido a pé. Para o Morro do Cruzeiro e o Porto Itaguaçu, um carro ou aplicativo
              de transporte facilita o deslocamento.
            </p>
            <p>
              <strong>Tempo mínimo recomendado:</strong> para visitar os principais pontos com
              calma, planeje pelo menos 2 dias na cidade. Isso permite participar de celebrações,
              explorar a Passarela da Fé e ainda conhecer as atrações fora do circuito principal.
            </p>
          </div>
        </section>

        {/* CTA pontos turísticos do portal */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 sm:p-10 text-center shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Explore mais atrações no portal
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-6 max-w-xl mx-auto">
              Confira o diretório completo de pontos turísticos, restaurantes e lojas religiosas de
              Aparecida do Norte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/pontos-turisticos-em-aparecida-sp"
                className="inline-flex items-center justify-center bg-white text-blue-800 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors shadow"
              >
                Ver pontos turísticos
              </Link>
              <Link
                to="/hoteis-em-aparecida-sp"
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow"
              >
                Ver hotéis parceiros
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default WhatToDoAparecida;
