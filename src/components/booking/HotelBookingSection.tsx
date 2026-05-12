import React, { useEffect, useRef, useState } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { ArrowRight, Calendar } from 'lucide-react';
import 'react-day-picker/style.css';
import FormSelectField from './FormSelectField';
import FormButton from './FormButton';

export interface HotelBookingSectionProps {
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
  onSubmit: (data: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
  }) => void;
}

function LuxuryDateField({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const display = value
    ? format(value, 'd MMMM yyyy', { locale: ptBR })
    : 'Selecione';

  return (
    <div ref={rootRef} className="relative w-full min-w-0 flex flex-col gap-2">
      <p className="font-forum text-[1.05rem] leading-snug tracking-[0.04em] text-white/90">
        {label}
      </p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative z-10 flex h-10 w-full items-center justify-between gap-2 border border-hotel-booking-field-border/70 bg-hotel-booking-field px-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-[border-color,box-shadow] hover:border-hotel-gold/30 focus-visible:ring-1 focus-visible:ring-hotel-gold/45"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className="truncate font-poppins text-[13px] font-light leading-tight text-hotel-gold">
            {display}
          </span>
          <Calendar className="h-4 w-4 flex-shrink-0 text-hotel-gold/90" strokeWidth={1.5} />
        </button>

        {open && (
          <div
            className="hotel-booking-calendar absolute right-0 z-50 mt-2 max-h-[min(320px,65vh)] w-[min(calc(100vw-2rem),288px)] overflow-auto rounded-sm border border-hotel-gold/22 bg-hotel-booking-card p-2.5 shadow-[0_28px_90px_rgba(0,0,0,0.72)]"
            role="dialog"
            aria-label={label}
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(d) => {
                onChange(d);
                setOpen(false);
              }}
              disabled={minDate ? { before: minDate } : undefined}
              defaultMonth={value ?? minDate}
              locale={ptBR}
              className="mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hero + card de reserva vertical, compacto, à direita (template Figma hotel).
 */
export default function HotelBookingSection({
  title,
  subtitle,
  backgroundImageUrl = '/images/aparecidafundo.png',
  onSubmit,
}: HotelBookingSectionProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const base = startOfDay(new Date());
    const inD = base;
    const outD = addDays(base, 1);
    setCheckIn(inD);
    setCheckOut(outD);
  }, []);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    if (checkOut <= checkIn) {
      setCheckOut(addDays(checkIn, 1));
    }
  }, [checkIn, checkOut]);

  const checkOutMin = checkIn ? addDays(checkIn, 1) : addDays(startOfDay(new Date()), 1);

  const handleSubmit = () => {
    if (!checkIn || !checkOut) return;
    onSubmit({
      checkIn: format(checkIn, 'yyyy-MM-dd'),
      checkOut: format(checkOut, 'yyyy-MM-dd'),
      rooms: Number(rooms),
      guests: Number(guests),
    });
  };

  return (
    <section className="relative w-full overflow-x-clip">
      <div
        className="relative min-h-[min(68vh,600px)] sm:min-h-[min(70vh,640px)] lg:min-h-[min(72vh,700px)] bg-cover bg-[center_35%] bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        {/* Overlay cinematográfico */}
        <div className="pointer-events-none absolute inset-0 bg-black/58" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/82"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/65"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl flex-col px-4 pb-[clamp(10rem,26vw,14rem)] pt-10 sm:px-6 sm:pb-[clamp(10.5rem,24vw,13rem)] sm:pt-12 md:px-8 lg:pb-36 lg:pt-14">
          {/* Copy — esquerda no desktop para abrir espaço ao card à direita */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[min(100%,26rem)] lg:text-left xl:max-w-[28rem]">
            <h1 className="font-forum text-[1.5rem] font-normal leading-[1.2] tracking-[0.06em] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.55)] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.05rem]">
              {title}
            </h1>
            <p className="mt-3 font-poppins text-[13px] font-light leading-relaxed tracking-wide text-white/82 sm:mt-4 sm:text-sm md:text-[0.9375rem]">
              {subtitle}
            </p>
          </div>

          {/* Card vertical — direita (mobile: centralizado na base) */}
          <div
            className="pointer-events-auto absolute bottom-0 left-1/2 w-[min(100%,19.25rem)] -translate-x-1/2 translate-y-[46%] sm:left-auto sm:right-5 sm:w-[min(100%,19.5rem)] sm:translate-x-0 sm:translate-y-[44%] md:right-7 lg:right-8 lg:w-[20rem] lg:translate-y-[42%] xl:right-10 xl:w-[20.5rem]"
          >
            <div
              className="border border-hotel-gold/18 bg-hotel-booking-card px-5 py-7 shadow-[0_32px_90px_rgba(0,0,0,0.62),0_1px_0_rgba(255,255,255,0.05)_inset,0_-1px_0_rgba(0,0,0,0.35)_inset] sm:px-6 sm:py-8"
              style={{ backgroundColor: '#2b2727' }}
            >
              <div className="flex flex-col gap-5">
                <LuxuryDateField
                  label="Check In"
                  value={checkIn}
                  onChange={setCheckIn}
                  minDate={startOfDay(new Date())}
                />
                <LuxuryDateField
                  label="Check Out"
                  value={checkOut}
                  onChange={setCheckOut}
                  minDate={checkOutMin}
                />
                <FormSelectField
                  label="Room"
                  options={[1, 2, 3, 4, 5, 6, 7, 8]}
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  theme="dark"
                  variant="luxury"
                />
                <FormSelectField
                  label="Guest"
                  options={[1, 2, 3, 4, 5, 6, 7, 8]}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  theme="dark"
                  variant="luxury"
                />
                <div className="pt-1">
                  <FormButton
                    onClick={handleSubmit}
                    variant="luxury"
                    icon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />}
                  >
                    Verificar disponibilidade
                  </FormButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Respiro para o card sobreposto */}
      <div
        className="h-[clamp(7.5rem,18vw,10.5rem)] shrink-0 sm:h-[clamp(8rem,16vw,10rem)] lg:h-[clamp(8.5rem,14vw,9.5rem)]"
        aria-hidden
      />
    </section>
  );
}
