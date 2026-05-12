# 🎨 Componente PricingCard - Guia de Uso

## Visão Geral

`PricingCard.tsx` é um componente reutilizável para exibir planos de preços com:
- 3 variantes de estilo: `light`, `highlighted`, `dark`
- Suporte a badge "Mais Escolhido"
- Animações com Framer Motion
- Loading states
- Preço antigo com desconto (opcional)

---

## Props

```typescript
interface PricingCardProps {
  title: string;                    // "Básico", "Destaque", "Premium"
  price: number;                    // 49.90, 99.90, 199.90
  description?: string;             // Descrição adicional (opcional)
  features: string[];               // Array de features
  isRecommended?: boolean;          // Mostra badge "Mais Escolhido"
  isLoading?: boolean;              // State do loading button
  onChoose: () => void;             // Callback ao clicar
  icon?: LucideIcon;                // Ícone Lucide (ex: Star, Shield, Award)
  oldPrice?: number;                // Preço antigo para strikethrough
  buttonText?: string;              // Texto do botão (default: "Escolher Plano")
  variant?: 'light' | 'dark' | 'highlighted';
}
```

---

## Variantes de Estilo

### 1. **LIGHT** (Padrão)
Usado para: Planos Básicos
```tsx
<PricingCard
  title="Básico"
  price={49.90}
  variant="light"
  features={[
    'Nome do motorista',
    'Tipo de veículo',
    'WhatsApp direto',
  ]}
  onChoose={() => handleSelectPlan()}
/>
```
**Characteristics:**
- Fundo branco
- Borda cinza
- Hover leve
- Botão cinza claro

---

### 2. **HIGHLIGHTED** (Recomendado)
Usado para: Planos Destaque (R$ 99,90)
```tsx
<PricingCard
  title="Destaque"
  price={99.90}
  variant="highlighted"
  isRecommended={true}
  features={[
    'Tudo do plano básico',
    'Destaque na listagem',
    'Selo "Motorista Verificado"',
  ]}
  buttonText="Escolher Destaque"
  onChoose={() => handleSelectPlan('destaque')}
/>
```
**Characteristics:**
- Borda azul 2px
- Shadow elevado (shadow-xl)
- Badge "Mais Escolhido" No topo
- Botão azul gradiente
- Animação de elevação ao hover

---

### 3. **DARK** (Premium)
Usado para: Planos Premium (R$ 199,90)
```tsx
<PricingCard
  title="Premium"
  price={199.90}
  variant="dark"
  icon={Award}
  features={[
    'Tudo do plano destaque',
    'Destaque máximo no topo',
    'Badge "Recomendado"',
  ]}
  onChoose={() => handleSelectPlan('premium')}
/>
```
**Characteristics:**
- Gradient background (slate-900 → slate-800)
- Texto amarelo/amber
- Botão amber
- Premium look and feel

---

## Exemplos de Uso Prático

### Exemplo 1: Planos Motoristas (PlanosMotoristas.tsx)

```tsx
import PricingCard from '../components/PricingCard';
import { Shield, Award } from 'lucide-react';

function PlanosMotoristas() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleChoosePlan = async (planType: string) => {
    setLoadingPlan(planType);
    // Navigation ou checkout...
    setLoadingPlan(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Básico */}
      <PricingCard
        title="Básico"
        price={49.90}
        variant="light"
        features={[
          'Nome do motorista',
          'Tipo de veículo',
          'WhatsApp direto',
          'Até 3 cidades atendidas',
          'Listagem padrão',
        ]}
        isLoading={loadingPlan === 'basico'}
        onChoose={() => handleChoosePlan('basico')}
      />

      {/* Destaque */}
      <PricingCard
        title="Destaque"
        price={99.90}
        variant="highlighted"
        isRecommended={true}
        features={[
          'Tudo do plano básico',
          'Destaque na listagem',
          'Selo "Motorista Verificado"',
          'Até 6 cidades atendidas',
          '1 foto do veículo',
        ]}
        isLoading={loadingPlan === 'destaque'}
        onChoose={() => handleChoosePlan('destaque')}
      />

      {/* Premium */}
      <PricingCard
        title="Premium"
        price={199.90}
        variant="dark"
        icon={Award}
        features={[
          'Tudo do plano destaque',
          'Destaque máximo no topo',
          'Badge "Recomendado"',
          'Até 10 cidades atendidas',
          'Galeria com fotos',
        ]}
        isLoading={loadingPlan === 'premium'}
        onChoose={() => handleChoosePlan('premium')}
      />
    </div>
  );
}
```

