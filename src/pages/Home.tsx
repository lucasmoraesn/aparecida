import React from 'react';
import Hero from '../components/Hero';
import CategoryCarousel from '../components/CategoryCarousel';
import AdvertisePromoSection from '../components/AdvertisePromoSection';
import EbookCTA from '../components/EbookCTA';

const Home = () => {
  return (
    <>
      <Hero />

      <CategoryCarousel />

      {/* Seção Banner CTA para o Kit do Romeiro */}
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <EbookCTA />
      </div>

      <AdvertisePromoSection />
    </>
  );
};

export default Home;
