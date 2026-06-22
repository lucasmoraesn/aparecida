# 💻 Exemplos de Integração - Código Pronto para Copiar e Colar

## 1. Integração na Home.tsx

**Antes de tudo, importe os componentes:**
```tsx
import AdvertiseCard from '../components/AdvertiseCard';
import AdvertiseSection from '../components/AdvertiseSection';
```

**Exemplo completo da Home.tsx com publicidade:**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CategoryCarousel from '../components/CategoryCarousel';
import AdvertiseCard from '../components/AdvertiseCard';
import AdvertiseSection from '../components/AdvertiseSection';

const Home = () => {
  const bookingAffiliateURL = 'https://tidd.ly/4puN43K';

  const events = [
    {
      title: 'Missa Solene do Dia de Nossa Senhora',
      date: '12 de Outubro às 10:00h',
      location: 'Basílica Nacional',
      type: 'Religioso',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Festival de Inverno de Aparecida',
      date: '15-22 de Julho às 19:00h',
      location: 'Centro de Eventos',
      type: 'Cultural',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <>
      <Hero />

      <CategoryCarousel />

      {/* 🔥 NOVO - Card de Publicidade Destacado */}
      <section className=\"py-8 bg-white\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <AdvertiseCard />
        </div>
      </section>

      {/* Seção de Eventos - Existente */}
      <section className=\"py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <motion.div
            className=\"text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20\"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className=\"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6\">
              Eventos e <span className=\"bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent\">Celebrações</span>
            </h2>
            <p className=\"text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4\">
              Participe dos principais eventos religiosos e culturais da cidade
            </p>
          </motion.div>

          <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16\">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className=\"bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 hover-lift\"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className=\"text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4\">{event.title}</h3>
                <p className=\"text-sm sm:text-base text-gray-600 mb-3 sm:mb-4\">{event.date}</p>
                <p className=\"text-sm sm:text-base text-gray-500 mb-3 sm:mb-4\">{event.location}</p>
                <span className={`${event.color} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold`}>
                  {event.type}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className=\"text-center\"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to=\"/todos-eventos\"
              className=\"bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-75 inline-flex items-center gap-2 shadow-lg hover:shadow-xl\"
            >
              Ver Todos os Eventos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 🔥 NOVO - Seção de Publicidade Compacta */}
      <section className=\"py-8 bg-gray-50\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <AdvertiseSection 
            title=\"Quer que seu negócio seja encontrado aqui?\"
            description=\"Centenas de empresas locais já estão aumentando suas vendas através da nossa plataforma.\"
            variant=\"compact\"
          />
        </div>
      </section>
    </>
  );
};

export default Home;
```

---

## 2. Integração em Hotels.tsx

**Ao final do arquivo Hotels.tsx, adicione:**

```tsx
{/* 🔥 NOVO - CTA de Publicidade */}
<section className=\"py-12 md:py-16 bg-white\">
  <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
    <AdvertiseSection />
  </div>
</section>
```

**Versão compacta (se quiser em lateral):**

```tsx
<aside className=\"mt-8 md:mt-0\">
  <AdvertiseSection 
    title=\"Seu hotel aqui?\"
    variant=\"compact\"
  />
</aside>
```

---

## 3. Integração em Restaurants.tsx

**Mesmo padrão que Hotels:**

```tsx
{/* 🔥 NOVO - CTA de Publicidade */}
<section className=\"py-12 md:py-16 bg-white\">
  <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
    <AdvertiseSection 
      title=\"Seu restaurante não está aqui?\"
      description=\"Comece a receber contatos de turistas e visitantes.\"
    />
  </div>
</section>
```

---

## 4. Integração em Header/Navigation

**Adicione link no menu principal:**

```tsx
// Em Header.tsx ou Navigation.tsx, adicione:

<Link
  to=\"/anuncie-sua-empresa\"
  className=\"text-gray-600 hover:text-blue-600 font-semibold transition text-sm md:text-base\"
>
  📢 Anuncie
</Link>

// Ou como botão destacado:
<Link
  to=\"/anuncie-sua-empresa\"
  className=\"bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition text-sm md:text-base\"
>
  💚 Anuncie Seu Negócio
</Link>
```

---

## 5. Integração em Footer

**Adicione link no footer:**

```tsx
{/* Em Footer.tsx */}
<div className=\"space-y-4\">
  <h4 className=\"font-bold text-lg\">Para Empresas</h4>
  <ul className=\"space-y-2 text-gray-600\">
    <li>
      <Link to=\"/anuncie-sua-empresa\" className=\"hover:text-blue-600 transition\">
        Anuncie sua empresa
      </Link>
    </li>
    <li>
      <Link to=\"/anuncie-sua-empresa#plans\" className=\"hover:text-blue-600 transition\">
        Ver planos
      </Link>
    </li>
    <li>
      <a href=\"https://wa.me/555512982382931\" className=\"hover:text-green-600 transition\">
        Fale conosco
      </a>
    </li>
  </ul>
