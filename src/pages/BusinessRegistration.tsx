import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, CheckCircle } from 'lucide-react';
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
  payerEmail: string;
}

interface RegistrationData {
  establishment_name: string;
  category: string;
  address: string;
  location: string;
  photos: string[];
  whatsapp: string;
  phone?: string;
  description: string;
  plan_id: string;
  admin_email: string;
  contact_email: string;
  payer_email: string;
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
    payerEmail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const categories = [
    'Hotel',
    'Loja',
    'Restaurante',
    'Lanchonete',
    'Artigos Religiosos',
    'Outro',
  ];

  // Função para obter o limite de fotos baseado no plano
  const getPhotoLimit = (planId: string): number => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 5; // Default para plano básico

    switch (plan.name.toLowerCase()) {
      case 'básico':
        return 5;
      case 'intermediário':
        return 10;
      case 'premium':
        return Infinity; // Ilimitado
      default:
        return 5;
    }
  };

  // Função para obter o texto do limite de fotos
  const getPhotoLimitText = (planId: string): string => {
    const limit = getPhotoLimit(planId);
    if (limit === Infinity) {
      return 'Fotos ilimitadas';
    }
    return `Máximo ${limit} fotos`;
  };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await BusinessService.getPlans();
        setPlans(plansData);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        setPlans([
          {
            id: '1',
            name: 'Básico',
            price: 49.9,
            features: [
              'Perfil básico do estabelecimento',
              'Até 5 fotos',
              'Informações de contato',
              'Suporte por e-mail',
            ],
            is_active: true,
          },
          {
            id: '2',
            name: 'Intermediário',
            price: 99.9,
            features: [
              'Perfil completo do estabelecimento',
              'Até 10 fotos',
              'Destaque na busca',
              'Suporte prioritário',
              'Relatórios básicos',
            ],
            is_active: true,
          },
          {
            id: '3',
            name: 'Premium',
            price: 199.9,
            features: [
              'Perfil premium com destaque',
              'Fotos ilimitadas',
              'Destaque máximo na busca',
              'Suporte 24/7',
              'Relatórios avançados',
              'Promoções exclusivas',
            ],
            is_active: true,
          },
        ]);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Se mudou o plano, validar fotos existentes
    if (field === 'plan' && formData.photos.length > 0) {
      const newLimit = getPhotoLimit(value);
      if (formData.photos.length > newLimit) {
        setFormData(prev => ({ ...prev, photos: [] }));
        setErrors(prev => ({ ...prev, photos: `O plano selecionado permite apenas ${newLimit} fotos. Por favor, selecione novamente.` }));
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length < 3) {
      setErrors((prev) => ({ ...prev, photos: 'Mínimo de 3 fotos obrigatório' }));
      return;
    }

    // Verificar limite baseado no plano selecionado
    if (formData.plan) {
      const limit = getPhotoLimit(formData.plan);
      if (limit !== Infinity && files.length > limit) {
        setErrors((prev) => ({ ...prev, photos: `Máximo de ${limit} fotos permitido para o plano selecionado` }));
        return;
      }
    } else {
      // Se não há plano selecionado, limitar a 5 fotos (plano básico)
      if (files.length > 5) {
        setErrors((prev) => ({ ...prev, photos: 'Selecione um plano primeiro para saber o limite de fotos' }));
        return;
      }
    }

    const validFiles = files.filter(
      (file) => file.type === 'image/jpeg' || file.type === 'image/png'
    );

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({ ...prev, photos: 'Apenas arquivos JPG/PNG são aceitos' }));
      return;
    }

    setFormData((prev) => ({ ...prev, photos: validFiles }));
    setErrors((prev) => ({ ...prev, photos: '' }));
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `+55 ${numbers}`;
    if (numbers.length <= 6) return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 10)
      return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`;
    return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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
    if (!formData.payerEmail.trim()) {
      newErrors.payerEmail = 'E-mail para pagamento é obrigatório';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Aceite os termos é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const photoUrls = formData.photos.map(
        (_, index) => `https://example.com/photos/photo-${Date.now()}-${index}.jpg`
      );

      const selectedPlan = plans.find((p) => p.id === formData.plan);
      if (!selectedPlan) throw new Error('Plano não encontrado');

      const registrationData: RegistrationData = {
        establishment_name: formData.establishmentName,
        category: formData.category,
        address: formData.address,
        location: formData.location,
        photos: photoUrls,
        whatsapp: formData.whatsapp,
        phone: formData.phone || undefined,
        description: formData.description,
        plan_id: selectedPlan.id,
        admin_email: 'admin@aparecida.com',
        contact_email: 'contato@aparecida.com',
        payer_email: formData.payerEmail,
      };

      const registrationId = await BusinessService.createRegistration(registrationData);
      await BusinessService.sendAdminEmail(registrationData);

      navigate('/payment', {
        state: { registrationId, formData, plan: selectedPlan },
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
        <div className="bg-white rounded-lg shadow-lg p-8 mt-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastre seu Negócio</h1>
            <p className="text-gray-600">Conecte-se com milhares de peregrinos em Aparecida</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Planos - MOVIDO PARA O TOPO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Escolha seu Plano * (Escolha primeiro para saber o limite de fotos)
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
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.plan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => handleInputChange('plan', plan.id)}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          R$ {plan.price.toFixed(2).replace('.', ',')}/mês
                        </p>
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
              {errors.plan && <p className="text-red-500 text-sm mt-1">{errors.plan}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Rua, número, bairro, cidade, estado, CEP"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Localização */}
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
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Fotos - AGORA COM LIMITE DINÂMICO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos do Estabelecimento *
                {formData.plan ? (
                  <span className="text-blue-600 font-normal"> ({getPhotoLimitText(formData.plan)})</span>
                ) : (
                  <span className="text-gray-500 font-normal"> (Selecione um plano primeiro)</span>
                )}
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  disabled={!formData.plan}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.photos ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.plan ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {formData.photos.length} foto(s) selecionada(s)
                    {formData.plan && getPhotoLimit(formData.plan) !== Infinity && (
                      <span className="text-blue-600"> de {getPhotoLimit(formData.plan)}</span>
                    )}
                  </p>
                </div>
              )}
              {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
              {!formData.plan && (
                <p className="text-sm text-gray-500 mt-1">
                  ⚠️ Selecione um plano para poder fazer upload de fotos
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', formatWhatsApp(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="+55 (11) 99999-9999"
              />
              {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
            </div>

            {/* Telefone fixo */}
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

            {/* E-mail para Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail para Pagamento *
              </label>
              <input
                type="email"
                value={formData.payerEmail}
                onChange={(e) => handleInputChange('payerEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.payerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="exemplo@teste.com"
              />
              {errors.payerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.payerEmail}</p>
              )}
            </div>


            {/* Aceite dos termos */}
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

            {/* Botão de envio */}
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
