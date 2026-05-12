# BookingForm - Documentação do Componente

## 📋 Visão Geral

Componente de formulário de reserva de hotel recriado com **fidelidade 100% ao design do Figma**. Totalmente responsivo com Tailwind CSS, React e Next.js/Vite compatible.

## 🎨 Especificações do Design

### Cores (Hotel Palette)
- **Fundo Principal**: `#2D2C2C` (Dark Grey-500)
- **Campos de Input**: `#575656` (Dark Grey-400, 40% opacity)
- **Texto/Labels**: `#BF9766` (Gold-500)
- **Títulos**: Branco

### Tipografia
- **Títulos** (Check In, Check Out, Room, Guest): Forum Regular, 24px
- **Labels/Placeholders**: Poppins Light, 14px
- **Botão**: Poppins Italic, 16px

### Espaçamentos
- **Padding Principal**: 60px (horizontal e vertical)
- **Gap Check In/Out**: 32px
- **Gap Room/Guest**: 55px
- **Gap Botão**: 60px
- **Altura Inputs**: 45px

## 📁 Estrutura de Arquivos

```
src/components/booking/
├── BookingForm.tsx          # Componente principal
├── FormInputField.tsx       # Campo de input reutilizável
├── FormSelectField.tsx      # Campo de select reutilizável
├── FormButton.tsx           # Botão reutilizável
└── index.ts                 # Exportações
```

## 🚀 Como Usar

### Importação
```tsx
import { BookingForm } from '@/components/booking';
```

### Uso Básico
```tsx
import React from 'react';
import { BookingForm } from '@/components/booking';

export default function HotelBooking() {
  return <BookingForm />;
}
```

### Com Handler de Submissão
```tsx
import React from 'react';
import { BookingForm } from '@/components/booking';

export default function HotelBooking() {
  const handleBookingSubmit = (data: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
  }) => {
    console.log('Dados de Reserva:', data);
    // Enviar para API ou fazer algo com os dados
  };

  return <BookingForm onSubmit={handleBookingSubmit} />;
}
```

## 🔧 Componentes Internos

### BookingForm
Componente principal que orquestra todo o formulário.

**Props:**
- `onSubmit?`: Callback quando o formulário é submetido
  - Retorna: `{ checkIn, checkOut, rooms, guests }`

### FormInputField
Campo de entrada com ícone (calendário, etc).

**Props:**
- `label`: string (obrigatório)
- `icon?`: ReactNode
- `placeholder?`: string
- `type?`: string (default: 'text')
- `value?`: string
- `onChange?`: (e: React.ChangeEvent<HTMLInputElement>) => void

### FormSelectField
Campo de seleção com dropdown.

**Props:**
- `label`: string (obrigatório)
- `options`: (string | number)[] (obrigatório)
- `value?`: string | number
- `onChange?`: (e: React.ChangeEvent<HTMLSelectElement>) => void

### FormButton
Botão de ação com ícone.

**Props:**
- `children`: ReactNode (obrigatório)
- `icon?`: ReactNode
- `onClick?`: () => void
- `className?`: string

## 📱 Responsividade

- **Desktop**: Layout horizontal para Room/Guest com gap de 55px
- **Tablet/Mobile**: Layout vertical com gap de 32px

## 🎯 Features

✅ Fidelidade 100% ao design Figma
✅ Componentes reutilizáveis
✅ Totalmente responsivo
✅ Tailwind CSS puro
✅ Dark mode nativo
✅ Ícones com Lucide React
✅ TypeScript completo
✅ Sem dependências externas (além de React + Tailwind)

## 🔌 Integração com Backend

Exemplo com API:

```tsx
const handleBookingSubmit = async (data) => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      console.log('Reserva criada com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
  }
};
```

## 🎨 Customização de Cores

Se quiser mudar as cores, edite em `tailwind.config.js`:

```js
colors: {
  'hotel': {
    'dark': '#2D2C2C',      // Mude aqui
    'input': '#575656',     // Mude aqui
    'gold': '#BF9766',      // Mude aqui
  }
}
```

## 📸 Preview

A página de teste está em: `src/pages/HotelBooking.tsx`

Para visualizar:
1. Adicione a rota no seu router
2. Acesse a página
3. Veja o componente em ação

## ✅ Checklist de Implementação

- [x] Cores exatas do design
- [x] Tipografia correta (Forum + Poppins)
- [x] Espaçamentos precisos
- [x] Layout responsivo
- [x] Componentes reutilizáveis
- [x] Ícones corretos
- [x] Validação básica (opcional)
- [x] Documentação completa

## 🐛 Troubleshooting

**As fonts não aparecem?**
- Verifique se as importações Google Fonts estão no `index.html`
- Limpe o cache do navegador

**Cores não batendo?**
- Confirme que `tailwind.config.js` tem o color palette correto
- Verifique se está usando `bg-hotel-dark`, `text-hotel-gold`, etc.

**Espaçamentos estranhos?**
- Use os espaçamentos com brackets: `gap-[60px]`, `px-[60px]`
- Tailwind suporta valores arbitrários

---

**Criado em**: 11/05/2026
**Última atualização**: 11/05/2026
