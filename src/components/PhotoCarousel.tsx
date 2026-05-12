import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
  photos: string[];
  altText: string;
  autoPlay?: boolean;
  interval?: number;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  altText,
  autoPlay = true,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Se não houver fotos, retornar vazio
  if (!photos || photos.length === 0) {
    return (
      <div className="h-72 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Sem fotos disponíveis</p>
      </div>
    );
  }

  // Se houver apenas uma foto, exibir sem controles
  if (photos.length === 1) {
    return (
      <div className="h-72 overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={photos[0]}
          alt={altText}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [photos.length, autoPlay, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-72 overflow-hidden bg-gray-100 rounded-lg group">
      {/* Imagem principal */}
      <div className="relative w-full h-full">
        <img
          src={photos[currentIndex]}
          alt={`${altText} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>

      {/* Setas de navegação */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Próxima foto"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores de página */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para foto ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador de fotos */}
      <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
};

export default PhotoCarousel;
