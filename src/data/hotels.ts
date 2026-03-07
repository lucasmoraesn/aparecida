export interface Hotel {
  name: string;
  rating: number;
  distance_from_basilica: string;
  whatsapp: string;
  slug: string;
  description: string;
  address: string;
  image: string;
}

// 10 fotos de hotel do Pexels distribuídas entre os 20 hotéis
const IMG = {
  classicExterior:
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
  cleanRoom:
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
  poolExterior:
    'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=800',
  warmFacade:
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
  elegantRoom:
    'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
  resortPool:
    'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
  modernRoom:
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
  cozyInn:
    'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg?auto=compress&cs=tinysrgb&w=800',
  lobby:
    'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800',
  boutiqueRoom:
    'https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export const hotels: Hotel[] = [
  {
    name: 'Hotel Rainha do Brasil',
    rating: 4.5,
    distance_from_basilica: '200m da Basílica',
    whatsapp: '5512991110001',
    slug: 'hotel-rainha-do-brasil',
    description:
      'Localizado a poucos passos da Basílica Nacional, o Hotel Rainha do Brasil oferece quartos confortáveis, café da manhã completo e estacionamento. Ideal para famílias e grupos de romaria.',
    address: 'R. Dom Pedro II, 100 – Centro, Aparecida - SP',
    image: IMG.classicExterior,
  },
  {
    name: 'Hotel Santo Graal',
    rating: 4.2,
    distance_from_basilica: '350m da Basílica',
    whatsapp: '5512991110002',
    slug: 'hotel-santo-graal',
    description:
      'Hotel bem localizado no centro de Aparecida, com quartos amplos, Wi-Fi gratuito e café da manhã reforçado. Atendimento especializado para grupos e caravanas de romeiros.',
    address: 'Av. Getúlio Vargas, 250 – Centro, Aparecida - SP',
    image: IMG.cleanRoom,
  },
  {
    name: 'Hotel Catedral',
    rating: 4.8,
    distance_from_basilica: '500m da Basílica',
    whatsapp: '5512991110003',
    slug: 'hotel-catedral',
    description:
      'Um dos hotéis mais tradicionais de Aparecida, com atendimento de qualidade, piscina, restaurante próprio e vista para o Santuário Nacional. Excelente opção para pernoites prolongados.',
    address: 'R. Catedral, 45 – Vila Santo Antônio, Aparecida - SP',
    image: IMG.poolExterior,
  },
  {
    name: 'Hotel Nossa Senhora Aparecida',
    rating: 4.0,
    distance_from_basilica: '700m da Basílica',
    whatsapp: '5512991110004',
    slug: 'hotel-nossa-senhora-aparecida',
    description:
      'Hotel com ambiente acolhedor e decoração religiosa, próximo ao centro e à Basílica. Ótima opção para peregrinos que buscam conforto e tranquilidade durante a romaria.',
    address: 'Av. Nossa Senhora Aparecida, 78 – Centro, Aparecida - SP',
    image: IMG.warmFacade,
  },
  {
    name: 'Hotel Santuário Inn',
    rating: 4.3,
    distance_from_basilica: '600m da Basílica',
    whatsapp: '5512991110005',
    slug: 'hotel-santuario-inn',
    description:
      'Hotel moderno com excelente localização, ar-condicionado em todos os quartos, café da manhã incluso e estacionamento gratuito. Recebe grupos e caravanas com planejamento especial.',
    address: 'R. Santuário, 200 – Jardim Brasil, Aparecida - SP',
    image: IMG.elegantRoom,
  },
  {
    name: 'Hotel São Benedito',
    rating: 3.8,
    distance_from_basilica: '900m da Basílica',
    whatsapp: '5512991110006',
    slug: 'hotel-sao-benedito',
    description:
      'Hotel econômico com boa relação custo-benefício, ideal para grupos e caravanas. Quartos simples e limpos, café da manhã incluído e próximo ao terminal de ônibus da cidade.',
    address: 'Rua São Benedito, 33 – Centro, Aparecida - SP',
    image: IMG.resortPool,
  },
  {
    name: 'Hotel Porta do Céu',
    rating: 4.6,
    distance_from_basilica: '450m da Basílica',
    whatsapp: '5512991110007',
    slug: 'hotel-porta-do-ceu',
    description:
      'Hotel boutique de charme com decoração inspirada na fé e tradição religiosa de Aparecida. Quartos espaçosos, piscina aquecida e salão de eventos para grupos.',
    address: 'Alameda Sagrada, 12 – Jardim das Rosas, Aparecida - SP',
    image: IMG.modernRoom,
  },
  {
    name: 'Hotel Basílica',
    rating: 4.7,
    distance_from_basilica: '150m da Basílica',
    whatsapp: '5512991110008',
    slug: 'hotel-basilica',
    description:
      'O hotel mais próximo da Basílica Nacional, perfeito para quem deseja participar das primeiras missas da manhã e das celebrações ao longo do dia. Café da manhã farto e quartos climatizados.',
    address: 'Praça Dom Bosco, 5 – Centro, Aparecida - SP',
    image: IMG.lobby,
  },
  {
    name: 'Pousada do Peregrino',
    rating: 4.1,
    distance_from_basilica: '1,2km da Basílica',
    whatsapp: '5512991110009',
    slug: 'pousada-do-peregrino',
    description:
      'Pousada aconchegante com atmosfera familiar, ideal para peregrinos e viajantes solo. Café da manhã caseiro, jardim tranquilo e proprietários que conhecem bem a cidade.',
    address: 'R. Peregrino Tomás, 88 – Vila Nova, Aparecida - SP',
    image: IMG.cozyInn,
  },
  {
    name: 'Hotel João XXIII',
    rating: 3.9,
    distance_from_basilica: '1,5km da Basílica',
    whatsapp: '5512991110010',
    slug: 'hotel-joao-xxiii',
    description:
      'Hotel simples e bem cuidado, com acesso fácil ao centro e à Basílica por caminhada. Ótimo para grupos em evento ou caravana que precisam de hospedagem acessível.',
    address: 'Av. João XXIII, 310 – Jardim Aparecida, Aparecida - SP',
    image: IMG.boutiqueRoom,
  },
  {
    name: 'Hotel Aparecida Park',
    rating: 4.4,
    distance_from_basilica: '800m da Basílica',
    whatsapp: '5512991110011',
    slug: 'hotel-aparecida-park',
    description:
      'Hotel com área de lazer completa, piscina, restaurante e salão de eventos. Excelente para famílias que desejam combinar a visita religiosa com descanso e lazer.',
    address: 'R. das Palmeiras, 55 – Jardim Paraíso, Aparecida - SP',
    image: IMG.cleanRoom,
  },
  {
    name: 'Pousada Santa Terezinha',
    rating: 4.2,
    distance_from_basilica: '1km da Basílica',
    whatsapp: '5512991110012',
    slug: 'pousada-santa-terezinha',
    description:
      'Pousada familiar com quartos individuais, duplos e familiares. Café da manhã caseiro, ambiente silencioso e localização tranquila, a 10 minutos a pé da Basílica.',
    address: 'R. Santa Terezinha, 70 – Bairro Sagrado, Aparecida - SP',
    image: IMG.warmFacade,
  },
  {
    name: 'Hotel Esperança',
    rating: 3.7,
    distance_from_basilica: '1,8km da Basílica',
    whatsapp: '5512991110013',
    slug: 'hotel-esperanca',
    description:
      'Hotel de categoria econômica com quartos confortáveis e café da manhã incluído. Indicado para peregrinos que buscam economizar na hospedagem e têm disponibilidade para caminhar até a Basílica.',
    address: 'R. da Esperança, 120 – Vila Operária, Aparecida - SP',
    image: IMG.elegantRoom,
  },
  {
    name: 'Hotel dos Romeiros',
    rating: 4.5,
    distance_from_basilica: '550m da Basílica',
    whatsapp: '5512991110014',
    slug: 'hotel-dos-romeiros',
    description:
      'Hotel especializado no atendimento de romeiros e grupos, com serviço de transfer, café da manhã reforçado e capacidade para grandes delegações de paróquias e pastorais.',
    address: 'Av. dos Romeiros, 180 – Centro, Aparecida - SP',
    image: IMG.poolExterior,
  },
  {
    name: 'Hotel Bela Vista Aparecida',
    rating: 4.6,
    distance_from_basilica: '1,3km da Basílica',
    whatsapp: '5512991110015',
    slug: 'hotel-bela-vista-aparecida',
    description:
      'Hotel com vista privilegiada para a Serra da Mantiqueira e o Santuário Nacional. Piscina, restaurante e área de eventos para até 150 pessoas. Ótimo para retiros e encontros espirituais.',
    address: 'R. do Mirante, 9 – Alto da Boa Vista, Aparecida - SP',
    image: IMG.resortPool,
  },
  {
    name: 'Pousada do Santuário',
    rating: 4.3,
    distance_from_basilica: '300m da Basílica',
    whatsapp: '5512991110016',
    slug: 'pousada-do-santuario',
    description:
      'Pousada charmosa e bem localizada, a dois minutos a pé da entrada principal do Santuário. Quartos simples e confortáveis, ambiente tranquilo e proprietários simpáticos.',
    address: 'Beco das Flores, 6 – Centro Histórico, Aparecida - SP',
    image: IMG.modernRoom,
  },
  {
    name: 'Hotel Guanabara Aparecida',
    rating: 3.6,
    distance_from_basilica: '2km da Basílica',
    whatsapp: '5512991110017',
    slug: 'hotel-guanabara-aparecida',
    description:
      'Hotel de bom custo-benefício, com estacionamento amplo e fácil acesso pela Rodovia Presidente Dutra. Indicado para caravanas que chegam de ônibus fretado.',
    address: 'Rod. Presidente Dutra, km 62 – Aparecida - SP',
    image: IMG.cozyInn,
  },
  {
    name: 'Hotel Dom Bosco',
    rating: 4.0,
    distance_from_basilica: '750m da Basílica',
    whatsapp: '5512991110018',
    slug: 'hotel-dom-bosco',
    description:
      'Hotel com café da manhã completo, Wi-Fi em todos os ambientes e quartos familiares para até 6 pessoas. Boa opção para grupos escolares e passeios de jovens da paróquia.',
    address: 'R. Dom Bosco, 44 – Jardim Salesianos, Aparecida - SP',
    image: IMG.boutiqueRoom,
  },
  {
    name: 'Hotel Central Aparecida',
    rating: 4.1,
    distance_from_basilica: '400m da Basílica',
    whatsapp: '5512991110019',
    slug: 'hotel-central-aparecida',
    description:
      'Bem localizado no coração da cidade, próximo às principais lojas religiosas e restaurantes. Café da manhã incluso, quartos climatizados e recepção 24 horas.',
    address: 'R. Sete de Setembro, 220 – Centro, Aparecida - SP',
    image: IMG.classicExterior,
  },
  {
    name: 'Pousada Nossa Vivenda',
    rating: 4.4,
    distance_from_basilica: '1,1km da Basílica',
    whatsapp: '5512991110020',
    slug: 'pousada-nossa-vivenda',
    description:
      'Pousada com ambiente bucólico, jardim florido e café da manhã caseiro preparado diariamente. Ideal para casais e famílias que buscam sossego e aconchego durante a visita à cidade.',
    address: 'Estr. da Vivenda, 30 – Sítio do Piqueri, Aparecida - SP',
    image: IMG.lobby,
  },
];

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}
