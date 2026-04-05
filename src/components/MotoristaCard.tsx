import React from 'react';
import { Car, Users, MapPin, Star, MessageCircle, Shield, Award } from 'lucide-react';
import type { Motorista } from '../data/motoristas';

interface MotoristaCardProps {
  motorista: Motorista;
}

const MotoristaCard: React.FC<MotoristaCardProps> = ({ motorista }) => {
  const whatsappMessage = encodeURIComponent(
    'Olá, encontrei você no site aparecidadonortesp.com.br'
  );
  const telefone = motorista.whatsapp || motorista.telefone;
  const whatsappLink = `https://wa.me/${telefone}?text=${whatsappMessage}`;

  const isPremium = motorista.plano === 'premium';
  const isDestaque = motorista.plano === 'destaque' || isPremium;

  // Limita cidades conforme plano
  const cidades = Array.isArray(motorista.cidades) ? motorista.cidades : [];
  const maxCidades = isPremium ? 10 : isDestaque ? 6 : 3;
  const cidadesExibidas = cidades.slice(0, maxCidades);

  return (
    <div
      className={`
        relative bg-white rounded-2xl shadow-lg overflow-hidden border
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
        ${isPremium
          ? 'border-purple-300 ring-2 ring-purple-200/60'
          : isDestaque
          ? 'border-amber-300 ring-2 ring-amber-200/60'
          : 'border-gray-200'
        }
      `}
    >
      {/* Badge Verificado — canto superior esquerdo */}
      {(motorista.verificado || isDestaque) && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-green-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
          <Shield className="w-3 h-3" />
          Verificado
        </div>
      )}

      {/* Badge Premium */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <Award className="w-3.5 h-3.5 fill-current" />
          Recomendado
        </div>
      )}

      {/* Badge Destaque */}
      {isDestaque && !isPremium && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <Star className="w-3.5 h-3.5 fill-current" />
          Destaque
        </div>
      )}

      {/* Foto */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-100">
        {(motorista.foto_url || motorista.foto) ? (
          <img
            src={motorista.foto_url || motorista.foto}
            alt={`Motorista particular ${motorista.nome} em Aparecida do Norte`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Car className="w-16 h-16 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {motorista.nome}
          </h3>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 sm:p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Car className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium">{motorista.veiculo}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-600 shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium">
              Até {motorista.passageiros} passageiro{motorista.passageiros !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-start gap-3 text-gray-700">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 text-purple-600 shrink-0 mt-0.5">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cidadesExibidas.map((cidade) => (
                <span
                  key={cidade}
                  className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                >
                  {cidade}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Descrição — só Destaque e Premium */}
        {(isDestaque || isPremium) && motorista.descricao && (
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            {motorista.descricao}
          </p>
        )}

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          id={`whatsapp-${motorista.id}`}
          className="
            flex items-center justify-center gap-2.5
            w-full py-3.5 rounded-xl
            bg-gradient-to-r from-green-500 to-green-600
            hover:from-green-600 hover:to-green-700
            text-white font-semibold text-base
            transition-all duration-300
            shadow-md hover:shadow-lg hover:shadow-green-200/50
            active:scale-[0.98]
          "
        >
          <MessageCircle className="w-5 h-5" />
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  );
};

export default MotoristaCard;
