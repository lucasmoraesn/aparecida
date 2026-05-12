import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CadastroSucessoRestaurantes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);
  
  // Form fields
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);

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
      // Enviar via FormData (sem base64, sem limite de payload)
      const formData = new FormData();
      formData.append('sessionId', sessionId || '');
      formData.append('restauranteData', JSON.stringify({
        nome,
        whatsapp,
        email,
        endereco,
        especialidade,
        horario,
        descricao,
      }));
      
      // Adicionar múltiplas fotos
      fotos.forEach((foto, index) => {
        formData.append(`fotos`, foto);
      });

      const response = await fetch(`${API_BASE}/api/register-restaurantes`, {
        method: 'POST',
        body: formData,
        // Sem Content-Type header — browser define automaticamente com boundary
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
      } else {
        throw new Error(data.error || 'Erro ao registrar');
      }
    } catch (error) {
      console.error('Erro ao salvar restaurante:', error);
      alert('Tivemos um problema ao salvar seu perfil. Tente enviar novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFotos = Array.from(files).slice(0, 5); // Máx 5 fotos
      setFotos(newFotos);
    }
  };

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
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
          <button onClick={() => navigate('/')} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cadastro Recebido!</h1>
          <p className="text-gray-500 text-sm mb-8">
            Seus dados foram enviados com sucesso. Seu restaurante está em análise e será aprovado em até 24 horas — você receberá um e-mail de confirmação.
          </p>
          <button onClick={() => navigate('/restaurantes-em-aparecida-sp')} className="w-full bg-green-600 text-white py-3.5 rounded-lg font-medium hover:bg-green-700">
            Ver Página de Restaurantes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 page-container">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Complete seu Cadastro</h1>
          <p className="text-gray-500 text-sm mb-8">
            Pagamento confirmado! Agora preencha os dados que aparecerão na página do seu restaurante.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos do Restaurante (máx. 5) — deixe em branco para usar foto padrão
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotosChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Selecione uma ou mais imagens. As fotos aparecerão em um carrossel automático no seu perfil.
              </p>
              
              {/* Preview das fotos */}
              {fotos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Fotos selecionadas ({fotos.length}/5)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {fotos.map((foto, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(foto)}
                          alt={`Foto ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Restaurante</label>
              <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                placeholder="Ex: Cantina da Nonna" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600"
                placeholder="Ex: contato@cantina.com.br" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (com DDD)</label>
                <input type="text" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600"
                  placeholder="Ex: 12999999999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <input type="text" value={especialidade} onChange={e => setEspecialidade(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Ex: Culinária Italiana" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input type="text" required value={endereco} onChange={e => setEndereco(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                placeholder="Ex: Rua Principal, 456, Aparecida - SP" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Funcionamento</label>
              <input type="text" value={horario} onChange={e => setHorario(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                placeholder="Ex: Seg-Dom 11h às 22h" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
              <textarea value={descricao} onChange={e => setDescricao(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 h-24 resize-none"
                placeholder="Conte sobre o seu restaurante, pratos especiais, ambiente, etc..." />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Salvando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroSucessoRestaurantes;
