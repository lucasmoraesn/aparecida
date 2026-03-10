import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import type { Hotel } from '../data/hotels';
import { generateCompleteSrcSet } from '../lib/imageUtils';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const whatsappURL = `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(
    `Olá! Vi o ${hotel.name} no portal Aparecida do Norte e gostaria de mais informações sobre hospedagem.`
  )}`;

  const fullStars = Math.floor(hotel.rating);
  const hasHalf = hotel.rating % 1 >= 0.5;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/* Cover image */}
      <div className="h-44 overflow-hidden bg-gray-100">
        <img
          srcSet={generateCompleteSrcSet(hotel.image)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={hotel.image}
          alt={`${hotel.name} – hotel em Aparecida SP`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{hotel.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < fullStars
                    ? 'text-yellow-400 fill-yellow-400'
                    : i === fullStars && hasHalf
                    ? 'text-yellow-400 fill-yellow-200'
                    : 'text-gray-300 fill-gray-100'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1 font-medium">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{hotel.distance_from_basilica}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <Link
            to={`/${hotel.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            Ver perfil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Claim section */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500 leading-snug">
          <span className="font-medium text-gray-700">Este hotel é seu?</span>
          <br />
          Gerencie este perfil gratuitamente.
        </p>
        <Link
          to="/cadastrar-negocio"
          className="shrink-0 inline-flex items-center gap-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Reivindicar perfil
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
