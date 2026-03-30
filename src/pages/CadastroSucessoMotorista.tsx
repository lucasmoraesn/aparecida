import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CadastroSucessoMotorista: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);
  
  // Form fields
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [passageiros, setPassageiros] = useState('4');
  const [cidades, setCidades] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionId = searchParams.get('session_id');
  const API_BASE = import.meta.env.VITE_API_URL || "https://aparecidadonortesp.com.br";

  useEffect(() => {
    if (!sessionId) {
      console.error('session_id não encontrado na URL');
      setStatus('error');
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/check-session?session_id=${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          setStatus('error');
          return;
        }

        setSessionData(data);
        setStatus('form');
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setStatus('error');
      }
    };

    verifySession();
  }, [sessionId, API_BASE]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call to the backend to register the driver
      const response = await fetch(`${API_BASE}/api/register-motorista`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          motoristaData: {
            nome,
            whatsapp,
            veiculo,
            passageiros: parseInt(passageiros),
            cidades: cidades.split(',').map(c => c.trim()).filter(Boolean),
            descricao
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
      } else {
        throw new Error(data.error || 'Erro ao registrar');
      }
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      alert('Tivemos um problema ao salvar seu perfil. Tente enviar novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando pagamento...</h1>
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
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full my-8 bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Perfil Criado com Sucesso!</h1>
          <p className="text-gray-500 text-sm mb-8">
            Seu pagamento foi confirmado e seu perfil de motorista já está ativo na plataforma.
          </p>
          <button onClick={() => navigate('/motoristas-particulares')} className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700">
            Ver Página de Motoristas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 page-container">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Complete seu Perfil</h1>
          <p className="text-gray-500 text-sm mb-8">
            Pagamento confirmado (ID: {sessionData.subscriptionId}). Agora preencha os dados que aparecerão na sua página.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Ex: João da Silva" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (com DDD)</label>
              <input type="text" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600"
                placeholder="Ex: 12999999999" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Veículo</label>
                <input type="text" required value={veiculo} onChange={e => setVeiculo(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Ex: Chevrolet Spin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passageiros</label>
                <select value={passageiros} onChange={e => setPassageiros(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300">
                  <option value="4">Até 4</option>
                  <option value="6">Até 6</option>
                  <option value="15">Van (15+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidades Atendidas (separadas por vírgula)</label>
              <input type="text" required value={cidades} onChange={e => setCidades(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                placeholder="Ex: Aparecida, Guaratinguetá, Roseira" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
              <textarea value={descricao} onChange={e => setDescricao(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 h-24 resize-none"
                placeholder="Escreva um pouco sobre seu serviço..." />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Salvando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroSucessoMotorista;
