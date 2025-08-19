/*
  # Insert sample data for Aparecida Tourism Portal

  1. Sample Data
    - Insert hotels data from existing establishments
    - Insert restaurants data
    - Insert shops data  
    - Insert attractions data

  2. Notes
    - This migration populates the tables with the existing sample data
    - IDs are explicitly set to match the existing data structure
*/

-- Insert hotels data
INSERT INTO hotels (id, name, category, rating, address, phone, whatsapp, image, description, featured) VALUES
(1, 'Hotel Rainha do Brasil', 'Hotel Premium', 4.8, 'Rua Dr. Nelson de Sá Earp, 192 - Centro', '(12) 3104-2000', '12981234567', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hotel 4 estrelas com vista para a Basílica, café da manhã completo e estacionamento gratuito.', true),
(2, 'Pousada Fé e Esperança', 'Pousada Familiar', 4.5, 'Av. Dr. Julio Prestes, 85 - Porto Itaguaçu', '(12) 3104-1500', '12987654321', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 'Ambiente acolhedor e familiar, próximo à Basílica com quartos confortáveis e preço justo.', false),
(3, 'Hotel Aparecida Palace', 'Hotel Luxo', 4.9, 'Rua Monsenhor João Nunes, 156 - Centro', '(12) 3104-3000', '12976543210', 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hotel de luxo com spa, piscina aquecida e serviços exclusivos para peregrinos.', false);

-- Insert restaurants data
INSERT INTO restaurants (id, name, category, rating, address, phone, whatsapp, image, description, featured) VALUES
(1, 'Restaurante Basílica', 'Culinária Regional', 4.7, 'Praça Nossa Senhora Aparecida, 1 - Centro', '(12) 3104-4000', '12965432100', 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pratos típicos da região com vista privilegiada da Basílica. Especialidade em peixe e pratos caseiros.', true),
(2, 'Lanchonete do Peregrino', 'Lanches e Petiscos', 4.4, 'Rua Coronel Joaquim José, 45 - Centro', '(12) 3104-2500', '12954321000', 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=800', 'Opções rápidas e saborosas para peregrinos. Sanduíches, pastéis e sucos naturais.', false),
(3, 'Pizzaria São José', 'Pizzaria', 4.6, 'Av. Independência, 234 - Jardim Alvorada', '(12) 3104-5500', '12943210000', 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pizzas artesanais com ingredientes frescos. Ambiente familiar com espaço kids.', false);

-- Insert shops data
INSERT INTO shops (id, name, category, rating, address, phone, whatsapp, image, description, featured) VALUES
(1, 'Casa do Terço', 'Artigos Religiosos', 4.8, 'Rua Dr. Nelson de Sá Earp, 45 - Centro', '(12) 3104-6000', '12932100000', 'https://images.pexels.com/photos/6032826/pexels-photo-6032826.jpeg?auto=compress&cs=tinysrgb&w=800', 'Maior variedade de artigos religiosos da região. Terços, medalhas, livros e lembranças especiais.', true),
(2, 'Loja Milagres', 'Souvenirs', 4.5, 'Praça Nossa Senhora Aparecida, 23 - Centro', '(12) 3104-7000', '12921000000', 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lembranças únicas de Aparecida. Camisetas, chaveiros, imãs e produtos personalizados.', false),
(3, 'Livraria Católica São Paulo', 'Livros e Música', 4.6, 'Rua Monsenhor João Nunes, 78 - Centro', '(12) 3104-8000', '12910000000', 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800', 'Livros católicos, CDs de música sacra e materiais para estudos religiosos.', false);

-- Insert attractions data
INSERT INTO attractions (id, name, category, rating, address, phone, whatsapp, image, description, featured) VALUES
(1, 'Basílica Nacional de Nossa Senhora Aparecida', 'Patrimônio Religioso', 5.0, 'Av. Dr. Julio Prestes, s/n - Centro', '(12) 3104-1000', '12900000000', 'https://images.pexels.com/photos/8090197/pexels-photo-8090197.jpeg?auto=compress&cs=tinysrgb&w=800', 'Maior santuário mariano do mundo. Local de peregrinação e fé para milhões de devotos.', true),
(2, 'Museu Nossa Senhora Aparecida', 'Museu', 4.7, 'Av. Dr. Julio Prestes, s/n - Subsolo da Basílica', '(12) 3104-1010', '12899999999', 'https://images.pexels.com/photos/2078074/pexels-photo-2078074.jpeg?auto=compress&cs=tinysrgb&w=800', 'Acervo histórico e religioso com mais de 3 mil peças sobre a história da devoção.', false),
(3, 'Teleférico de Aparecida', 'Atrativo Turístico', 4.4, 'Estrada do Teleférico, s/n - Morro do Cruzeiro', '(12) 3104-9000', '12888888888', 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vista panorâmica da cidade e da Basílica. Passeio inesquecível para toda a família.', false);

-- Reset sequences to continue from the highest ID
SELECT setval('hotels_id_seq', (SELECT MAX(id) FROM hotels));
SELECT setval('restaurants_id_seq', (SELECT MAX(id) FROM restaurants));
SELECT setval('shops_id_seq', (SELECT MAX(id) FROM shops));
SELECT setval('attractions_id_seq', (SELECT MAX(id) FROM attractions));