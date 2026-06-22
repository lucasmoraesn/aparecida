import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { trackKitCheckoutCompleted, trackKitDownloaded } from '../lib/analytics';
import { checkEbookSession, getEbookDownloadUrl, isEbookPaid } from '../lib/ebookApi';
import { EBOOK_CONFIG } from '../config/constants';

export default function EbookSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let intervalId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        const data = await checkEbookSession(sessionId);
        
        if (data.success && isEbookPaid(data.status)) {
          setStatus('paid');
          setEmail(data.email || '');
          clearInterval(intervalId);

          // 📊 Analytics: Compra concluída com sucesso
          trackKitCheckoutCompleted(sessionId, EBOOK_CONFIG.price);
        } else if (pollCount > 15) {
          // Se passou muito tempo (ex: 45s), mantém como pendente
          setStatus('pending');
          clearInterval(intervalId);
        } else {
          setPollCount(prev => prev + 1);
        }
      } catch (err) {
        console.error('Erro ao fazer polling de status:', err);
      }
    };

    // Executa a primeira vez
    checkPaymentStatus();

    // Configura o intervalo para rodar a cada 3 segundos
    intervalId = setInterval(checkPaymentStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, pollCount]);

  const handleDownloadClick = () => {
    // 📊 Analytics: Usuário clicou para baixar o PDF
    trackKitDownloaded();
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] py-16 px-4 md:px-8 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        
        {/* Header de Confirmação */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-10 px-8 text-center text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)]"></div>
          <div className="relative z-10 flex flex-col items-center">
            {status === 'loading' && (
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            )}
            {(status === 'paid' || status === 'pending') && (
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                <CheckCircle className="w-10 h-10" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                <span className="text-3xl">⚠️</span>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {status === 'loading' && 'Confirmando Pagamento...'}
              {status === 'paid' && 'Acesso Liberado!'}
              {status === 'pending' && 'Pagamento em Processamento'}
              {status === 'error' && 'Ops! Algo deu errado'}
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-sm mx-auto">
              {status === 'loading' && 'Estamos validando o seu pagamento junto ao Stripe. Só um momento...'}
              {status === 'paid' && 'Seu pagamento foi confirmado com sucesso. Seu Kit do Romeiro já está pronto.'}
              {status === 'pending' && 'Seu pagamento está sendo processado. Você receberá o link por e-mail assim que aprovado.'}
              {status === 'error' && 'Não conseguimos localizar as informações da sua compra.'}
            </p>
          </div>
        </div>

        {/* Corpo da Página */}
        <div className="p-8 space-y-6">
          {status === 'loading' && (
            <div className="py-8 text-center text-slate-500 font-medium">
              Por favor, não feche esta página...
            </div>
          )}

          {status === 'paid' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-start gap-4">
                <Mail className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Enviamos uma cópia para seu e-mail</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Um link de download seguro também foi enviado para o e-mail: <strong className="text-slate-800">{email}</strong>. Lembre-se de verificar sua pasta de Spam ou Promoções.
                  </p>
                </div>
              </div>

              {/* Ação Principal: Download Seguro */}
              <div className="text-center space-y-4">
                <a
                  href={getEbookDownloadUrl(sessionId)}
                  onClick={handleDownloadClick}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  <span>Baixar Ebook PDF Agora</span>
                </a>
                <p className="text-xs text-slate-400">
                  Formato PDF (5MB). Pode ser lido diretamente em qualquer smartphone ou computador.
                </p>
              </div>
            </motion.div>
          )}

          {status === 'pending' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                Seu pagamento pode demorar alguns minutos para ser processado. Assim que for concluído, enviaremos o link de download seguro para o e-mail cadastrado no Stripe.
              </p>
              <Link
                to="/kit-do-romeiro"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
              >
                <span>Voltar para a Landing Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-slate-600 text-sm">
                Não encontramos uma sessão de checkout válida. Caso tenha efetuado o pagamento e não tenha recebido o e-mail, entre em contato com nosso suporte.
              </p>
              <Link
                to="/kit-do-romeiro"
                className="inline-block px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          )}

          {/* Dicas de Suporte */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Compra Auditada & Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Dúvidas? Acesse nosso WhatsApp</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