---

### Exemplo 2: Com Preço Antigo (Anchoragem)

```tsx
<PricingCard
  title="Destaque"
  price={99.90}
  oldPrice={149.90}  // Mostra R$ 149,90 riscado
  variant="highlighted"
  isRecommended={true}
  features={['Destaque', 'Selo verificado']}
  onChoose={() => handleSelectPlan()}
/>
```

Output visual:
```
R$ 149,90  -33%
R$ 99,90/mês
```

---

### Exemplo 3: Variação por Negócio

```tsx
// Para Hotéis (variant customizado para verde)
<PricingCard
  title="Destaque Hotel"
  price={99.90}
  variant="highlighted"  // Pode estender para variante "green"
  isRecommended={true}
  features={['Destaque na busca', 'Selo Hotel Verificado']}
/>

// Para Restaurantes (variant customizado para laranja)
<PricingCard
  title="Destaque Restaurante"
  price={99.90}
  variant="highlighted"  // Pode estender para variante "orange"
  isRecommended={true}
  features={['Destaque na busca', 'Especialidades listadas']}
/>
```

---

## Padrão de Cores por Negócio

### Motoristas
- **Destaque:** Azul (#2563eb)
- **Premium:** Slate (#1e293b)

### Hotéis
- **Destaque:** Azul (#2563eb)
- **Premium:** Slate (#1e293b)

### Restaurantes
- **Destaque:** Verde (#15803d) [atual]
- **Premium:** Laranja (#92400e) [atual]

---

## Integração com useState

```tsx
const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

const handleChoosePlan = async (planId: string) => {
  setLoadingPlan(planId);
  try {
    // Fazer checkout...
    await redirectToCheckout(planId);
  } finally {
    setLoadingPlan(null);
  }
};

// No render:
<PricingCard
  // ...
  isLoading={loadingPlan === 'destaque'}
  onChoose={() => handleChoosePlan('destaque')}
/>
```

---

## Próximas Melhorias

### 1. Variantes de Cores Dinâmicas
```tsx
variant?: 'light' | 'dark' | 'blue' | 'green' | 'orange';
```

### 2. Suporte a Múltiplos Ícones
```tsx
icon={Star}    // Para Básico
icon={Shield}  // Para Destaque
icon={Award}   // Para Premium
```

### 3. Customização de Theme
```tsx
theme?: 'default' | 'hotels' | 'restaurants' | 'motorists'
```

### 4. Suporte a Annual Billing
```tsx
billing?: 'monthly' | 'annual'
discount?: 25  // 25% discount for annual
```

---

## Checklist de Implementação

- [x] Componente criado
- [x] 3 variantes implementadas
- [x] Badge "Mais Escolhido" dinâmico
- [x] Animações Framer Motion
- [x] Loading states
- [x] Preço antigo/desconto
- [ ] Integração em todas as páginas Planos
- [ ] Variantes de cores por negócio
- [ ] Testes unitários

---

## Troubleshooting

### Badge não aparece
```tsx
// Verificar:
isRecommended={true}  // Deve ser true
variant="highlighted" // Funciona melhor com highlighted
```

### Animação lenta
```tsx
// Ajustar Framer Motion:
transition={{ duration: 0.3 }}  // Reduzir duração
viewport={{ once: true }}       // Mostrar apenas uma vez
```

### Preço não alinha
```tsx
// Usar className correto:
price={99.90}  // Número, não string!
// Não fazer: price="99.90"
```

---

**Versão:** 1.0.0  
**Última atualização:** 15 de Abril, 2025  
**Status:** ✅ Pronto para uso

