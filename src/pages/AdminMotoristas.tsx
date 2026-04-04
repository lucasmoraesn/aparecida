import React, { useEffect, useState } from 'react';
import { Car, MapPin, MessageCircle, Check, Trash2, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://aparecidadonortesp.com.br';

const ADMIN_PASSWORD = 'admin123';

interface MotoristaPendente {
  id: string;
  nome: string;
  foto_url: string | null;
  whatsapp: string | null;
  telefone: string | null;
  veiculo: string;
  passageiros: number;
  cidades: string[] | string;
  descricao: string | null;
  plano: string | null;
  stripe_session_id: string | null;
}

const PlanoTag: React.FC<{ plano: string | null }> = ({ plano }) => {
  const styles: Record<string, string> = {
    premium: 'bg-purple-100 text-purple-700 ring-1 ring-purple-300',
    destaque: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
    basico: 'bg-gray-100 text-gray-600 ring-1 ring-gray-300',
  };
  const label = plano ?? 'básico';
  const style = styles[label] ?? styles.basico;
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${style}`}>
      {label}
    </span>
  );
};

// ─── Tela de Login ────────────────────────────────────────────────────────────

const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [visivel, setVisivel] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setErro(true);
      setSenha('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Área Administrativa</h1>
          <p className="text-sm text-gray-500 mt-1">Aprovação de motoristas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                type={visivel ? 'text' : 'password'}
                value={senha}
                onChange={e => { setSenha(e.target.value); setErro(false); }}
                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  erro ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Digite a senha"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setVisivel(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {visivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {erro && <p className="text-xs text-red-500 mt-1">Senha incorreta. Tente novamente.</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Página Principal ─────────────────────────────────────────────────────────

const AdminMotoristas: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [motoristas, setMotoristas] = useState<MotoristaPendente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [acaoId, setAcaoId] = useState<string | null>(null);

  const fetchPendentes = async () => {
    setCarregando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/motoristas-pendentes`, {
        headers: { 'x-admin-password': ADMIN_PASSWORD },
      });
      const data = await res.json();
      if (res.ok && data.motoristas) {
        setMotoristas(data.motoristas as MotoristaPendente[]);
      }
    } catch (e) {
      console.error('Erro ao buscar pendentes:', e);
    }
    setCarregando(false);
  };

  useEffect(() => {
    if (autenticado) {
      document.title = 'Admin — Motoristas Pendentes';
      fetchPendentes();
    }
  }, [autenticado]);

  const aprovar = async (id: string) => {
    setAcaoId(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/aprovar-motorista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PASSWORD },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setMotoristas(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error('Erro ao aprovar:', e);
    }
    setAcaoId(null);
  };

  const rejeitar = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja rejeitar e excluir este cadastro?')) return;
    setAcaoId(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/rejeitar-motorista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PASSWORD },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setMotoristas(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error('Erro ao rejeitar:', e);
    }
    setAcaoId(null);
  };

  const getCidades = (cidades: string[] | string): string => {
    if (Array.isArray(cidades)) return cidades.join(', ');
    if (typeof cidades === 'string') {
      try {
        const parsed = JSON.parse(cidades);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch {
        return cidades;
      }
    }
    return '';
  };

  if (!autenticado) {
    return <LoginScreen onLogin={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Motoristas Pendentes</h1>
            <p className="text-sm text-gray-500 mt-1">Cadastros aguardando aprovação</p>
          </div>
          <button
            onClick={fetchPendentes}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5"
          >
            {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Atualizar
          </button>
        </div>

        {/* Conteúdo */}
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-sm">Carregando cadastros...</p>
          </div>
        ) : motoristas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Check className="w-14 h-14 mb-4 text-green-400" />
            <p className="text-base font-medium text-gray-600">Nenhum cadastro pendente</p>
            <p className="text-sm mt-1">Todos os motoristas foram processados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {motoristas.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-0">

                  {/* Foto */}
                  <div className="sm:w-40 shrink-0 bg-gray-100">
                    {m.foto_url ? (
                      <img
                        src={m.foto_url}
                        alt={m.nome}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 sm:h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Dados */}
                  <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-semibold text-gray-900">{m.nome}</h2>
                        <PlanoTag plano={m.plano} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                          <span>{m.whatsapp || m.telefone || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>{m.veiculo} · {m.passageiros} passageiros</span>
                        </div>
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                          <span>{getCidades(m.cidades) || '—'}</span>
                        </div>
                      </div>

                      {m.descricao && (
                        <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-2 mt-2">
                          {m.descricao}
                        </p>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => aprovar(m.id)}
                        disabled={acaoId === m.id}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                      >
                        {acaoId === m.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejeitar(m.id)}
                        disabled={acaoId === m.id}
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 text-sm font-semibold px-5 py-2 rounded-lg transition-colors ring-1 ring-red-200"
                      >
                        {acaoId === m.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMotoristas;
