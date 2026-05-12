import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FormSelectFieldProps {
  label: string;
  options: (string | number)[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  theme?: 'dark' | 'light'; // dark = fundo escuro, light = fundo claro
  /** Campos compactos do card de reserva (hero vertical premium) */
  variant?: 'default' | 'luxury';
}

export default function FormSelectField({
  label,
  options,
  value,
  onChange,
  theme = 'dark',
  variant = 'default',
}: FormSelectFieldProps) {
  const isDark = theme === 'dark';
  const isLuxury = variant === 'luxury';

  return (
    <div className={`w-full flex flex-col ${isLuxury ? 'gap-2' : 'gap-3'}`}>
      {/* Label */}
      <p className={`font-forum font-normal ${
        isLuxury
          ? `text-[1.05rem] leading-snug tracking-[0.04em] ${isDark ? 'text-white/90' : 'text-hotel-dark'}`
          : `text-2xl leading-6 ${isDark ? 'text-white' : 'text-hotel-dark'}`
      }`}>
        {label}
      </p>

      {/* Select Container */}
      <div className={`relative w-full ${isLuxury ? 'h-10' : 'h-[45px]'}`}>
        {/* Select Background */}
        <div className={`absolute inset-0 rounded-none ${
          isLuxury
            ? 'bg-hotel-booking-field border border-hotel-booking-field-border/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
            : isDark ? 'bg-hotel-input opacity-40' : 'bg-gray-300'
        }`} />

        {/* Custom Select - Overlay */}
        <div className={`absolute inset-0 flex items-center justify-between ${isLuxury ? 'px-3' : 'px-4'}`}>
          <select
            value={value}
            onChange={onChange}
            className={`flex-1 bg-transparent font-poppins outline-none appearance-none cursor-pointer ${
              isLuxury ? 'text-[13px] font-light leading-none' : 'font-light text-sm'
            } ${isDark ? 'text-hotel-gold' : 'text-gray-700'}`}
          >
            {options.map((option) => (
              <option key={option} value={option} className="bg-hotel-dark text-hotel-gold">
                {option}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <ChevronDown
            size={isLuxury ? 9 : 10}
            className={`flex-shrink-0 -scale-y-100 pointer-events-none opacity-80 ${
              isDark ? 'text-hotel-gold' : 'text-gray-600'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
