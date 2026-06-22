import { getApiBaseUrl } from './apiBase';

export type EbookPurchaseStatus = 'pending' | 'paid' | 'failed';

export type EbookCheckSessionResponse = {
  success: boolean;
  status?: EbookPurchaseStatus | 'approved';
  email?: string;
  error?: string;
};

export type EbookCheckoutResponse = {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
};

/** Inicia checkout Stripe — nunca expõe chaves secretas */
export async function startEbookCheckout(): Promise<string> {
  const response = await fetch(`${getApiBaseUrl()}/api/ebook/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const data: EbookCheckoutResponse = await response.json();

  if (!response.ok || !data.checkoutUrl) {
    throw new Error(data.error || 'Falha ao iniciar checkout');
  }

  return data.checkoutUrl;
}

/** Polling do status após retorno do Stripe */
export async function checkEbookSession(sessionId: string): Promise<EbookCheckSessionResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/ebook/check-session?session_id=${encodeURIComponent(sessionId)}`
  );

  return response.json();
}

export function isEbookPaid(status?: string): boolean {
  return status === 'paid' || status === 'approved';
}

/** URL do endpoint seguro de download (valida pagamento no backend) */
export function getEbookDownloadUrl(sessionId: string): string {
  return `${getApiBaseUrl()}/api/ebook/download?session_id=${encodeURIComponent(sessionId)}`;
}
