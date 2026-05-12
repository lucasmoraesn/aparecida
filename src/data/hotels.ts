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
];

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}
