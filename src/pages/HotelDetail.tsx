import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Star, MapPin, MessageCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { getHotelBySlug } from '../data/hotels';
import { generateCompleteSrcSet } from '../lib/imageUtils';

const HotelDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const hotel = slug ? getHotelBySlug(slug) : undefined;

  useEffect(() => {
    if (!hotel) return;
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';

    document.title = `${hotel.name} – Hotel em Aparecida SP perto da Basílica`;
    meta?.setAttribute(
      'content',
      `${hotel.name} em Aparecida SP. ${hotel.description} ${hotel.distance_from_basilica}. Entre em contato pelo WhatsApp ou reivindique o perfil gratuitamente.`
    );

    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, [hotel]);

  if (!hotel) {
    return <Navigate to="/hoteis-em-aparecida-sp" replace />;
  }

  const whatsappURL = `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(
    `Olá! Vi o ${hotel.name} no portal Aparecida do Norte e gostaria de mais informações sobre hospedagem.`
  )}`;

  const fullStars = Math.floor(hotel.rating);
  const hasHalf = hotel.rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-gray-50 page-container">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Início
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/hoteis-em-aparecida-sp" className="hover:text-blue-600 transition-colors">
            Hotéis em Aparecida SP
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium truncate">{hotel.name}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          to="/hoteis-em-aparecida-sp"
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista de hotéis
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Hero image */}
          <div className="h-56 sm:h-72 overflow-hidden bg-gray-100">
            <img
              srcSet={generateCompleteSrcSet(hotel.image)}
              sizes="(max-width: 640px) 100vw, 100vw"
              src={hotel.image}
              alt={`${hotel.name} – hotel em Aparecida SP`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {hotel.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < fullStars
                      ? 'text-yellow-400 fill-yellow-400'
                      : i === fullStars && hasHalf
                      ? 'text-yellow-400 fill-yellow-200'
                      : 'text-gray-300 fill-gray-100'
                  }`}
                />
              ))}
              <span className="text-base text-gray-700 font-semibold ml-1">
                {hotel.rating.toFixed(1)}
              </span>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{hotel.distance_from_basilica}</span>
            </div>
          </div>

          {/* Description & address */}
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Sobre o hotel</h2>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-1">Localização</h2>
              <div className="flex items-start gap-1.5 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{hotel.address}</span>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Contato</h2>
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Falar pelo WhatsApp
              </a>
            </div>
          </div>

          {/* Claim section */}
          <div className="bg-blue-50 border-t border-blue-100 p-6 sm:p-8">
            <p className="text-sm font-semibold text-gray-800 mb-1">Este hotel é seu?</p>
            <p className="text-sm text-gray-600 mb-4">
              Gerencie este perfil gratuitamente, atualize informações e receba contatos diretos de hóspedes.
            </p>
            <Link
              to="/cadastrar-negocio"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Reivindicar este perfil
            </Link>
          </div>
        </div>

        {/* Back to listing */}
        <div className="mt-6 text-center">
          <Link
            to="/hoteis-em-aparecida-sp"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todos os hotéis em Aparecida SP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
