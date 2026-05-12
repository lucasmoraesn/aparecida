import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import FormInputField from './FormInputField';
import FormSelectField from './FormSelectField';
import FormButton from './FormButton';

interface BookingFormHeroProps {
  onSubmit?: (data: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
  }) => void;
}

/**
 * Versão do BookingForm para uso em hero sections com background
 * Remove o background e padding para integrar melhor com layouts existentes
 */
export default function BookingFormHero({ onSubmit }: BookingFormHeroProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);

  // Definir datas padrão: check-in hoje, check-out amanhã (data local do sistema)
  React.useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setCheckIn(today.toLocaleDateString('en-CA'));
    setCheckOut(tomorrow.toLocaleDateString('en-CA'));
  }, []);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        checkIn,
        checkOut,
        rooms: Number(rooms),
        guests: Number(guests),
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Container - sem background próprio */}
      <div className="flex flex-col gap-[60px] items-center">
        
        {/* Seção de Campos */}
        <div className="w-full flex flex-col gap-[32px]">
          
          {/* Check In */}
          <FormInputField
            label="Check In"
            placeholder="Data de entrada"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            icon={<Calendar size={21} className="text-hotel-gold" strokeWidth={1.5} />}
            theme="dark"
          />

          {/* Check Out */}
          <FormInputField
            label="Check Out"
            placeholder="Data de saída"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            icon={<Calendar size={21} className="text-hotel-gold" strokeWidth={1.5} />}
            theme="dark"
          />

          {/* Room & Guest - Side by Side em Desktop, Coluna em Mobile */}
          <div className="w-full flex flex-col md:flex-row gap-[32px] md:gap-[55px]">
            {/* Room */}
            <div className="flex-1">
              <FormSelectField
                label="Room"
                options={[1, 2, 3, 4, 5, 6, 7, 8]}
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                theme="dark"
              />
            </div>

            {/* Guest */}
            <div className="flex-1">
              <FormSelectField
                label="Guest"
                options={[1, 2, 3, 4, 5, 6, 7, 8]}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                theme="dark"
              />
            </div>
          </div>
        </div>

        {/* Botão */}
        <FormButton
          onClick={handleSubmit}
          icon={<ArrowRight size={7} className="text-hotel-gold" strokeWidth={2} />}
          theme="dark"
        >
          Check Availability
        </FormButton>
      </div>
    </div>
  );
}
