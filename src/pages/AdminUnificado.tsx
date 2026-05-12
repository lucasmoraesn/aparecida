import React, { useEffect, useState } from 'react';
import { Car, Building, UtensilsCrossed, MapPin, MessageCircle, Check, Trash2, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://aparecidadonortesp.com.br';
const ADMIN_PASSWORD = 'admin123';

type BusinessType = 'motorista' | 'hotel' | 'restaurante';
type TabType = 'pendentes' | 'aprovados';

interface Registration {
  id: string;
  nome: string;
  foto_url: string | null;
  whatsapp: string | null;
  email?: string | null;
  endereco?: string;
  telefone?: string | null;
  veiculo?: string;
  passageiros?: number;
  cidades: string[] | string;
  descricao: string | null;
  plano: string | null;
  stripe_session_id: string | null;
  especialidade?: string | null;
  horario?: string | null;
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
          <p className="text-sm text-gray-500 mt-1">Gerenciamento centralizado</p>
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

// ─── Card genérico ────────────────────────────────────────────────────────────

interface RegistrationCardProps {
  r: Registration;
  businessType: BusinessType;
  acaoId: string | null;
  getCidades: (c: string[] | string) => string;
  onAprovar?: (id: string) => void;
  onRejeitar?: (id: string) => void;
  onExcluir?: (id: string) => void;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({ r, businessType, acaoId, getCidades, onAprovar, onRejeitar, onExcluir }) => {
  const getIcon = () => {
    switch (businessType) {
      case 'motorista': return <Car className="w-12 h-12 text-gray-300" />;
      case 'hotel': return <Building className="w-12 h-12 text-gray-300" />;
      case 'restaurante': return <UtensilsCrossed className="w-12 h-12 text-gray-300" />;
    }
  };

  const getAdditionalInfo = () => {
    if (businessType === 'motorista') {
      return <div className="flex items-center gap-2">
        <Car className="w-4 h-4 text-blue-500 shrink-0" />
        <span>{r.veiculo} · {r.passageiros} passageiros</span>
      </div>;
    }
    if (businessType === 'hotel') {
      return <div className="flex items-center gap-2">
        <Building className="w-4 h-4 text-blue-500 shrink-0" />
        <span>{r.endereco || r.address || '—'}</span>
      </div>;
    }
    if (businessType === 'restaurante') {
      return <div className="flex items-center gap-2">
        <UtensilsCrossed className="w-4 h-4 text-orange-500 shrink-0" />
        <span>{r.especialidade || '—'}</span>
      </div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-0">

        {/* Foto */}
        <div className="sm:w-40 shrink-0 bg-gray-100">
          {r.foto_url || (Array.isArray(r.photos) && r.photos[0]) ? (
            <img 
              src={r.foto_url || (Array.isArray(r.photos) ? r.photos[0] : null)} 
              alt={r.nome || r.establishment_name} 
              className="w-full h-48 sm:h-full object-cover" 
            />
          ) : (
            <div className="w-full h-48 sm:h-full flex items-center justify-center">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Dados */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-900">{r.nome || r.establishment_name}</h2>
              <PlanoTag plano={r.plano} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span>{r.whatsapp || r.phone || r.email || r.telefone || '—'}</span>
              </div>
              {getAdditionalInfo()}
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span>{getCidades(r.cidades || r.location) || '—'}</span>
              </div>
            </div>

            {r.descricao && (
              <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-2 mt-2">
                {r.descricao || r.description}
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 flex-wrap">
            {onAprovar && (
              <button
                onClick={() => onAprovar(r.id)}
                disabled={acaoId === r.id}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                {acaoId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Aprovar
              </button>
            )}
            {onRejeitar && (
              <button
                onClick={() => onRejeitar(r.id)}
                disabled={acaoId === r.id}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 text-sm font-semibold px-5 py-2 rounded-lg transition-colors ring-1 ring-red-200"
              >
                {acaoId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Rejeitar
              </button>
            )}
            {onExcluir && (
              <button
                onClick={() => onExcluir(r.id)}
                disabled={acaoId === r.id}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                {acaoId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Página Principal ─────────────────────────────────────────────────────────

const AdminUnificado: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [tipoAtivo, setTipoAtivo] = useState<BusinessType>('motorista');
  const [abaAtiva, setAbaAtiva] = useState<TabType>('pendentes');
  
  const [motoristas, setMotoristas] = useState<{ pendentes: Registration[], aprovados: Registration[] }>({ pendentes: [], aprovados: [] });
  const [hoteis, setHoteis] = useState<{ pendentes: Registration[], aprovados: Registration[] }>({ pendentes: [], aprovados: [] });
  const [restaurantes, setRestaurantes] = useState<{ pendentes: Registration[], aprovados: Registration[] }>({ pendentes: [], aprovados: [] });
  
  const [carregando, setCarregando] = useState(false);
  const [acaoId, setAcaoId] = useState<string | null>(null);

  // Buscar dados
  const fetchDados = async (tipo: BusinessType) => {
    setCarregando(true);
    try {
      const plural = tipo === 'motorista' ? 'motoristas' : tipo === 'hotel' ? 'hotéis' : 'restaurantes';
      
      const [resPendentes, resAprovados] = await Promise.all([
        fetch(`${API_BASE}/api/admin/${plural}-pendentes`, {
          headers: { 'x-admin-password': ADMIN_PASSWORD },
        }),
        fetch(`${API_BASE}/api/admin/${plural}-ativos`, {
          headers: { 'x-admin-password': ADMIN_PASSWORD },
        }),
      ]);

      const dataPendentes = await resPendentes.json();
      const dataAprovados = await resAprovados.json();

      const chave = tipo === 'motorista' ? 'motoristas' : plural;
      const pendentes = (dataPendentes[chave] || []) as Registration[];
      const aprovados = (dataAprovados[chave] || []) as Registration[];

      if (tipo === 'motorista') setMotoristas({ pendentes, aprovados });
      else if (tipo === 'hotel') setHoteis({ pendentes, aprovados });
      else setRestaurantes({ pendentes, aprovados });
    } catch (e) {
      console.error(`Erro ao buscar ${tipo}s:`, e);
    }
    setCarregando(false);
  };

  useEffect(() => {
    if (autenticado) {
      document.title = 'Admin — Dashboard Unificado';
      fetchDados('motorista');
      fetchDados('hotel');
      fetchDados('restaurante');
    }
  }, [autenticado]);

  // Ações genéricas
  const executarAcao = async (tipo: BusinessType, acao: 'aprovar' | 'rejeitar' | 'excluir', id: string) => {
    if (acao !== 'aprovar' && !window.confirm(`Tem certeza que deseja ${acao} este cadastro?`)) return;

    setAcaoId(id);
    try {
      const plural = tipo === 'motorista' ? 'motoristas' : tipo === 'hotel' ? 'hotéis' : 'restaurantes';
      const endpoint = acao === 'aprovar' ? `aprovar-${plural}` : `rejeitar-${plural}`;
      
      const res = await fetch(`${API_BASE}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PASSWORD },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const erro = await res.text();
        console.error('Erro na resposta:', erro);
        alert('Erro ao executar ação. Verifique o console.');
        setAcaoId(null);
        return;
      }

      await fetchDados(tipo);
    } catch (e) {
      console.error('Erro ao executar ação:', e);
      alert('Erro ao executar ação: ' + (e instanceof Error ? e.message : String(e)));
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

  const currentData = tipoAtivo === 'motorista' ? motoristas : tipoAtivo === 'hotel' ? hoteis : restaurantes;
  const lista = abaAtiva === 'pendentes' ? currentData.pendentes : currentData.aprovados;

  const getTipoLabel = () => {
    switch (tipoAtivo) {
      case 'motorista': return 'Motoristas';
      case 'hotel': return 'Hotéis';
      case 'restaurante': return 'Restaurantes';
    }
  };

  const getTipoIcon = () => {
    switch (tipoAtivo) {
      case 'motorista': return <Car className="w-5 h-5" />;
      case 'hotel': return <Building className="w-5 h-5" />;
      case 'restaurante': return <UtensilsCrossed className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-sm text-gray-500">Gerenciamento centralizado de todas as modalidades</p>
          </div>
        </div>

        {/* Abas principais (Tipos) */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 flex-wrap">
          {(['motorista', 'hotel', 'restaurante'] as BusinessType[]).map(tipo => {
            const data = tipo === 'motorista' ? motoristas : tipo === 'hotel' ? hoteis : restaurantes;
            const total = data.pendentes.length;
            
            return (
              <button
                key={tipo}
                onClick={() => { setTipoAtivo(tipo); setAbaAtiva('pendentes'); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  tipoAtivo === tipo
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tipo === 'motorista' && <Car className="w-4 h-4" />}
                {tipo === 'hotel' && <Building className="w-4 h-4" />}
                {tipo === 'restaurante' && <UtensilsCrossed className="w-4 h-4" />}
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                {total > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Seção do tipo selecionado */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          
          {/* Header da seção */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {getTipoIcon()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{getTipoLabel()}</h2>
            </div>
            <button
              onClick={() => fetchDados(tipoAtivo)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5"
            >
              {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Atualizar
            </button>
          </div>

          {/* Abas secundárias (Pendentes/Aprovados) */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
            <button
              onClick={() => setAbaAtiva('pendentes')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                abaAtiva === 'pendentes'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendentes
              {currentData.pendentes.length > 0 && (
                <span className="ml-2 bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {currentData.pendentes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAbaAtiva('aprovados')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                abaAtiva === 'aprovados'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Aprovados
              {currentData.aprovados.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {currentData.aprovados.length}
                </span>
              )}
            </button>
          </div>

          {/* Conteúdo */}
          {carregando ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-sm">Carregando...</p>
            </div>
          ) : lista.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Check className="w-14 h-14 mb-4 text-green-400" />
              <p className="text-base font-medium text-gray-600">
                {abaAtiva === 'pendentes' ? 'Nenhum cadastro pendente' : 'Nenhum registrado aprovado'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lista.map(r => (
                <RegistrationCard
                  key={r.id}
                  r={r}
                  businessType={tipoAtivo}
                  acaoId={acaoId}
                  getCidades={getCidades}
                  onAprovar={abaAtiva === 'pendentes' ? (id) => executarAcao(tipoAtivo, 'aprovar', id) : undefined}
                  onRejeitar={abaAtiva === 'pendentes' ? (id) => executarAcao(tipoAtivo, 'rejeitar', id) : undefined}
                  onExcluir={abaAtiva === 'aprovados' ? (id) => executarAcao(tipoAtivo, 'excluir', id) : undefined}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminUnificado;
