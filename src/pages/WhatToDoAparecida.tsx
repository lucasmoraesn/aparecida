import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { O_QUE_FAZER_ANCHOR_IDS } from '../data/oQueFazerGuia';
import EbookCTA from '../components/EbookCTA';

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
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">O Que Fazer em Aparecida SP</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Descubra as principais atrações, pontos de peregrinação e pontos turísticos da Capital Mariana.
          </p>
        </div>

        {/* CTA Destaque do Ebook */}
        <EbookCTA />

        <div className="space-y-6">
          {O_QUE_FAZER_ANCHOR_IDS.map((id) => (
            <section
              key={id}
              id={id}
              className="scroll-mt-28 p-6 bg-white rounded-xl border border-slate-200"
            >
              <h2 className="text-xl font-bold capitalize text-slate-800 mb-2">
                {id.replace(/-/g, ' ')}
              </h2>
              <p className="text-slate-500 text-sm">
                Conteúdo em preparação. Para roteiros detalhados e planejamentos passo a passo deste ponto de interesse, consulte o nosso Kit Oficial do Romeiro 2026.
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatToDoAparecida;
