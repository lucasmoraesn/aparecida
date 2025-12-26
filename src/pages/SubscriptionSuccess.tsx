import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  const downloadPDF = () => {
    if (!sessionData) return;

    const doc = new jsPDF();
    const { amountTotal, subscriptionId, customerEmail, paymentStatus } = sessionData;

    // Configurações de estilo
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header com logo (simulado)
    doc.setFillColor(139, 92, 246); // Roxo
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Explore Aparecida', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Recibo de Pagamento', pageWidth / 2, 30, { align: 'center' });
    
    // Reset para texto normal
    doc.setTextColor(0, 0, 0);
    
    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Pagamento Confirmado', 20, 60);
    
    // Linha divisória
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 68, pageWidth - 20, 68);
    
    // Detalhes
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    let yPos = 85;
    
    // Valor
    doc.setFont('helvetica', 'bold');
    doc.text('Valor:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`R$ ${(amountTotal / 100).toFixed(2).replace('.', ',')}`, 80, yPos);
    
    yPos += 12;
    
    // ID da Assinatura
    doc.setFont('helvetica', 'bold');
    doc.text('ID da Assinatura:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(subscriptionId, 80, yPos);
    doc.setFontSize(11);
    
    yPos += 12;
    
    // Status
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentStatus === 'paid' ? 'Pago' : paymentStatus, 80, yPos);
    
    yPos += 12;
    
    // Data
    doc.setFont('helvetica', 'bold');
    doc.text('Data:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('pt-BR'), 80, yPos);
    
    yPos += 12;
    
    // Estabelecimento
    doc.setFont('helvetica', 'bold');
    doc.text('Estabelecimento:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('Explore Aparecida', 80, yPos);
    
    yPos += 20;
    
    // Linha divisória
    doc.setDrawColor(229, 231, 235);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    yPos += 15;
    
    // Info de recibo
    doc.setFillColor(239, 246, 255); // Azul claro
    doc.roundedRect(20, yPos, pageWidth - 40, 20, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246); // Azul
    doc.text(`Recibo enviado para: ${customerEmail}`, pageWidth / 2, yPos + 12, { align: 'center' });
    
    // Rodapé
    doc.setTextColor(156, 163, 175); // Cinza
    doc.setFontSize(9);
    doc.text('Precisa de ajuda? Entre em contato: (12) 99212-6779', pageWidth / 2, 280, { align: 'center' });
    doc.text('aparecidadonortesp.com.br', pageWidth / 2, 287, { align: 'center' });
    
    // Download
    doc.save(`recibo-${subscriptionId}.pdf`);
  };

  useEffect(() => {
    if (!sessionId) {
      console.error('session_id não encontrado na URL');
      setStatus('error');
      return;
    }

    const verifySession = async () => {
      try {
        console.log('🔍 Verificando sessão no backend:', sessionId);

        const apiUrl = import.meta.env.VITE_API_URL || 'https://aparecidadonortesp.com.br';
        const response = await fetch(
          `${apiUrl}/api/check-session?session_id=${sessionId}`
        );

        const data = await response.json();

        if (!data.success) {
          console.error('❌ Erro ao verificar sessão:', data);
          setStatus('error');
          return;
        }

        console.log('✅ Sessão válida:', data);
        setSessionData(data);
        setStatus('success');
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        setStatus('error');
      }
    };

    verifySession();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando assinatura...</h1>
          <p className="text-gray-600">Aguarde enquanto confirmamos sua assinatura.</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao verificar assinatura</h1>
          <p className="text-gray-600 mb-6">
            Não foi possível confirmar sua assinatura. Por favor, tente novamente mais tarde.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const { status: paymentStatus, subscriptionId, customerEmail, amountTotal } = sessionData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full my-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2.5} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-center text-gray-500 text-sm mb-8">
            Seu pagamento foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
          </p>

          {/* Detalhes do pagamento */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Valor</span>
              <span className="text-gray-900 font-semibold">
                R$ {(amountTotal / 100).toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">ID da Assinatura</span>
              <span className="text-gray-900 font-mono text-xs">
                {subscriptionId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Status</span>
              <span className="text-gray-900 font-semibold">
                {paymentStatus === 'paid' ? 'Pago' : paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Data</span>
              <span className="text-gray-900">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Estabelecimento</span>
              <span className="text-gray-900 font-medium">Explore Aparecida</span>
            </div>
          </div>

          {/* Info de recibo */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-blue-700 text-sm">
              Recibo enviado para {customerEmail}
            </span>
          </div>

          {/* Botão Download */}
          <button
            onClick={downloadPDF}
            className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-3 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Recibo
          </button>

          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/')}
            className="w-full border-2 border-gray-200 text-gray-700 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Início
          </button>
        </div>

        {/* Rodapé de suporte */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Precisa de ajuda? Entre em contato com nosso suporte em{' '}
          <a href="tel:+5512992126779" className="text-gray-700 hover:underline">
            (12) 99212-6779
          </a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
