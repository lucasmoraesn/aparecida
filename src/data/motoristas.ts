export interface Motorista {
  id: string;
  nome: string;
  foto: string;
  foto_url?: string;
  telefone: string;
  whatsapp?: string;
  veiculo: string;
  passageiros: number;
  cidades: string[] | string;
  descricao: string;
  destaque: boolean;
  ativo?: boolean;
  plano?: string;
  verificado?: boolean;
}

export const motoristas: Motorista[] = [
  {
    id: 'motorista-001',
    nome: 'Carlos Eduardo Silva',
    foto: '/motorista-1.png',
    telefone: '5512991110030',
    veiculo: 'Sedan Executivo (Toyota Corolla)',
    passageiros: 4,
    cidades: ['Aparecida', 'Guaratinguetá', 'Lorena', 'Cachoeira Paulista', 'São Paulo'],
    descricao: 'Motorista experiente com mais de 10 anos atendendo romeiros e turistas na região. Veículo com ar-condicionado, Wi-Fi e água. Pontualidade garantida.',
    destaque: true,
  },
  {
    id: 'motorista-002',
    nome: 'Ana Paula Oliveira',
    foto: '/motorista-2.png',
    telefone: '5512991110031',
    veiculo: 'SUV Confortável (Jeep Compass)',
    passageiros: 4,
    cidades: ['Aparecida', 'Guaratinguetá', 'Cunha', 'Campos do Jordão', 'Taubaté'],
    descricao: 'Especialista em tours religiosos e turísticos pela região do Vale do Paraíba. Veículo espaçoso, seguro e confortável para famílias.',
    destaque: true,
  },
  {
    id: 'motorista-003',
    nome: 'Roberto Mendes',
    foto: '/motorista-3.png',
    telefone: '5512991110032',
    veiculo: 'Van Executiva (Mercedes Sprinter)',
    passageiros: 15,
    cidades: ['Aparecida', 'São Paulo', 'Rio de Janeiro', 'Guaratinguetá', 'Lorena', 'Campos do Jordão'],
    descricao: 'Van para grupos, caravanas e romarias. Atende translados de aeroportos, rodoviárias e excursões regionais. Seguro de passageiros incluso.',
    destaque: true,
  },
  {
    id: 'motorista-004',
    nome: 'José Antônio Pereira',
    foto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    telefone: '5512991110033',
    veiculo: 'Sedan Confortável (Honda Civic)',
    passageiros: 4,
    cidades: ['Aparecida', 'Guaratinguetá', 'Pindamonhangaba', 'Taubaté'],
    descricao: 'Motorista particular com conhecimento profundo da cidade. Ideal para passeios turísticos e translados rápidos na região.',
    destaque: false,
  },
  {
    id: 'motorista-005',
    nome: 'Marcos Ribeiro Santos',
    foto: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    telefone: '5512991110034',
    veiculo: 'Minivan (Chevrolet Spin)',
    passageiros: 7,
    cidades: ['Aparecida', 'Guaratinguetá', 'Lorena', 'Cruzeiro', 'Queluz'],
    descricao: 'Motorista familiar com veículo para até 7 passageiros. Ótimo para famílias maiores e grupos pequenos que visitam a Basílica.',
    destaque: false,
  },
  {
    id: 'motorista-006',
    nome: 'Fernanda Costa Lima',
    foto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    telefone: '5512991110035',
    veiculo: 'SUV Premium (Hyundai Tucson)',
    passageiros: 4,
    cidades: ['Aparecida', 'Campos do Jordão', 'São José dos Campos', 'São Paulo', 'Aeroporto GRU'],
    descricao: 'Translados de aeroporto e viagens intermunicipais com conforto e segurança. Veículo climatizado e com carregador USB.',
    destaque: false,
  },
];

/**
 * Retorna motoristas ordenados: destaques primeiro, depois os demais.
 */
export function getMotoristasOrdenados(): Motorista[] {
  return [...motoristas].sort((a, b) => {
    if (a.destaque && !b.destaque) return -1;
    if (!a.destaque && b.destaque) return 1;
    return 0;
  });
}
