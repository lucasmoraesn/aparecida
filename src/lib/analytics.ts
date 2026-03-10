declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

/** Disparado quando o usuário chega à página de cadastro (intenção de signup). */
export function trackClickSignup() {
  gtag('event', 'click_signup', {
    event_category: 'engagement',
    event_label: 'Cadastrar Negócio',
  });
}

/** Disparado quando o cadastro do negócio é criado com sucesso no backend. */
export function trackAccountCreated(params?: { plan_name?: string; plan_id?: string }) {
  gtag('event', 'account_created', {
    event_category: 'conversion',
    plan_name: params?.plan_name,
    plan_id: params?.plan_id,
  });
}

/** Disparado quando o usuário faz login (via Supabase auth). */
export function trackLogin(method = 'email') {
  gtag('event', 'login', {
    method,
  });
}

/** Disparado quando o usuário seleciona um plano no formulário de cadastro. */
export function trackPlanSelected(params: { plan_name: string; plan_id: string; price: number }) {
  gtag('event', 'plan_selected', {
    event_category: 'engagement',
    plan_name: params.plan_name,
    plan_id: params.plan_id,
    value: params.price,
    currency: 'BRL',
  });
}

/** Disparado quando o pagamento é confirmado na página de sucesso do Stripe. */
export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency?: string;
  item_name?: string;
}) {
  gtag('event', 'purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency ?? 'BRL',
    items: params.item_name
      ? [{ item_name: params.item_name, price: params.value }]
      : undefined,
  });
}
