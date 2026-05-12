import React, { ReactNode } from 'react';

interface FormButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  theme?: 'dark' | 'light';
  /** CTA compacto (card de reserva vertical premium) */
  variant?: 'default' | 'luxury';
}

export default function FormButton({
  children,
  icon,
  onClick,
  className = '',
  theme = 'dark',
  variant = 'default',
}: FormButtonProps) {
  const isDark = theme === 'dark';
  const isLuxury = variant === 'luxury';

  if (isLuxury) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center justify-center gap-2 whitespace-nowrap bg-hotel-gold py-2.5 px-5 text-hotel-booking-card font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_10px_28px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.12)_inset] border border-[#c9a56d]/90 hover:bg-[#d4b07e] hover:border-[#dcc18a] active:translate-y-px transition-[background-color,border-color,transform] duration-200 ${className}`}
      >
        <span>{children}</span>
        {icon && (
          <span className="flex items-center text-hotel-booking-card/95 group-hover:text-hotel-booking-card">
            {icon}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex gap-5 items-center justify-center px-8 py-4 hover:opacity-80 transition-opacity ${className}`}
    >
      <p className={`font-poppins italic text-base font-normal ${
        isDark ? 'text-hotel-gold' : 'text-white'
      }`}>
        {children}
      </p>
      {icon && (
        <div className="flex items-center justify-center">
          {icon}
        </div>
      )}
    </button>
  );
}
