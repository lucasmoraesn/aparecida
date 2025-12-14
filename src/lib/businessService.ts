import { supabase } from './supabase';

export interface BusinessRegistration {
   id?: number;
   establishment_name: string;
   category: string;
   address: string;
   location: string;
   photos: string[];
   whatsapp: string;
   phone?: string;
   description: string;
   plan_id: string;
   status?: 'pending' | 'approved' | 'rejected';
   payment_status?: 'pending' | 'paid' | 'failed';
   created_at?: string;
   updated_at?: string;
}

export interface BusinessPlan {
  id: string;   
  name: string;
  price: number;
  features: string[];
  is_active: boolean;
}

export interface Payment {
   id?: number;
   registration_id: number;
   amount: number;
   currency: string;
   payment_method: 'credit_card';
   payment_provider: string;
   provider_payment_id?: string;
   status: 'pending' | 'approved' | 'failed' | 'cancelled';
   created_at?: string;
   updated_at?: string;
}

export class BusinessService {
   // Use relative paths - API is on same origin
   private static API_BASE = "";

   // 🔹 Buscar planos via backend (evita problemas de RLS)
   static async getPlans(): Promise<BusinessPlan[]> {
      const response = await fetch(`${this.API_BASE}/api/plans`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
         throw new Error(`Erro ao buscar planos: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.map((plan: any) => ({
         ...plan,
         features: plan.features || [],
         is_active: true
      }));
   }

   // 🔹 Criar cadastro de negócio (apenas salva no DB)
   static async createRegistration(registration: BusinessRegistration): Promise<string> {
      console.log('🔗 URL da API:', this.API_BASE);
      console.log('📤 Enviando cadastro:', registration);
      
      const response = await fetch(`${this.API_BASE}/api/register-business`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(registration),
      });

      console.log('📥 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         console.error('❌ Erro do servidor:', errorData);
         throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📥 Resultado do servidor:', result);
      return result.business_id || result.businessId;
   }

   // 🔹 Criar assinatura com Stripe Billing
   static async createSubscription(
      planId: string, 
      businessId: string, 
      customer: { email: string; name?: string; tax_id?: string }
   ): Promise<{ checkoutUrl: string; subscriptionId: string }> {
      console.log('📤 Criando assinatura Stripe:', { planId, businessId, customer });
      
      const response = await fetch(`${this.API_BASE}/api/create-subscription`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ planId, businessId, customer }),
      });

      console.log('📥 Status da resposta (subscription):', response.status, response.statusText);

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         console.error('❌ Erro ao criar assinatura:', errorData);
         
         throw new Error(
            errorData.message || 
            errorData.error || 
            `Erro ao criar assinatura: ${response.status} - ${response.statusText}`
         );
      }

      const result = await response.json();
      console.log('✅ Assinatura criada com sucesso:', result);
      
      // Validar resposta
      if (!result.checkoutUrl) {
         throw new Error('URL de checkout não retornada pelo servidor');
      }
      
      return {
         checkoutUrl: result.checkoutUrl,
         subscriptionId: result.subscription_id,
      };
   }


   // 🔹 Buscar cadastro por ID (somente leitura → Supabase)
   static async getRegistration(id: number): Promise<BusinessRegistration | null> {
      const { data, error } = await supabase
         .from('business_registrations')
         .select(`
            *,
            business_plans(name, price, features)
         `)
         .eq('id', id)
         .single();

      if (error) {
         if (error.code === 'PGRST116') return null;
         throw new Error(`Erro ao buscar cadastro: ${error.message}`);
      }

      return data;
   }

   // 🔹 Criar pagamento (chama backend!)
   static async createPayment(payment: Payment): Promise<number> {
      const response = await fetch(`${this.API_BASE}/api/create-payment`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payment)
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Erro ao criar pagamento');
      }
      const result = await response.json();
      return result.id;
   }

   // 🔹 Atualizar status do pagamento (backend)
   static async updatePaymentStatus(paymentId: number, status: Payment['status'], providerPaymentId?: string): Promise<void> {
      const response = await fetch(`${this.API_BASE}/api/update-payment-status`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ paymentId, status, providerPaymentId })
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Erro ao atualizar pagamento');
      }
   }

   // 🔹 Atualizar status do cadastro (backend)
   static async updateRegistrationStatus(registrationId: number, status: BusinessRegistration['status'], paymentStatus?: BusinessRegistration['payment_status']): Promise<void> {
      const response = await fetch(`${this.API_BASE}/api/update-registration-status`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ registrationId, status, paymentStatus })
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Erro ao atualizar cadastro');
      }
   }

   // 🔹 Buscar pagamento por ID (somente leitura → Supabase)
   static async getPayment(id: number): Promise<Payment | null> {
      const { data, error } = await supabase
         .from('payments')
         .select('*')
         .eq('id', id)
         .single();

      if (error) {
         if (error.code === 'PGRST116') return null;
         throw new Error(`Erro ao buscar pagamento: ${error.message}`);
      }

      return data;
   }

   // 🔹 Enviar e-mail para administrador (simulado)
   static async sendAdminEmail(registration: BusinessRegistration): Promise<void> {
      const emailData = {
         to: "admin@aparecida.com",
         subject: 'Novo Cadastro de Estabelecimento - Aparecida',
         html: `
            <h2>Novo Cadastro</h2>
            <p><strong>Nome:</strong> ${registration.establishment_name}</p>
            <p><strong>Categoria:</strong> ${registration.category}</p>
            <p><strong>Endereço:</strong> ${registration.address}</p>
            <p><strong>WhatsApp:</strong> ${registration.whatsapp}</p>
            <p><strong>Descrição:</strong> ${registration.description}</p>
            <p><strong>Data do Cadastro:</strong> ${new Date().toLocaleString('pt-BR')}</p>
         `
      };
      console.log("📧 Email simulado:", emailData);
   }
}

