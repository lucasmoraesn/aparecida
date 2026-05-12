import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import FormInputField from './FormInputField';
import FormSelectField from './FormSelectField';
import FormButton from './FormButton';

interface BookingFormProps {
  onSubmit?: (data: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
  }) => void;
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('24 December 2023');
  const [checkOut, setCheckOut] = useState('28 December 2023');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);

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
    <div className="w-full bg-hotel-dark flex items-center justify-center min-h-screen px-4 py-8 md:py-0">
      {/* Container Principal - Fidelidade ao Figma */}
      <div className="w-full max-w-[532px] flex flex-col gap-[60px] items-center px-[60px] py-[60px] md:px-[60px] md:py-[60px]">
        
        {/* Seção de Campos */}
        <div className="w-full flex flex-col gap-[32px]">
          
          {/* Check In */}
          <FormInputField
            label="Check In"
            placeholder="24 December 2023"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            icon={<Calendar size={21} className="text-hotel-gold" strokeWidth={1.5} />}
          />

          {/* Check Out */}
          <FormInputField
            label="Check Out"
            placeholder="28 December 2023"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            icon={<Calendar size={21} className="text-hotel-gold" strokeWidth={1.5} />}
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
              />
            </div>

            {/* Guest */}
            <div className="flex-1">
              <FormSelectField
                label="Guest"
                options={[1, 2, 3, 4, 5, 6, 7, 8]}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Botão */}
        <FormButton
          onClick={handleSubmit}
          icon={<ArrowRight size={7} className="text-hotel-gold" strokeWidth={2} />}
        >
          Check Availability
        </FormButton>
      </div>
    </div>
  );
}
