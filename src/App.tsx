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
import Payment from './pages/Payment';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

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
        <Route path="/payment" element={<Payment />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;