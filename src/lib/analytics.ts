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

/** Disparado quando o usuário visita a landing page do Kit do Romeiro. */
export function trackKitView() {
  gtag('event', 'kit_view', {
    event_category: 'engagement',
    event_label: 'Visualizou Kit do Romeiro',
  });
}

/** Disparado quando o usuário clica no CTA de compra do Kit do Romeiro. */
export function trackKitCheckoutStarted() {
  gtag('event', 'kit_checkout_started', {
    event_category: 'ecommerce',
    event_label: 'Iniciou Checkout do Kit',
  });
}

/** Disparado quando a compra do Kit do Romeiro é finalizada com sucesso. */
export function trackKitCheckoutCompleted(transactionId: string, value = 19.90) {
  gtag('event', 'kit_checkout_completed', {
    event_category: 'conversion',
    transaction_id: transactionId,
    value: value,
    currency: 'BRL',
    items: [{ item_name: 'Kit Oficial do Romeiro 2026', price: value }]
  });
}

/** Disparado quando o usuário clica no botão para baixar o PDF. */
export function trackKitDownloaded() {
  gtag('event', 'kit_downloaded', {
    event_category: 'engagement',
    event_label: 'Baixou PDF do Kit',
  });
}