</div>
```

---

## 6. Integração em Páginas Específicas

### Exemplo: HotelsNearBasilica.tsx

```tsx
{/* No final da página, antes do Footer */}
<section className=\"py-12 bg-gray-50 rounded-2xl my-12\">
  <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
    <AdvertiseSection 
      title=\"Seu hotel perto da Basílica não está listado?\"
      description=\"Milhares de turistas procuram hospedagem próxima ao santuário todos os dias.\"
      variant=\"default\"
    />
  </div>
</section>
```

---

## 7. Botão Flutuante de Publicidade

**Adicione um botão flutuante para destacar a publicidade:**

```tsx
{/* Em App.tsx ou Home.tsx */}
import { MessageCircle } from 'lucide-react';

<motion.button
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => window.open('https://wa.me/555512982382931?text=Gostaria de anunciar meu negócio', '_blank')}
  className=\"fixed bottom-20 right-4 md:bottom-32 md:right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50\"
  title=\"Anuncie sua empresa\"
>
  <MessageCircle className=\"w-6 h-6\" />
</motion.button>
```

---

## 8. Landing Page Dedicada

**Se quiser uma landing page para campanhas (ex: Google Ads):**

Crie arquivo: `src/pages/AdvertiseLanding.tsx`

```tsx
import React from 'react';
import Advertise from './Advertise';

const AdvertiseLanding = () => {
  return (
    <>
      {/* Remove Header/Footer para landing page */}
      <Advertise />
    </>
  );
};

export default AdvertiseLanding;

// Em App.tsx, adicione:
<Route path=\"/anuncie-google-ads\" element={<AdvertiseLanding />} />
```

### URL para Google Ads:
```
https://aparecidadonortesp.com.br/anuncie-google-ads
```

---

## 9. Formulário Customizado

**Se quiser um formulário de cadastro integrado:**

```tsx
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const AdvertiseForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'hotel',
    whatsapp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = encodeURIComponent(
      `Olá! Gostaria de anunciar meu negócio:\\n` +
      `Nome: ${formData.businessName}\\n` +
      `Tipo: ${formData.businessType}\\n` +
      `WhatsApp: ${formData.whatsapp}`
    );
    
    window.open(`https://wa.me/555512982382931?text=${message}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className=\"bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto\">
      <h2 className=\"text-2xl font-bold mb-6\">Anuncie Seu Negócio</h2>
      
      <input
        type=\"text\"
        placeholder=\"Nome do seu negócio\"
        value={formData.businessName}
        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
        className=\"w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500\"
        required
      />
      
      <select
        value={formData.businessType}
        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
        className=\"w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500\"
      >
        <option value=\"hotel\">Hotel</option>
        <option value=\"restaurante\">Restaurante</option>
        <option value=\"loja\">Loja</option>
        <option value=\"outro\">Outro</option>
      </select>
      
      <input
        type=\"tel\"
        placeholder=\"(12) 99999-9999\"
        value={formData.whatsapp}
        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
        className=\"w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500\"
        required
      />
      
      <button
        type=\"submit\"
        className=\"w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2\"
      >
        <MessageCircle className=\"w-5 h-5\" />
        Enviar pelo WhatsApp
      </button>
    </form>
  );
};

export default AdvertiseForm;
```

---

## 10. Analytics - Rastrear Cliques

**Adicione tracking em App.tsx:**

```tsx
const trackAdvertiseClick = (source: string) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'advertise_click', {
      'event_category': 'engagement',
      'event_label': source,
      'value': 1
    });
  }
  
  // Seu tracking personalizado
  console.log(`Clique em publicidade - Origem: ${source}`);
};

// Depois use em cada botão:
<button onClick={() => trackAdvertiseClick('home_card')}>
  Anunciar Agora
</button>
```

---

## 📝 Checklist Visual

```
✅ Home.tsx
   - AdvertiseCard adicionado
   - AdvertiseSection compacta adicionado
   
✅ Hotels.tsx
   - AdvertiseSection ao final
   
✅ Restaurants.tsx
   - AdvertiseSection ao final
   
✅ ReligiousShops.tsx
   - AdvertiseSection ao final
   
✅ TouristAttractions.tsx
   - AdvertiseSection ao final
   
✅ Header.tsx
   - Link para /anuncie-sua-empresa
   
✅ Footer.tsx
   - Seção \"Para Empresas\"
   - Links de publicidade
   
✅ Analytics
   - Rastreamento de cliques
   - Conversion tracking
```

---

## 🚀 Resultado Visual Esperado

Após integração:
1. ✅ Home com card destacado
2. ✅ Menu com link \"Anuncie\"
3. ✅ Todas as páginas com CTA
4. ✅ Footer com links de publicidade
5. ✅ Landing page completa
6. ✅ WhatsApp integrado

---

**Status:** ✅ Pronto para Copiar e Colar
**Próximo:** Testar em localhost e fazer deploy
