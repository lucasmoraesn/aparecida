import React from "react";

export default function MercadoPagoButton() {
  const handleCheckout = async () => {
    const response = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Produto Teste",
        unit_price: 100,
        quantity: 1,
        success: import.meta.env.VITE_PUBLIC_URL_NGROK + "/success",
        failure: import.meta.env.VITE_PUBLIC_URL_NGROK + "/failure",
        pending: import.meta.env.VITE_PUBLIC_URL_NGROK + "/pending",
      }),
    });
    const data = await response.json();
    if (data.id) {
      const mp = new (window as any).MercadoPago(
        import.meta.env.VITE_MP_PUBLIC_KEY_SANDBOX,
        { locale: "pt-BR" }
      );
      mp.checkout({ preference: { id: data.id }, autoOpen: true });
    } else {
      alert("Erro ao criar preferência: " + (data.error || ""));
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        background: "#009ee3",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "12px 24px",
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      Pagar com Mercado Pago
    </button>
  );
}
