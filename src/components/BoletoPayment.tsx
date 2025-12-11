import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface BoletoPaymentProps {
  boletoUrl: string;
  boletoBarcode: string;
  subscriptionId: string;
  onSuccess: () => void;
}

export const BoletoPayment: React.FC<BoletoPaymentProps> = ({
  boletoUrl,
  boletoBarcode,
  subscriptionId,
  onSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(boletoBarcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBoleto = () => {
    if (boletoUrl) {
      window.open(boletoUrl, '_blank');
    }
  };

  const checkPaymentStatus = async () => {
    setCheckingStatus(true);
    try {
      // Aqui você faria uma chamada para verificar o status do pagamento
      // await BusinessService.getSubscription(subscriptionId);
      console.log('Verificando status do boleto para:', subscriptionId);
      // Se o status for 'ativa', chamar onSuccess()
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Pagar com Boleto</h2>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Código de Barras:</p>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded p-3">
            <code className="text-xs text-gray-700 break-all flex-1 font-mono">
              {boletoBarcode}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">✓ Código copiado!</p>
          )}
        </div>

        <div className="bg-white border-l-4 border-orange-500 p-4">
          <p className="text-sm text-gray-700">
            <strong>Instruções:</strong>
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
            <li>Abra seu banco online ou app</li>
            <li>Selecione "Pagar Boleto"</li>
            <li>Cole o código de barras acima ou baixe o boleto</li>
            <li>Confirme e pague</li>
            <li>Seu pagamento será confirmado em até 2 dias úteis</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={downloadBoleto}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar Boleto em PDF
        </button>

        <button
          onClick={checkPaymentStatus}
          disabled={checkingStatus}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {checkingStatus ? 'Verificando...' : 'Já Paguei - Verificar Pagamento'}
        </button>

        <p className="text-xs text-gray-600 text-center">
          Após confirmar o pagamento no seu banco, sua assinatura será ativada automaticamente (pode levar até 2 dias úteis).
        </p>
      </div>
    </div>
  );
};
