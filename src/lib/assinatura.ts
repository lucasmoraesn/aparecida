export async function iniciarAssinatura(params: {
  planTitle: string;
  amount: number;
  frequency?: number;         // default 1
  frequency_type?: "months" | "days"; // default "months"
  payer_email: string;        // email do COMPRADOR de teste
}) {
  const resp = await fetch(`${import.meta.env.VITE_PUBLIC_URL_NGROK}/api/create-subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      planTitle: params.planTitle,
      amount: params.amount,
      frequency: params.frequency ?? 1,
      frequency_type: params.frequency_type ?? "months",
      payer_email: params.payer_email,
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Falha ao criar assinatura: ${resp.status} - ${t}`);
  }
  const data = await resp.json();
  if (!data?.init_point) throw new Error("Resposta sem init_point");
  window.location.href = data.init_point; // redirect para autorização
}
