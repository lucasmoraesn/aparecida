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
   plan_id: number;
   status?: 'pending' | 'approved' | 'rejected';
   payment_status?: 'pending' | 'paid' | 'failed';
   admin_email: string;
   contact_email?: string;
   created_at?: string;
   updated_at?: string;
}

export interface BusinessPlan {
   id: number;
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
   // Buscar planos disponíveis
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
         is_active: true // default, já que não existe mais a coluna
      }));
   }

   // Salvar cadastro de negócio
   static async createRegistration(registration: BusinessRegistration): Promise<number> {
      const { data, error } = await supabase
         .from('business_registrations')
         .insert([registration])
         .select('id')
         .single();

      if (error) {
         throw new Error(`Erro ao criar cadastro: ${error.message}`);
      }

      return data.id;
   }

   // Buscar cadastro por ID
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
         if (error.code === 'PGRST116') {
            return null; // Não encontrado
         }
         throw new Error(`Erro ao buscar cadastro: ${error.message}`);
      }

      return data;
   }

   // Criar pagamento
   static async createPayment(payment: Payment): Promise<number> {
      const { data, error } = await supabase
         .from('payments')
         .insert([payment])
         .select('id')
         .single();

      if (error) {
         throw new Error(`Erro ao criar pagamento: ${error.message}`);
      }

      return data.id;
   }

   // Atualizar status do pagamento
   static async updatePaymentStatus(paymentId: number, status: Payment['status'], providerPaymentId?: string): Promise<void> {
      const updateData: any = { status };
      if (providerPaymentId) {
         updateData.provider_payment_id = providerPaymentId;
      }

      const { error } = await supabase
         .from('payments')
         .update(updateData)
         .eq('id', paymentId);

      if (error) {
         throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
      }
   }

   // Atualizar status do cadastro
   static async updateRegistrationStatus(registrationId: number, status: BusinessRegistration['status'], paymentStatus?: BusinessRegistration['payment_status']): Promise<void> {
      const updateData: any = { status };
      if (paymentStatus) {
         updateData.payment_status = paymentStatus;
      }

      const { error } = await supabase
         .from('business_registrations')
         .update(updateData)
         .eq('id', registrationId);

      if (error) {
         throw new Error(`Erro ao atualizar cadastro: ${error.message}`);
      }
   }

   // Buscar pagamento por ID
   static async getPayment(id: number): Promise<Payment | null> {
      const { data, error } = await supabase
         .from('payments')
         .select('*')
         .eq('id', id)
         .single();

      if (error) {
         if (error.code === 'PGRST116') {
            return null;
         }
         throw new Error(`Erro ao buscar pagamento: ${error.message}`);
      }

      return data;
   }

   // Enviar e-mail para administrador
   static async sendAdminEmail(registration: BusinessRegistration): Promise<void> {
      // Aqui você implementaria a integração com seu serviço de e-mail
      // Por exemplo, usando Resend, SendGrid, ou uma API própria

      const emailData = {
         to: registration.admin_email,
         subject: 'Novo Cadastro de Estabelecimento - Aparecida',
         html: `
        <h2>Novo Cadastro de Estabelecimento</h2>
        <p><strong>Nome:</strong> ${registration.establishment_name}</p>
        <p><strong>Categoria:</strong> ${registration.category}</p>
        <p><strong>Endereço:</strong> ${registration.address}</p>
        <p><strong>WhatsApp:</strong> ${registration.whatsapp}</p>
        <p><strong>Descrição:</strong> ${registration.description}</p>
        <p><strong>Data do Cadastro:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <br>
        <p>Acesse o painel administrativo para revisar e aprovar este cadastro.</p>
      `
      };

      // Simular envio de e-mail (substitua pela implementação real)
      console.log('E-mail para administrador:', emailData);

      // Exemplo com fetch para uma API de e-mail:
      /*
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });
        
        if (!response.ok) {
          throw new Error('Falha ao enviar e-mail');
        }
      } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        // Não falhar o cadastro por erro de e-mail
      }
      */
   }

   // Aprovar cadastro e criar estabelecimento
   static async approveRegistration(registrationId: number): Promise<void> {
      const registration = await this.getRegistration(registrationId);
      if (!registration) {
         throw new Error('Cadastro não encontrado');
      }

      // Determinar a tabela baseada na categoria
      let targetTable: string;
      switch (registration.category.toLowerCase()) {
         case 'hotel':
         case 'pousada':
            targetTable = 'hotels';
            break;
         case 'restaurante':
         case 'lanchonete':
         case 'pizzaria':
            targetTable = 'restaurants';
            break;
         case 'loja':
         case 'artigos religiosos':
         case 'souvenirs':
            targetTable = 'shops';
            break;
         default:
            targetTable = 'attractions';
      }

      // Inserir na tabela apropriada
      const establishmentData = {
         name: registration.establishment_name,
         category: registration.category,
         rating: 0.0,
         address: registration.address,
         phone: registration.phone || '',
         whatsapp: registration.whatsapp,
         image: registration.photos[0] || '',
         description: registration.description,
         featured: false
      };

      const { error } = await supabase
         .from(targetTable)
         .insert([establishmentData]);

      if (error) {
         throw new Error(`Erro ao criar estabelecimento: ${error.message}`);
      }

      // Atualizar status do cadastro para aprovado
      await this.updateRegistrationStatus(registrationId, 'approved', 'paid');
   }
}
