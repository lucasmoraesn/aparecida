import React from 'react';
import { Cookie } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 page-container pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Cookie className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Política de Cookies</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. O que são Cookies?</h2>
              <p>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. 
                Eles ajudam a melhorar sua experiência de navegação, lembrando preferências e fornecendo 
                funcionalidades personalizadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Como Usamos Cookies</h2>
              <p>O Explore Aparecida utiliza cookies para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter você conectado durante sua sessão</li>
                <li>Lembrar suas preferências e configurações</li>
                <li>Analisar o tráfego e comportamento dos usuários</li>
                <li>Melhorar a segurança da plataforma</li>
                <li>Personalizar conteúdo e anúncios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Tipos de Cookies Utilizados</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Cookies Essenciais</h3>
                  <p>Necessários para o funcionamento básico do site. Não podem ser desativados.</p>
                  <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                    <li>Cookies de sessão</li>
                    <li>Cookies de autenticação</li>
                    <li>Cookies de segurança</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Cookies de Funcionalidade</h3>
                  <p>Permitem que o site lembre suas escolhas e preferências.</p>
                  <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                    <li>Preferências de idioma</li>
                    <li>Configurações de visualização</li>
                    <li>Localização geográfica</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Cookies de Análise</h3>
                  <p>Ajudam a entender como os visitantes usam o site.</p>
                  <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                    <li>Google Analytics</li>
                    <li>Métricas de desempenho</li>
                    <li>Análise de comportamento</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Cookies de Marketing</h3>
                  <p>Usados para rastrear visitantes e exibir anúncios relevantes.</p>
                  <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                    <li>Cookies de redes sociais</li>
                    <li>Cookies de publicidade</li>
                    <li>Remarketing</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Cookies de Terceiros</h2>
              <p className="mb-3">Utilizamos serviços de terceiros que podem definir seus próprios cookies:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento</li>
                <li><strong>Stripe/PagBank:</strong> Para processamento seguro de pagamentos</li>
                <li><strong>Supabase:</strong> Para autenticação e gerenciamento de dados</li>
                <li><strong>Redes Sociais:</strong> Para integração com Facebook, Instagram, etc.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Duração dos Cookies</h2>
              <div className="space-y-2">
                <p><strong>Cookies de Sessão:</strong> Expiram quando você fecha o navegador</p>
                <p><strong>Cookies Persistentes:</strong> Permanecem por um período definido (até 12 meses)</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Como Gerenciar Cookies</h2>
              <p className="mb-3">Você pode controlar e gerenciar cookies de várias formas:</p>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p><strong>Pelo Navegador:</strong></p>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                  <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
                  <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                  <li><strong>Edge:</strong> Configurações → Privacidade → Cookies</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">⚠️ Importante:</p>
                <p className="text-sm">
                  Desativar cookies pode afetar a funcionalidade do site e impedir acesso a recursos personalizados.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Atualizações desta Política</h2>
              <p>
                Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas 
                ou por requisitos legais. Recomendamos revisar esta página regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Consentimento</h2>
              <p>
                Ao continuar navegando no Explore Aparecida, você concorda com o uso de cookies conforme 
                descrito nesta política. Cookies essenciais são usados automaticamente, enquanto outros 
                tipos requerem seu consentimento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Contato</h2>
              <p>Para dúvidas sobre nossa política de cookies:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p><strong>E-mail:</strong> aparecidatoursp@hotmail.com</p>
                <p><strong>Telefone:</strong> (12) 99212-6779</p>
                <p><strong>WhatsApp:</strong> (12) 99212-6779</p>
              </div>
            </section>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-6">
              <p className="text-sm text-green-800">
                <strong>💡 Dica:</strong> A maioria dos navegadores aceita cookies automaticamente. 
                Você pode modificar as configurações do navegador para recusar cookies, mas isso pode 
                limitar sua experiência no site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
