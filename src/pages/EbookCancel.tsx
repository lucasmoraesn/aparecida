import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, MessageSquare } from 'lucide-react';

export default function EbookCancel() {
  const handleSupportClick = () => {
    const phoneNumber = '5512982382931'; // Suporte do Explore Aparecida
    const message = encodeURIComponent('Olá! Tive um problema ou cancelei a compra do Kit do Romeiro e gostaria de tirar uma dúvida.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-[75vh] py-16 px-4 md:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 text-center space-y-6">
        
        {/* Ícone de Alerta */}
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-10 h-10" />
        </div>

        {/* Título e Texto */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Compra Cancelada</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Você cancelou o processo de checkout ou o pagamento não foi concluído. Nenhuma cobrança foi realizada no seu cartão.
          </p>
        </div>

        {/* Ações */}
        <div className="pt-4 space-y-3">
          <Link
            to="/kit-do-romeiro"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </Link>
          
          <button
            onClick={handleSupportClick}
            className="w-full py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-green-500" />
            <span>Falar com o Suporte</span>
          </button>
        </div>

        {/* Rodapé descritivo */}
        <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">
          Se você encontrou alguma dificuldade ou erro no processamento do pagamento, clique no botão acima para conversar com nossa equipe.
        </p>

      </div>
    </div>
  );
}
