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
   payment_method: 'pix' | 'credit_card';
   payment_provider: string;
   provider_payment_id?: string;
   status: 'pending' | 'approved' | 'failed' | 'cancelled';
   pix_code?: string;
   pix_expires_at?: string;
   created_at?: string;
   updated_at?: string;
}

export class BusinessService {
   private static API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

   // 🔹 Buscar planos (pode ir direto ao Supabase, só leitura)
   static async getPlans(): Promise<BusinessPlan[]> {
      const { data, error } = await supabase
         .from('business_plans')
         .select('id, name, price, description, features')
         .order('price', { ascending: true });

      if (error) {
         throw new Error(`Erro ao buscar planos: ${error.message}`);
      }

      return data.map(plan => ({
         ...plan,
         features: plan.features || [],
         is_active: true
      }));
   }

   // 🔹 Criar cadastro de negócio + pagamento PagBank (chama backend!)
   static async registerBusiness(registration: BusinessRegistration): Promise<{ success: boolean; business_id: string; order_id: string; status: string; message: string }> {
      const response = await fetch(`${this.API_BASE}/api/register-business`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(registration),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Erro ao criar cadastro');
      }

      const result = await response.json();
      return result;
   }

   // 🔹 Criar cadastro de negócio apenas (sem assinatura - DEPRECATED)
   static async createRegistration(registration: BusinessRegistration): Promise<string> {
      const response = await fetch(`${this.API_BASE}/api/register-business`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(registration),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Erro ao criar cadastro');
      }

      const result = await response.json();
      return result.business.id;
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

