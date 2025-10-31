# 🚀 Configuração Completa do Mercado Pago Sandbox

## ⚠️ IMPORTANTE: MUDANÇA NO FORMATO DAS CREDENCIAIS (2024/2025)

**As credenciais de teste do Mercado Pago agora começam com `APP_USR` em vez de `TEST`!**

- ✅ **Novo formato:** `APP_USR-xxxx-xxxx-xxxx`
- ❌ **Formato antigo:** `TEST-xxxx-xxxx-xxxx`

Esta mudança foi feita para padronizar as chaves geradas para aplicações no Mercado Pago. As credenciais continuam sendo específicas para o ambiente de teste (sandbox) e funcionam da mesma forma.

## 📋 Pré-requisitos

- ✅ Conta de vendedor no Mercado Pago Sandbox
- ✅ Conta de comprador no Mercado Pago Sandbox
- ✅ URL pública do Ngrok configurada
- ✅ Projeto Vite funcionando
- ✅ **Credenciais atualizadas com formato APP_USR**

## 🔧 Passo 1: Configurar Variáveis de Ambiente

### 1.1 Criar arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
SUPABASE_PASSWORD=@Varredor27@@
SUPABASE_URL=https://rhkwickoweflamflgzeo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjIyODMsImV4cCI6MjA3MDMzODI4M30.Pz7Vsh0HQL17g-CRWJD7CHrX_KzN4YYFl57XxxNjJUQ

# Mercado Pago Sandbox Configuration (NOVO FORMATO APP_USR)
# ⚠️ IMPORTANTE: As credenciais de teste agora começam com APP_USR em vez de TEST
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4608108578465711-101014-7a20dddc6a29e8ba910afa03de6da1d9-2631380670
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-bb931ba5-fd10-4522-b446-6073b7aacff1

# Vite Environment Variables (para o frontend)
VITE_SUPABASE_URL=https://rhkwickoweflamflgzeo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa3dpY2tvd2VmbGFtZmxnemVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjIyODMsImV4cCI6MjA3MDMzODI4M30.Pz7Vsh0HQL17g-CRWJD7CHrX_KzN4YYFl57XxxNjJUQ

# Admin Email
VITE_ADMIN_EMAIL=admin@aparecida.com

# Ngrok URL (sua URL pública)
VITE_NGROK_URL=https://seu-ngrok-url.ngrok.io
```

### 1.2 Instalar dependência do Mercado Pago:

```bash
npm install mercadopago
```

## 🔧 Passo 2: Atualizar o Serviço de Pagamento para Sandbox

### 2.1 Criar arquivo `src/lib/mercadopagoSandbox.ts`:

```typescript
// Serviço específico para Mercado Pago Sandbox
export interface SandboxPaymentRequest {
  amount: number;
  description: string;
  payer_email: string;
  payment_method: 'pix' | 'credit_card';
  external_reference?: string;
  notification_url?: string;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
}

export interface SandboxPaymentResponse {
  id: string;
  status: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_amount: number;
  pix_code?: string;
  pix_expires_at?: string;
  external_reference?: string;
  init_point?: string; // URL para redirecionamento
}

export class MercadoPagoSandboxService {
  private static readonly ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
  private static readonly PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
 private static readonly NGROK_URL = import.meta.env.VITE_PUBLIC_URL_NGROK;


  // Verificar credenciais
  private static checkCredentials(): void {
    if (!this.ACCESS_TOKEN || !this.PUBLIC_KEY) {
      throw new Error('Credenciais do Mercado Pago Sandbox não configuradas');
    }
  }

