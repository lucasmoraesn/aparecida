import React, { ReactNode } from 'react';

interface FormInputFieldProps {
  label: string;
  icon?: ReactNode;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme?: 'dark' | 'light'; // dark = fundo escuro, light = fundo claro
}

export default function FormInputField({
  label,
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  theme = 'dark',
}: FormInputFieldProps) {
  const isDark = theme === 'dark';
  
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Label */}
      <p className={`font-forum text-2xl leading-6 font-normal ${
        isDark ? 'text-white' : 'text-hotel-dark'
      }`}>
        {label}
      </p>

      {/* Input Container */}
      <div className="relative w-full h-[45px]">
        {/* Input Background */}
        <div className={`absolute inset-0 opacity-40 rounded-none ${
          isDark ? 'bg-hotel-input' : 'bg-gray-300'
        }`} />

        {/* Input Content - Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`flex-1 bg-transparent font-poppins font-light text-sm outline-none ${
              isDark ? 'text-hotel-gold placeholder-hotel-gold/50' : 'text-gray-700 placeholder-gray-500'
            }`}
          />
          {icon && (
            <div className="flex items-center justify-center ml-2 flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
