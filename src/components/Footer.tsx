import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Explore Aparecida</h3>
            <p className="text-gray-300 mb-6">
              A sua plataforma completa para descobrir o melhor de Aparecida. 
              Conectamos visitantes aos melhores estabelecimentos da cidade.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li><a href="#hoteis" className="text-gray-300 hover:text-white transition-colors">Hotéis e Pousadas</a></li>
              <li><a href="#restaurantes" className="text-gray-300 hover:text-white transition-colors">Restaurantes</a></li>
              <li><a href="#lojas" className="text-gray-300 hover:text-white transition-colors">Lojas Religiosas</a></li>
              <li><a href="#pontos-turisticos" className="text-gray-300 hover:text-white transition-colors">Pontos Turísticos</a></li>
              <li><a href="#eventos" className="text-gray-300 hover:text-white transition-colors">Eventos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Para Comerciantes</h4>
            <ul className="space-y-2">
              <li><a href="/cadastrar-negocio" className="text-gray-300 hover:text-white transition-colors">Cadastrar Negócio</a></li>
              <li><a href="/cadastrar-negocio" className="text-gray-300 hover:text-white transition-colors">Planos Premium</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">Aparecida, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">(12) 99212-6779</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">aparecidatoursp@hotmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Explore Aparecida. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/politica-privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidade
            </a>
            <a href="/termos-uso" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de Uso
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;