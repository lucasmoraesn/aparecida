export interface CategoryOption {
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  path: string;
  description: string;
  icon?: string;
  options: CategoryOption[];
}

export const categories: Category[] = [
  {
    id: 'hoteis',
    name: 'Hotéis e Pousadas',
    path: '/hoteis',
    description: 'Encontre hospedagem próxima à Basílica',
    options: [
      { name: 'Hotéis', description: 'Hotéis com (4-5 estrelas) próximos à Basílica' },
      { name: 'Pousadas', description: 'Pousadas aconchegantes com preço justo' },
      { name: 'Tudo', description: 'Ver todos hotéis e pousadas' }
    ]
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes',
    path: '/restaurantes',
    description: 'Descubra onde comer em Aparecida',
    options: [
      { name: 'Restaurantes', description: 'Restaurantes com pratos variados' },
      { name: 'Lanchonetes', description: 'Lanchonetes rápidas e acessíveis' },
      { name: 'Cafés', description: 'Cafés e casarões típicos' },
      { name: 'Tudo', description: 'Ver todos os restaurantes' }
    ]
  },
  {
    id: 'lojas',
    name: 'Lojas Religiosas',
    path: '/lojas-religiosas',
    description: 'Artigos religiosos e souvenirs',
    options: [
      { name: 'Artigos Religiosos', description: 'Imagens, terços e velas' },
      { name: 'Lembranças', description: 'Souvenirs e presentes típicos' },
      { name: 'Livros Religiosos', description: 'Bíblias e literatura católica' },
      { name: 'Tudo', description: 'Ver todas as lojas' }
    ]
  },
  {
    id: 'pontos-turisticos',
    name: 'Pontos Turísticos',
    path: '/pontos-turisticos',
    description: 'Conheça as principais atrações',
    options: [
      { name: 'Santuários', description: 'Basílica Nacional e Basílica Velha' },
      { name: 'Museus', description: 'Museus e centros de eventos' },
      { name: 'Mirantes', description: 'Pontos com vista panorâmica' },
      { name: 'Tudo', description: 'Ver todas as atrações' }
    ]
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryByPath = (path: string): Category | undefined => {
  // Check both the discovery route and the direct listing route
  const normalizedPath = path.replace(/-em-aparecida-sp$/, '');
  return categories.find(cat => cat.path === normalizedPath || cat.path === path);
};
