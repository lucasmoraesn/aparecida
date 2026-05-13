import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { O_QUE_FAZER_ANCHOR_IDS } from '../data/oQueFazerGuia';

const WhatToDoAparecida = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '');
    if (!hash) return;
    const id = decodeURIComponent(hash);
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-white page-container">
      {O_QUE_FAZER_ANCHOR_IDS.map((id) => (
        <section
          key={id}
          id={id}
          className="min-h-screen scroll-mt-28"
          aria-label={id}
        />
      ))}
    </div>
  );
};

export default WhatToDoAparecida;
