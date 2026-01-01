import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Termos de Uso</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma Explore Aparecida, você concorda em cumprir estes Termos de Uso. 
                Se não concordar com algum termo, não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Descrição dos Serviços</h2>
              <p>
                O Explore Aparecida é uma plataforma digital que conecta visitantes a estabelecimentos comerciais 
                em Aparecida do Norte, incluindo hotéis, restaurantes, lojas religiosas e pontos turísticos.
              </p>
              <p className="mt-2">Oferecemos:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Listagem gratuita de estabelecimentos</li>
                <li>Planos Premium com destaque e recursos adicionais</li>
                <li>Informações sobre eventos e atrações locais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Cadastro e Responsabilidades</h2>
              <p className="mb-2"><strong>Para Usuários Visitantes:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Não é necessário cadastro para visualizar informações</li>
                <li>Uso responsável das informações disponibilizadas</li>
              </ul>
              
              <p className="mb-2 mt-4"><strong>Para Comerciantes:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter os dados do estabelecimento sempre corretos</li>
                <li>Respeitar as diretrizes da plataforma</li>
                <li>Ser responsável pelo conteúdo publicado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Planos e Pagamentos</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Planos Premium são cobrados mensalmente via Stripe ou PagBank</li>
                <li>Renovação automática, podendo ser cancelada a qualquer momento</li>
                <li>Não há reembolso proporcional em caso de cancelamento</li>
                <li>Preços podem ser alterados mediante aviso prévio de 30 dias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Conteúdo Publicado</h2>
              <p>É proibido publicar conteúdo que:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Seja falso, enganoso ou fraudulento</li>
                <li>Viole direitos autorais ou de propriedade intelectual</li>
                <li>Contenha material ofensivo, discriminatório ou ilegal</li>
                <li>Faça spam ou publicidade não autorizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma (design, textos, logos, código) é propriedade do Explore Aparecida 
                ou de seus licenciadores, protegido por leis de direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Limitação de Responsabilidade</h2>
              <p>O Explore Aparecida não se responsabiliza por:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Qualidade dos serviços prestados pelos estabelecimentos listados</li>
                <li>Informações incorretas fornecidas por terceiros</li>
                <li>Danos indiretos resultantes do uso da plataforma</li>
                <li>Interrupções temporárias no serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Suspensão e Cancelamento</h2>
              <p>
                Reservamos o direito de suspender ou cancelar contas que violem estes termos, 
                sem aviso prévio e sem reembolso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Modificações nos Termos</h2>
              <p>
                Podemos alterar estes termos a qualquer momento. Mudanças significativas serão notificadas 
                por e-mail ou aviso na plataforma. O uso continuado após alterações constitui aceitação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida no 
                foro da comarca de Aparecida, SP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contato</h2>
              <p>Para dúvidas ou questões sobre estes termos:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p><strong>E-mail:</strong> aparecidatoursp@hotmail.com</p>
                <p><strong>Telefone:</strong> (12) 99212-6779</p>
                <p><strong>WhatsApp:</strong> (12) 99212-6779</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