  // Criar preferência de pagamento (recomendado para Sandbox)
  static async createPaymentPreference(request: SandboxPaymentRequest): Promise<SandboxPaymentResponse> {
    this.checkCredentials();

    const preferenceData = {
      items: [
        {
          title: request.description,
          unit_price: request.amount,
          quantity: 1,
        }
      ],
      payer: {
        email: request.payer_email
      },
      external_reference: request.external_reference,
      notification_url: `${this.NGROK_URL}/api/payment-webhook`,
      back_urls: {
        success: `${this.NGROK_URL}/payment/success`,
        failure: `${this.NGROK_URL}/payment/failure`,
        pending: `${this.NGROK_URL}/payment/pending`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [],
        installments: 1
      }
    };

    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferenceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar preferência: ${errorData.message || response.statusText}`);
      }

      const preference = await response.json();

      return {
        id: preference.id,
        status: 'pending',
        payment_method_id: 'preference',
        payment_type_id: 'preference',
        transaction_amount: request.amount,
        external_reference: request.external_reference,
        init_point: preference.init_point
      };
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      throw new Error('Falha ao criar preferência de pagamento');
    }
  }

  // Criar pagamento PIX direto (alternativa)
  static async createPixPayment(request: SandboxPaymentRequest): Promise<SandboxPaymentResponse> {
    this.checkCredentials();

    const paymentData = {
      transaction_amount: request.amount,
      description: request.description,
      payment_method_id: 'pix',
      payer: {
        email: request.payer_email
      },
      external_reference: request.external_reference,
      notification_url: `${this.NGROK_URL}/api/payment-webhook`
    };

    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar pagamento PIX: ${errorData.message || response.statusText}`);
      }

      const payment = await response.json();

      return {
        id: payment.id.toString(),
        status: payment.status,
        payment_method_id: payment.payment_method_id,
        payment_type_id: payment.payment_type_id,
        transaction_amount: payment.transaction_amount,
        pix_code: payment.point_of_interaction?.transaction_data?.qr_code,
        pix_expires_at: payment.point_of_interaction?.transaction_data?.qr_code_base64 ? 
          new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined,
        external_reference: payment.external_reference
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw new Error('Falha ao processar pagamento PIX');
    }
  }

  // Verificar status do pagamento
  static async getPaymentStatus(paymentId: string): Promise<any> {
    this.checkCredentials();

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao consultar pagamento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      throw new Error('Falha ao consultar status do pagamento');
    }
  }
}
```

## 🔧 Passo 3: Atualizar a Página de Pagamento

### 3.1 Modificar `src/pages/Payment.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, CheckCircle, ArrowLeft, Copy, AlertCircle, ExternalLink } from 'lucide-react';
import { MercadoPagoSandboxService } from '../lib/mercadopagoSandbox';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'preference' | 'pix'>('preference');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pixCode, setPixCode] = useState<string>('');
  const [pixExpiresAt, setPixExpiresAt] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { registrationId, formData, plan } = location.state || {};

  // Verificar se tem dados
  if (!formData || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dados não encontrados</h1>
          <p className="text-gray-600 mb-6">Por favor, preencha o formulário de cadastro primeiro.</p>
          <button
            onClick={() => navigate('/cadastrar-negocio')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Cadastro
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      if (!registrationId) {
        throw new Error('ID do cadastro não encontrado');
      }

      const paymentRequest = {
        amount: plan.price,
        description: `Cadastro - ${formData.establishmentName}`,
        payer_email: 'test_user_123456@testuser.com', // Email de teste do Sandbox
        payment_method: paymentMethod,
        external_reference: registrationId.toString()
      };

      let paymentResponse;

      if (paymentMethod === 'preference') {
        // Criar preferência de pagamento (recomendado)
        paymentResponse = await MercadoPagoSandboxService.createPaymentPreference(paymentRequest);
        setPaymentUrl(paymentResponse.init_point || '');
      } else {
        // Criar pagamento PIX direto
        paymentResponse = await MercadoPagoSandboxService.createPixPayment(paymentRequest);
        setPixCode(paymentResponse.pix_code || '');
        setPixExpiresAt(paymentResponse.pix_expires_at || '');
      }

      console.log('Pagamento criado:', paymentResponse);

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  const copyPixCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      alert('Código PIX copiado!');
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagamento Aprovado!</h1>
          <p className="text-gray-600 mb-6">
            Seu cadastro foi enviado com sucesso e está sendo analisado.
            Você receberá um e-mail de confirmação em breve.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/cadastrar-negocio')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao formulário
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalizar Pagamento (Sandbox)
            </h1>
            <p className="text-gray-600">
              Escolha a forma de pagamento para ativar seu cadastro
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumo do Pedido */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Cadastro</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{formData.establishmentName}</h3>
                  <p className="text-sm text-gray-600">{formData.category}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Plano Escolhido</h3>
                  <p className="text-lg font-bold text-blue-600">{plan.name}</p>
                  <p className="text-sm text-gray-600">R$ {plan.price.toFixed(2).replace('.', ',')}/mês</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Forma de Pagamento</h2>
              
              <div className="space-y-4">
                {/* Checkout Mercado Pago */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'preference' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('preference')}
                >
                  <div className="flex items-center">
                    <ExternalLink className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Checkout Mercado Pago</h3>
                      <p className="text-sm text-gray-600">Página de pagamento completa (Recomendado)</p>
                    </div>
                  </div>
                </div>

                {/* PIX */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <div className="flex items-center">
                    <QrCode className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">PIX</h3>
                      <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos de Pagamento */}
              {paymentMethod === 'pix' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  {pixCode ? (
                    <div className="text-center">
                      <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Escaneie o QR Code com seu app bancário
                      </p>
                      <div className="bg-white p-3 rounded border mb-4">
                        <p className="text-xs text-gray-500 mb-2">Código PIX</p>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm break-all">{pixCode}</p>
                          <button
                            onClick={copyPixCode}
                            className="ml-2 p-1 text-blue-600 hover:text-blue-800"
                            title="Copiar código"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {pixExpiresAt && (
                        <p className="text-xs text-gray-500">
                          Expira em: {new Date(pixExpiresAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">
                        Clique em "Gerar PIX" para obter o código de pagamento
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'preference' && paymentUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-sm text-green-700 mb-4">
                      Pagamento criado com sucesso! Clique no botão abaixo para acessar o checkout.
                    </p>
                    <button
                      onClick={redirectToPayment}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Acessar Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagem de Erro */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Botão de Pagamento */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod === 'preference' && paymentUrl)}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processando...' : paymentMethod === 'pix' && !pixCode ? 'Gerar PIX' : paymentMethod === 'preference' && paymentUrl ? 'Checkout Criado' : `Criar Pagamento R$ ${plan.price.toFixed(2).replace('.', ',')}`}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                <strong>MODO SANDBOX:</strong> Use os dados de teste do Mercado Pago para testar o pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
```

## 🔧 Passo 4: Configurar Webhooks (Opcional)

### 4.1 Criar arquivo `public/api/payment-webhook.js`:

```javascript
// Webhook para receber notificações do Mercado Pago
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { type, data } = req.body;
    
    console.log('Webhook recebido:', { type, data });
    
    if (type === 'payment') {
      // Processar notificação de pagamento
      const paymentId = data.id;
      console.log('Pagamento processado:', paymentId);
      
      // Aqui você pode atualizar o status no banco de dados
      // e enviar e-mails de confirmação
    }
    
    res.status(200).json({ received: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## 🔧 Passo 5: Configurar Credenciais do Sandbox

### 5.1 Obter credenciais do Sandbox:

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione "Sandbox"
3. Copie o **Access Token** e **Public Key**

### 5.2 Atualizar o arquivo `.env.local`:

```env
# Mercado Pago Sandbox Configuration
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4608108578465711-101014-7a20dddc6a29e8ba910afa03de6da1d9-2631380670
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-bb931ba5-fd10-4522-b446-6073b7aacff1
```

## 🧪 Passo 6: Testar o Fluxo Completo

### 6.1 Dados de teste do Sandbox:

**Comprador de teste:**
- Email: `test_user_123456@testuser.com`
- CPF: `12345678909`

**Cartões de teste:**
- Mastercard: `5031 4332 1540 6351`
- Visa: `4509 9535 6623 3704`
- CVV: `123`
- Data: `11/25`

### 6.2 Fluxo de teste:

1. **Preencher formulário** de cadastro
2. **Selecionar plano** (Básico, Intermediário ou Premium)
3. **Clicar em "Finalizar Cadastro e Pagar"**
4. **Escolher método de pagamento**:
   - **Checkout Mercado Pago**: Redireciona para página completa
   - **PIX**: Gera código QR para pagamento
5. **Usar dados de teste** para finalizar pagamento
6. **Verificar redirecionamento** de volta ao site

## 🔧 Passo 7: Configurar Ngrok (se necessário)

### 7.1 Instalar Ngrok:

```bash
npm install -g ngrok
```

### 7.2 Expor o projeto:

```bash
ngrok http 5173
```

### 7.3 Atualizar URL no `.env.local`:

```env
VITE_NGROK_URL=https://sua-url-ngrok.ngrok.io
```

## 🚨 Solução de Problemas

### Problema: Botão não funciona
**Solução:**
1. Verificar console do navegador para erros
2. Confirmar se as variáveis de ambiente estão carregadas
3. Verificar se o formulário está sendo validado corretamente

### Problema: Erro de CORS
**Solução:**
1. Usar Ngrok para URL pública
2. Configurar webhooks corretamente
3. Verificar se as credenciais estão corretas

### Problema: Pagamento não é processado
**Solução:**
1. Verificar logs do console
2. Confirmar se as credenciais do Sandbox estão corretas
3. Testar com dados de teste fornecidos

## ✅ Checklist Final

- [ ] Arquivo `.env.local` configurado
- [ ] Dependência `mercadopago` instalada
- [ ] Serviço `MercadoPagoSandboxService` criado
- [ ] Página de pagamento atualizada
- [ ] Credenciais do Sandbox configuradas
- [ ] URL do Ngrok configurada
- [ ] Teste com dados de teste realizado
- [ ] Webhook configurado (opcional)

## 🎯 Próximos Passos

1. **Testar fluxo completo** com dados de teste
2. **Configurar webhooks** para produção
3. **Implementar upload real** de imagens
4. **Criar painel administrativo** para aprovação
5. **Configurar e-mails** de confirmação

Com essa configuração, seu sistema de pagamento Sandbox estará funcionando perfeitamente! 🚀

