import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Camera, FileText, CheckCircle } from 'lucide-react';
import { BusinessService, BusinessPlan } from '../lib/businessService';

interface FormData {
   establishmentName: string;
   category: string;
   address: string;
   location: string;
   photos: File[];
   whatsapp: string;
   phone: string;
   description: string;
   plan: string;
   acceptTerms: boolean;
}

const BusinessRegistration: React.FC = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState<FormData>({
      establishmentName: '',
      category: '',
      address: '',
      location: '',
      photos: [],
      whatsapp: '',
      phone: '',
      description: '',
      plan: '',
      acceptTerms: false,
   });

   const [errors, setErrors] = useState<Partial<FormData>>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [plans, setPlans] = useState<BusinessPlan[]>([]);
   const [loadingPlans, setLoadingPlans] = useState(true);

   const categories = [
      'Hotel',
      'Loja',
      'Restaurante',
      'Lanchonete',
      'Artigos Religiosos',
      'Outro'
   ];

   // Carregar planos do banco de dados
   useEffect(() => {
      const loadPlans = async () => {
         try {
            const plansData = await BusinessService.getPlans();
            setPlans(plansData);
         } catch (error) {
            console.error('Erro ao carregar planos:', error);
            // Fallback para planos padrão em caso de erro
            setPlans([
               {
                  id: 1,
                  name: 'Básico',
                  price: 49.90,
                  features: ['Perfil básico do estabelecimento', 'Até 5 fotos', 'Informações de contato', 'Suporte por e-mail'],
                  is_active: true
               },
               {
                  id: 2,
                  name: 'Intermediário',
                  price: 99.90,
                  features: ['Perfil completo do estabelecimento', 'Até 10 fotos', 'Destaque na busca', 'Suporte prioritário', 'Relatórios básicos'],
                  is_active: true
               },
               {
                  id: 3,
                  name: 'Premium',
                  price: 199.90,
                  features: ['Perfil premium com destaque', 'Fotos ilimitadas', 'Destaque máximo na busca', 'Suporte 24/7', 'Relatórios avançados', 'Promoções exclusivas'],
                  is_active: true
               }
            ]);
         } finally {
            setLoadingPlans(false);
         }
      };

      loadPlans();
   }, []);

   const handleInputChange = (field: keyof FormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
         setErrors(prev => ({ ...prev, [field]: undefined }));
      }
   };

   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length < 3) {
         setErrors(prev => ({ ...prev, photos: 'Mínimo de 3 fotos obrigatório' }));
         return;
      }
      if (files.length > 10) {
         setErrors(prev => ({ ...prev, photos: 'Máximo de 10 fotos permitido' }));
         return;
      }

      const validFiles = files.filter(file =>
         file.type === 'image/jpeg' || file.type === 'image/png'
      );

      if (validFiles.length !== files.length) {
         setErrors(prev => ({ ...prev, photos: 'Apenas arquivos JPG/PNG são aceitos' }));
         return;
      }

      setFormData(prev => ({ ...prev, photos: validFiles }));
      setErrors(prev => ({ ...prev, photos: undefined }));
   };

   const formatWhatsApp = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) return `+55 ${numbers}`;
      if (numbers.length <= 6) return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
      if (numbers.length <= 10) return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`;
      return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
   };

   const validateForm = (): boolean => {
      const newErrors: Partial<FormData> = {};

      if (!formData.establishmentName.trim()) {
         newErrors.establishmentName = 'Nome do estabelecimento é obrigatório';
      }

      if (!formData.category) {
         newErrors.category = 'Categoria é obrigatória';
      }

      if (!formData.address.trim()) {
         newErrors.address = 'Endereço é obrigatório';
      }

      if (!formData.location.trim()) {
         newErrors.location = 'Localização no mapa é obrigatória';
      }

      if (formData.photos.length < 3) {
         newErrors.photos = 'Mínimo de 3 fotos obrigatório';
      }

      if (!formData.whatsapp.trim()) {
         newErrors.whatsapp = 'WhatsApp é obrigatório';
      }

      if (!formData.description.trim()) {
         newErrors.description = 'Descrição é obrigatória';
      }

      if (!formData.plan) {
         newErrors.plan = 'Escolha um plano';
      }

      if (!formData.acceptTerms) {
         newErrors.acceptTerms = 'Aceite os termos é obrigatório';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      setIsSubmitting(true);

      try {
         // Upload das fotos (simulado - você implementaria upload real)
         const photoUrls = formData.photos.map((_, index) =>
            `https://example.com/photos/photo-${Date.now()}-${index}.jpg`
         );

         // Criar cadastro no banco de dados
         const selectedPlan = plans.find(p => p.id.toString() === formData.plan);
         if (!selectedPlan) {
            throw new Error('Plano não encontrado');
         }

         const registrationData = {
            establishment_name: formData.establishmentName,
            category: formData.category,
            address: formData.address,
            location: formData.location,
            photos: photoUrls,
            whatsapp: formData.whatsapp,
            phone: formData.phone || undefined,
            description: formData.description,
            plan_id: selectedPlan.id,
            admin_email: 'admin@aparecida.com', // E-mail do administrador
            contact_email: 'contato@aparecida.com' // E-mail de contato
         };

         const registrationId = await BusinessService.createRegistration(registrationData);

         // Enviar e-mail para o administrador
         await BusinessService.sendAdminEmail(registrationData);

         // Redirecionar para página de pagamento
         navigate('/payment', {
            state: {
               registrationId,
               formData,
               plan: selectedPlan
            }
         });
      } catch (error) {
         console.error('Erro ao enviar formulário:', error);
         alert('Erro ao enviar formulário. Tente novamente.');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                     Cadastre seu Negócio
                  </h1>
                  <p className="text-gray-600">
                     Conecte-se com milhares de peregrinos em Aparecida
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome do Estabelecimento */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Estabelecimento *
                     </label>
                     <input
                        type="text"
                        value={formData.establishmentName}
                        onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.establishmentName ? 'border-red-500' : 'border-gray-300'
                           }`}
                        placeholder="Digite o nome do seu estabelecimento"
                     />
                     {errors.establishmentName && (
                        <p className="text-red-500 text-sm mt-1">{errors.establishmentName}</p>
                     )}
                  </div>

                  {/* Categoria */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                     </label>
                     <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                           }`}
                     >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                           <option key={category} value={category}>{category}</option>
                        ))}
                     </select>
                     {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                     )}
                  </div>

                  {/* Endereço */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo *
                     </label>
                     <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                           }`}
                        placeholder="Rua, número, bairro, cidade, estado, CEP"
                     />
                     {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                     )}
                  </div>

                  {/* Localização no Mapa */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localização no Mapa *
                     </label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                           type="text"
                           value={formData.location}
                           onChange={(e) => handleInputChange('location', e.target.value)}
                           className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                              }`}
                           placeholder="Digite o endereço ou arraste o marcador no mapa"
                        />
                     </div>
                     <div className="mt-2 h-48 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                           <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                           <p className="text-sm text-gray-500">Mapa será integrado aqui</p>
                        </div>
                     </div>
                     {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                     )}
                  </div>

                  {/* Fotos */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fotos do Estabelecimento * (3-10 imagens)
                     </label>
                     <div className="relative">
                        <Camera className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                           type="file"
                           multiple
                           accept="image/jpeg,image/png"
                           onChange={handlePhotoChange}
                           className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.photos ? 'border-red-500' : 'border-gray-300'
                              }`}
                        />
                     </div>
                     {formData.photos.length > 0 && (
                        <div className="mt-2">
                           <p className="text-sm text-gray-600">
                              {formData.photos.length} foto(s) selecionada(s)
                           </p>
                        </div>
                     )}
                     {errors.photos && (
                        <p className="text-red-500 text-sm mt-1">{errors.photos}</p>
                     )}
                  </div>

                  {/* WhatsApp */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp *
                     </label>
                     <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', formatWhatsApp(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                           }`}
                        placeholder="+55 (11) 99999-9999"
                     />
                     {errors.whatsapp && (
                        <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                     )}
                  </div>

                  {/* Telefone Fixo */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone Fixo (Opcional)
                     </label>
                     <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(11) 3333-3333"
                     />
                  </div>

                  {/* Descrição */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição do Negócio *
                     </label>
                     <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                           }`}
                        placeholder="Descreva seu negócio, serviços oferecidos, horários de funcionamento, etc."
                     />
                     {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                     )}
                  </div>

                  {/* Planos */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-4">
                        Escolha seu Plano *
                     </label>
                     {loadingPlans ? (
                        <div className="text-center py-8">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                           <p className="text-gray-600 mt-2">Carregando planos...</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {plans.map((plan) => (
                              <div
                                 key={plan.id}
                                 className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.plan === plan.id.toString()
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                 onClick={() => handleInputChange('plan', plan.id.toString())}
                              >
                                 <div className="text-center">
                                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">R$ {plan.price.toFixed(2).replace('.', ',')}/mês</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                       {plan.features.map((feature, index) => (
                                          <li key={index} className="flex items-center">
                                             <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                             {feature}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                     {errors.plan && (
                        <p className="text-red-500 text-sm mt-1">{errors.plan}</p>
                     )}
                  </div>

                  {/* Termos */}
                  <div className="flex items-start">
                     <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                     />
                     <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                        Aceito os{' '}
                        <a href="/termos" className="text-blue-600 hover:underline">
                           termos de uso
                        </a>{' '}
                        e{' '}
                        <a href="/privacidade" className="text-blue-600 hover:underline">
                           política de privacidade
                        </a>{' '}
                        *
                     </label>
                  </div>
                  {errors.acceptTerms && (
                     <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
                  )}

                  {/* Botão de Envio */}
                  <div className="pt-6">
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                        {isSubmitting ? 'Enviando...' : 'Finalizar Cadastro e Pagar'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default BusinessRegistration;
