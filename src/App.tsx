import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Restaurants from './pages/Restaurants';
import ReligiousShops from './pages/ReligiousShops';
import TouristAttractions from './pages/TouristAttractions';
import Events from './pages/Events';
import AllEvents from './pages/AllEvents';
import BusinessRegistration from './pages/BusinessRegistration';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hoteis" element={<Hotels />} />
        <Route path="/restaurantes" element={<Restaurants />} />
        <Route path="/lojas-religiosas" element={<ReligiousShops />} />
        <Route path="/pontos-turisticos" element={<TouristAttractions />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/todos-eventos" element={<AllEvents />} />
        <Route path="/cadastrar-negocio" element={<BusinessRegistration />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;