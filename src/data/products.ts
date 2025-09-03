import { Product } from '../contexts/CartContext';

export const products: Product[] = [
  // Produtos Masculinos
  {
    id: 1,
    name: "Camisa Social Azul",
    description: "Camisa social elegante em azul marinho, perfeita para ocasiões especiais",
    price: 89.90,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "masculino",
    stock: 15,
    rating: 4.5
  },
  {
    id: 2,
    name: "Calça Jeans Masculina",
    description: "Calça jeans confortável com corte moderno, ideal para o dia a dia",
    price: 129.90,
    image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "masculino",
    stock: 20,
    rating: 4.3
  },
  {
    id: 3,
    name: "Blazer Preto",
    description: "Blazer elegante em preto, perfeito para reuniões e eventos formais",
    price: 199.90,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "masculino",
    stock: 8,
    rating: 4.7
  },
  {
    id: 4,
    name: "Polo Branco",
    description: "Polo clássico em branco, confortável e versátil para qualquer ocasião",
    price: 69.90,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "masculino",
    stock: 25,
    rating: 4.2
  },

  // Produtos Femininos
  {
    id: 5,
    name: "Vestido Floral",
    description: "Vestido elegante com estampa floral, perfeito para eventos especiais",
    price: 149.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "feminino",
    stock: 12,
    rating: 4.6
  },
  {
    id: 6,
    name: "Blusa de Seda",
    description: "Blusa luxuosa em seda natural, com caimento perfeito e conforto excepcional",
    price: 179.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "feminino",
    stock: 10,
    rating: 4.8
  },
  {
    id: 7,
    name: "Calça Alfaiataria",
    description: "Calça alfaiataria elegante, ideal para o ambiente corporativo",
    price: 159.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "feminino",
    stock: 18,
    rating: 4.4
  },
  {
    id: 8,
    name: "Saia Midi",
    description: "Saia midi versátil, pode ser usada tanto no trabalho quanto em eventos",
    price: 119.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "feminino",
    stock: 14,
    rating: 4.3
  },

  // Calçados
  {
    id: 9,
    name: "Tênis Esportivo",
    description: "Tênis confortável para atividades físicas e uso casual",
    price: 199.90,
    image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "calcados",
    stock: 30,
    rating: 4.5
  },
  {
    id: 10,
    name: "Sapato Social Masculino",
    description: "Sapato social elegante em couro legítimo, perfeito para ocasiões formais",
    price: 249.90,
    image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "calcados",
    stock: 12,
    rating: 4.7
  },
  {
    id: 11,
    name: "Salto Alto Feminino",
    description: "Salto alto elegante, ideal para eventos especiais e ocasiões formais",
    price: 189.90,
    image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "calcados",
    stock: 8,
    rating: 4.6
  },
  {
    id: 12,
    name: "Sandália Casual",
    description: "Sandália confortável para o dia a dia, com design moderno e elegante",
    price: 89.90,
    image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "calcados",
    stock: 22,
    rating: 4.2
  },

  // Cintos
  {
    id: 13,
    name: "Cinto de Couro Masculino",
    description: "Cinto de couro legítimo com fivela clássica, ideal para uso formal",
    price: 79.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "cintos",
    stock: 35,
    rating: 4.4
  },
  {
    id: 14,
    name: "Cinto Feminino Elegante",
    description: "Cinto feminino com design moderno, perfeito para complementar looks elegantes",
    price: 69.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "cintos",
    stock: 28,
    rating: 4.3
  },
  {
    id: 15,
    name: "Cinto de Couro Marrom",
    description: "Cinto de couro marrom versátil, combina com diversos estilos",
    price: 89.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "cintos",
    stock: 20,
    rating: 4.5
  },
  {
    id: 16,
    name: "Cinto de Couro Preto",
    description: "Cinto de couro preto clássico, essencial para qualquer guarda-roupa",
    price: 84.90,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "cintos",
    stock: 25,
    rating: 4.6
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))];
};
