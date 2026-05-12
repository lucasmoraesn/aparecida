import React from 'react';
import { BookingForm } from '../components/booking';

export default function HotelBooking() {
  const handleBookingSubmit = (data: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
  }) => {
    console.log('Booking Form Submitted:', data);
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
    alert(`
      Check In: ${data.checkIn}
      Check Out: ${data.checkOut}
      Quartos: ${data.rooms}
      Hóspedes: ${data.guests}
    `);
  };

  return (
    <div className="w-full bg-hotel-dark min-h-screen">
      <BookingForm onSubmit={handleBookingSubmit} />
    </div>
  );
}
