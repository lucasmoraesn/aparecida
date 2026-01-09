import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, User, Minus, Plus, BedDouble, ChevronDown } from 'lucide-react';

const BookingSearch = () => {
  const [destination] = useState('Aparecida');
  const [dates, setDates] = useState({
    checkin: '',
    checkout: ''
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setIsGuestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Definir datas padrão (amanhã e depois de amanhã) se estiverem vazias
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    setDates({
      checkin: tomorrow.toISOString().split('T')[0],
      checkout: dayAfter.toISOString().split('T')[0]
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Base URL do Booking (página da cidade de Aparecida)
    const baseUrl = 'https://www.booking.com/city/br/aparecida.pt-br.html';
    
    // Construir query params
    const params = new URLSearchParams();
    if (dates.checkin) params.append('checkin', dates.checkin);
    if (dates.checkout) params.append('checkout', dates.checkout);
    params.append('group_adults', guests.adults.toString());
    params.append('group_children', guests.children.toString());
    params.append('no_rooms', guests.rooms.toString());
    
    const targetUrl = `${baseUrl}?${params.toString()}`;
    const encodedUrl = encodeURIComponent(targetUrl);
    
    // Link Awin
    const awinLink = `https://www.awin1.com/cread.php?awinmid=18120&awinaffid=2711492&clickref=aparecida_hoteis&ued=${encodedUrl}`;
    
    // Abrir em nova aba
    window.open(awinLink, '_blank');
  };

  const updateGuests = (type: 'adults' | 'children' | 'rooms', operation: 'inc' | 'dec') => {
    setGuests(prev => {
      const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
      
      // Validações mínimas
      if (type === 'adults' && newValue < 1) return prev;
      if (type === 'rooms' && newValue < 1) return prev;
      if (type === 'children' && newValue < 0) return prev;
      
      return { ...prev, [type]: newValue };
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 relative z-10 px-4">
      <div className="bg-blue-400 p-1 rounded-lg shadow-xl">
        <div className="bg-white p-6 rounded text-gray-800">
            <div className="mb-6 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pesquise aqui os hotéis em Aparecida</h2>
                <p className="text-gray-600 text-base">Insira suas datas e veja os preços e ofertas de hotéis em Aparecida. Você será redirecionado para a página do Booking.</p>
            </div>

          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row flex-wrap gap-3 items-stretch relative">
            
            {/* Destino */}
            <div className="flex-1 relative group min-w-[200px] w-full lg:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <BedDouble className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={destination}
                readOnly
                className="block w-full h-14 pl-10 pr-3 border border-blue-300 rounded-md leading-5 bg-gray-50 text-gray-700 font-semibold focus:outline-none cursor-default shadow-sm"
              />
            </div>

            {/* Datas */}
            <div className="flex-[2] flex flex-col sm:flex-row gap-2 min-w-[280px] w-full lg:w-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={dates.checkin}
                  onChange={(e) => setDates({...dates, checkin: e.target.value})}
                  className="block w-full h-14 pl-10 pr-3 border border-blue-300 rounded-md leading-5 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm font-medium transition-colors cursor-pointer shadow-sm hover:bg-gray-50"
                  placeholder="Check-in"
                  required
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={dates.checkout}
                  onChange={(e) => setDates({...dates, checkout: e.target.value})}
                  className="block w-full h-14 pl-10 pr-3 border border-blue-300 rounded-md leading-5 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm font-medium transition-colors cursor-pointer shadow-sm hover:bg-gray-50"
                  placeholder="Check-out"
                  required
                />
              </div>
            </div>

            {/* Hóspedes */}
            <div className="flex-1 relative min-w-[240px] w-full lg:w-auto" ref={guestRef}>
              <button
                type="button"
                onClick={() => setIsGuestOpen(!isGuestOpen)}
                className={`w-full h-14 bg-white border border-blue-300 rounded-md pl-10 pr-8 text-left cursor-pointer focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm flex items-center gap-2 relative transition-colors hover:bg-gray-50 shadow-sm ${isGuestOpen ? 'ring-2 ring-blue-600 border-transparent' : ''}`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <span className="block truncate font-medium text-gray-700">
                  {guests.adults} adultos · {guests.children} crianças · {guests.rooms} quartos
                </span>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isGuestOpen ? 'transform rotate-180' : ''}`} />
                </div>
              </button>

              {isGuestOpen && (
                <div className="lg:absolute lg:top-full lg:left-0 lg:right-auto lg:w-80 lg:shadow-xl lg:border-gray-200 mt-2 bg-white rounded-lg p-4 border border-blue-300 z-50 w-full static shadow-none">
                  {/* Adultos */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">Adultos</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuests('adults', 'dec')}
                        disabled={guests.adults <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-base font-medium">{guests.adults}</span>
                      <button
                        type="button"
                        onClick={() => updateGuests('adults', 'inc')}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Crianças */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">Crianças</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuests('children', 'dec')}
                        disabled={guests.children <= 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-base font-medium">{guests.children}</span>
                      <button
                        type="button"
                        onClick={() => updateGuests('children', 'inc')}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quartos */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Quartos</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuests('rooms', 'dec')}
                        disabled={guests.rooms <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-base font-medium">{guests.rooms}</span>
                      <button
                        type="button"
                        onClick={() => updateGuests('rooms', 'inc')}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Buscar */}
            <button
              type="submit"
              className="h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-md hover:shadow-lg lg:w-auto w-full min-w-[150px]"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingSearch;
