import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introdução</h2>
              <p>
                O Explore Aparecida está comprometido em proteger a privacidade dos usuários de nossa plataforma. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Informações Coletadas</h2>
              <p className="mb-2">Coletamos as seguintes informações:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Cadastro:</strong> Nome, e-mail, telefone e endereço (para comerciantes cadastrados)</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                <li><strong>Dados de Negócios:</strong> Informações comerciais dos estabelecimentos cadastrados</li>
                <li><strong>Dados de Pagamento:</strong> Informações processadas por gateways seguros (Stripe/PagBank)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Como Usamos suas Informações</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer e melhorar nossos serviços de divulgação de estabelecimentos</li>
                <li>Processar pagamentos de assinaturas Premium</li>
                <li>Enviar comunicações sobre atualizações e promoções</li>
                <li>Analisar o uso da plataforma para melhorias</li>
                <li>Garantir a segurança e prevenir fraudes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Compartilhamento de Dados</h2>
              <p>
                Não vendemos suas informações pessoais. Compartilhamos dados apenas com:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Processadores de pagamento (Stripe, PagBank) para transações financeiras</li>
                <li>Prestadores de serviços técnicos essenciais</li>
                <li>Autoridades legais quando exigido por lei</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, 
                incluindo criptografia, controles de acesso e monitoramento contínuo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Seus Direitos (LGPD)</h2>
              <p className="mb-2">Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Solicitar a portabilidade dos dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies e Tecnologias</h2>
              <p>
                Utilizamos cookies para melhorar a experiência do usuário. Consulte nossa 
                <a href="/cookies" className="text-blue-600 hover:underline ml-1">Política de Cookies</a> para mais detalhes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pelo tempo necessário para cumprir os propósitos descritos nesta política, 
                exceto quando períodos de retenção mais longos forem exigidos por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Alterações na Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                por e-mail ou aviso em nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Contato</h2>
              <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p><strong>E-mail:</strong> aparecidatoursp@hotmail.com</p>
                <p><strong>Telefone:</strong> (12) 99212-6779</p>
                <p><strong>Endereço:</strong> Aparecida, SP - Brasil</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
