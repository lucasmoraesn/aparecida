import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Camera, Check, Shield, Award, Loader2 } from 'lucide-react';
import { BusinessService, BusinessPlan } from '../lib/businessService';
import { trackClickSignup, trackAccountCreated, trackPlanSelected } from '../lib/analytics';

type PlanTier = 'basico' | 'destaque' | 'premium';

function tierForPlanIndex(index: number): PlanTier {
  if (index === 1) return 'destaque';
  if (index === 2) return 'premium';
  return 'basico';
}

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
  contentAuthorization: boolean;
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
  content_authorization: boolean;
}

const BusinessRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    establishmentName: '',
    category: '',
    address: '',
    location: '',
    photos: [],
    whatsapp: '+55 ( ) ',
    phone: '',
    description: '',
    plan: '',
    acceptTerms: false,
    contentAuthorization: false,
    payerEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [formReveal, setFormReveal] = useState(false);
  const whatsappInputRef = useRef<HTMLInputElement>(null);

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
      case 'basico':
        return 5;
      case 'destaque':
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

  const getPhotoCapacityMessage = (planId: string): string => {
    const limit = getPhotoLimit(planId);
    if (limit === Infinity) {
      return 'Fotos ilimitadas neste plano.';
    }
    return `Você pode enviar até ${limit} fotos neste plano.`;
  };

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => a.price - b.price).slice(0, 3);
  }, [plans]);

  // Scroll para o topo quando o componente é montado
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackClickSignup();
  }, []);

  useEffect(() => {
    if (!formData.plan) {
      setFormReveal(false);
      return;
    }
    setFormReveal(false);
    const revealId = window.setTimeout(() => setFormReveal(true), 60);
    const scrollId = window.setTimeout(() => {
      document.getElementById('cadastro-estabelecimento-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 200);
    return () => {
      window.clearTimeout(revealId);
      window.clearTimeout(scrollId);
    };
  }, [formData.plan]);

  useEffect(() => {
    const urls = formData.photos.map((file) => URL.createObjectURL(file));
    setPhotoPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.photos]);

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
            name: 'Destaque',
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

  const handleWhatsAppChange = (value: string) => {
    const input = whatsappInputRef.current;
    if (!input) return;

    const cursorPosition = input.selectionStart || 0;

    if (!value.startsWith('+55 (')) {
      value = '+55 ( ) ';
    }

    const match = value.match(/\+55 \(([^)]*)\)(.*)/);

    if (match) {
      const insideParentheses = match[1];
      const afterParentheses = match[2];

      const onlyNumbers = insideParentheses.replace(/\D/g, '');
      const limitedNumbers = onlyNumbers.slice(0, 2);

      const phoneNumbers = afterParentheses.replace(/\D/g, '');
      let formattedPhone = '';

      if (phoneNumbers.length > 5) {
        formattedPhone = ` ${phoneNumbers.slice(0, 5)}-${phoneNumbers.slice(5, 9)}`;
      } else if (phoneNumbers.length > 0) {
        formattedPhone = ` ${phoneNumbers}`;
      }

      value = `+55 (${limitedNumbers})${formattedPhone}`;
    } else {
      value = '+55 ( ) ';
    }

    handleInputChange('whatsapp', value);

    setTimeout(() => {
      if (input) {
        const dddLength = value.match(/\(([^)]*)\)/)?.[1].length || 0;

        if (dddLength === 0) {
          input.setSelectionRange(5, 5);
        } else if (cursorPosition >= 5 && cursorPosition <= 7) {
          input.setSelectionRange(5 + dddLength, 5 + dddLength);
        }
      }
    }, 0);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    if (field === 'plan' && value) {
      const selected = plans.find((p) => p.id === value);
      if (selected) {
        trackPlanSelected({ plan_name: selected.name, plan_id: selected.id, price: selected.price });
      }
    }

    if (field === 'plan' && formData.photos.length > 0) {
      const newLimit = getPhotoLimit(value);
      if (formData.photos.length > newLimit) {
        setFormData((prev) => ({ ...prev, photos: [] }));
        setErrors((prev) => ({
          ...prev,
          photos: `O plano selecionado permite apenas ${newLimit} fotos. Por favor, selecione novamente.`,
        }));
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length < 3) {
      setErrors((prev) => ({ ...prev, photos: 'Mínimo de 3 fotos obrigatório' }));
      return;
    }

    if (formData.plan) {
      const limit = getPhotoLimit(formData.plan);
      if (limit !== Infinity && files.length > limit) {
        setErrors((prev) => ({
          ...prev,
          photos: `Máximo de ${limit} fotos permitido para o plano selecionado`,
        }));
        return;
      }
    } else if (files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        photos: 'Selecione um plano primeiro para saber o limite de fotos',
      }));
      return;
    }

    const validFiles = files.filter((file) => file.type === 'image/jpeg' || file.type === 'image/png');

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({ ...prev, photos: 'Apenas arquivos JPG/PNG são aceitos' }));
      return;
    }

    setFormData((prev) => ({ ...prev, photos: validFiles }));
    setErrors((prev) => ({ ...prev, photos: '' }));
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
    if (!formData.contentAuthorization) {
      newErrors.contentAuthorization =
        'Você precisa aceitar os termos de autorização de uso de conteúdo para continuar.';
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

      const selectedPlanSubmit = plans.find((p) => p.id === formData.plan);
      if (!selectedPlanSubmit) throw new Error('Plano não encontrado');

      const registrationData: RegistrationData = {
        establishment_name: formData.establishmentName,
        category: formData.category,
        address: formData.address,
        location: formData.location,
        photos: photoUrls,
        whatsapp: formData.whatsapp,
        phone: formData.phone || undefined,
        description: formData.description,
        plan_id: selectedPlanSubmit.id,
        admin_email: 'admin@aparecida.com',
        contact_email: 'contato@aparecida.com',
        payer_email: formData.payerEmail,
        content_authorization: formData.contentAuthorization,
      };

      console.log('📤 Dados sendo enviados:', registrationData);

      const businessId = await BusinessService.createRegistration(registrationData);
      console.log('✅ Cadastro criado com ID:', businessId);
      trackAccountCreated({ plan_name: selectedPlanSubmit.name, plan_id: selectedPlanSubmit.id });

      const { checkoutUrl, subscriptionId } = await BusinessService.createSubscription(
        selectedPlanSubmit.id,
        businessId,
        {
          email: formData.payerEmail,
          name: formData.establishmentName,
        }
      );

      console.log('✅ Assinatura criada:', { subscriptionId });
      console.log('🔗 Redirecionando para checkout de pagamento:', checkoutUrl);

      BusinessService.sendAdminEmail(registrationData).catch(console.error);

      window.location.href = checkoutUrl;
    } catch (error: unknown) {
      const err = error as { message?: string; stack?: string };
      console.error('❌ Erro ao enviar formulário:', error);
      console.error('❌ Mensagem do erro:', err?.message);
      console.error('❌ Stack do erro:', err?.stack);

      const errorMessage = err?.message || 'Erro desconhecido ao enviar formulário';
      alert(`Erro: ${errorMessage}\n\nVerifique o console (F12) para mais detalhes.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (hasError?: boolean) =>
    `w-full px-4 py-3 border rounded-xl bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400 ${
      hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
    }`;

  const selectedPlan = plans.find((p) => p.id === formData.plan);

  return (
    <div className="min-h-screen bg-gray-50 page-container pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Cadastre seu estabelecimento em Aparecida
          </h1>
          <p className="text-xl text-gray-600">
            Conecte-se com milhares de peregrinos e aumente sua visibilidade na região
          </p>
        </div>

        {loadingPlans ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 max-w-6xl mx-auto">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-600">Carregando planos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
            {sortedPlans.map((plan, index) => {
              const tier = tierForPlanIndex(index);
              const selected = formData.plan === plan.id;
              const priceFmt = plan.price.toFixed(2).replace('.', ',');
              const ringSelected =
                selected && tier === 'basico'
                  ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md md:scale-[1.01]'
                  : selected && tier === 'destaque'
                    ? 'ring-2 ring-blue-600 ring-offset-2 shadow-2xl md:scale-[1.02]'
                    : selected && tier === 'premium'
                      ? 'ring-2 ring-amber-400 ring-offset-2 shadow-2xl'
                      : '';

              const featureList = (
                <ul className="w-full space-y-4 mb-8 text-left">
                  {plan.features.map((feature, i) => (
                    <li
                      key={`${plan.id}-f-${i}`}
                      className={`flex items-start gap-3 ${
                        tier === 'premium'
                          ? i === 0
                            ? 'text-white font-medium pb-2 border-b border-slate-700/50'
                            : 'text-slate-300'
                          : tier === 'destaque'
                            ? i === 0
                              ? 'text-gray-900 font-medium pb-2 border-b border-gray-100'
                              : 'text-gray-600'
                            : 'text-gray-600'
                      }`}
                    >
                      <Check
                        className={`w-5 h-5 shrink-0 ${
                          tier === 'premium'
                            ? 'text-amber-400'
                            : tier === 'destaque'
                              ? 'text-blue-500'
                              : 'text-green-500'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              );

              if (tier === 'basico') {
                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:shadow-md transition-all duration-300 ${ringSelected}`}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-gray-900">R$ {priceFmt}</span>
                      <span className="text-gray-500">/mês</span>
                    </div>
                    {featureList}
                    <button
                      type="button"
                      onClick={() => handleInputChange('plan', plan.id)}
                      className="mt-auto w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
                    >
                      Escolher Plano
                    </button>
                  </div>
                );
              }

              if (tier === 'destaque') {
                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 flex flex-col items-center relative transform md:-translate-y-4 transition-all duration-300 ${ringSelected}`}
                  >
                    <div className="absolute top-0 transform -translate-y-1/2 bg-blue-500 text-white font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-md">
                      <Shield className="w-4 h-4" /> Mais Escolhido
                    </div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-gray-900">R$ {priceFmt}</span>
                      <span className="text-gray-500">/mês</span>
                    </div>
                    {featureList}
                    <button
                      type="button"
                      onClick={() => handleInputChange('plan', plan.id)}
                      className="mt-auto w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Escolher Plano
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={plan.id}
                  className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg border border-slate-700 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 relative ${ringSelected}`}
                >
                  <h3 className="text-xl font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5" /> {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6 text-white">
                    <span className="text-4xl font-extrabold">R$ {priceFmt}</span>
                    <span className="text-slate-400">/mês</span>
                  </div>
                  {featureList}
                  <button
                    type="button"
                    onClick={() => handleInputChange('plan', plan.id)}
                    className="mt-auto w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-md transition-colors"
                  >
                    Escolher Plano
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {errors.plan && (
          <p className="text-red-600 text-sm mt-6 text-center max-w-6xl mx-auto font-medium">{errors.plan}</p>
        )}

        {formData.plan && (
          <div
            id="cadastro-estabelecimento-form"
            className={`max-w-3xl mx-auto mt-16 transition-all duration-500 ease-out ${
              formReveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xl shadow-gray-900/[0.06] overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white border-b border-slate-700/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Plano selecionado
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedPlan?.name ?? '—'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-12">
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Informações do estabelecimento
                    </h2>
                    <p className="text-sm text-gray-500">Dados públicos do seu negócio no Explore Aparecida</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do estabelecimento *
                    </label>
                    <input
                      type="text"
                      value={formData.establishmentName}
                      onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                      className={fieldClass(!!errors.establishmentName)}
                      placeholder="Ex.: Pousada Santa Rita"
                    />
                    {errors.establishmentName && (
                      <p className="text-red-500 text-sm mt-1.5">{errors.establishmentName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={fieldClass(!!errors.category)}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1.5">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={fieldClass(!!errors.address)}
                      placeholder="Rua, número, bairro, cidade, estado, CEP"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1.5">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização no mapa *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`${fieldClass(!!errors.location)} pl-11`}
                        placeholder="Digite o endereço ou cole o link do Google Maps"
                      />
                    </div>
                    {errors.location && <p className="text-red-500 text-sm mt-1.5">{errors.location}</p>}
                  </div>
                </section>

                <section className="space-y-6 pt-2 border-t border-gray-100">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Contato</h2>
                    <p className="text-sm text-gray-500">Como os romeiros entram em contato com você</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
                    <input
                      ref={whatsappInputRef}
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleWhatsAppChange(e.target.value)}
                      className={fieldClass(!!errors.whatsapp)}
                      placeholder="+55 (12) 91234-5678"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-sm mt-1.5">{errors.whatsapp}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone fixo (opcional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={fieldClass(false)}
                      placeholder="(12) 3456-7890"
                    />
                  </div>
                </section>

                <section className="space-y-6 pt-2 border-t border-gray-100">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Mídia</h2>
                    <p className="text-sm text-gray-500">Fotos do seu estabelecimento (JPG ou PNG)</p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-900">
                    <span className="font-semibold">Limite de fotos: </span>
                    {getPhotoCapacityMessage(formData.plan)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload de fotos * <span className="text-gray-500 font-normal">({getPhotoLimitText(formData.plan)})</span>
                    </label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoChange}
                        className={`${fieldClass(!!errors.photos)} pl-11 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700`}
                      />
                    </div>
                    {formData.photos.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {formData.photos.length} foto(s) selecionada(s)
                        {getPhotoLimit(formData.plan) !== Infinity && (
                          <span className="text-blue-600 font-medium"> de {getPhotoLimit(formData.plan)}</span>
                        )}
                      </p>
                    )}
                    {errors.photos && <p className="text-red-500 text-sm mt-1.5">{errors.photos}</p>}
                  </div>

                  {photoPreviewUrls.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Pré-visualização</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {photoPreviewUrls.map((url, idx) => (
                          <div
                            key={url}
                            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm"
                          >
                            <img src={url} alt={`Prévia ${idx + 1}`} className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-6 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do negócio *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      className={`${fieldClass(!!errors.description)} min-h-[140px] resize-y`}
                      placeholder="Descreva seu negócio, diferenciais, horários e o que os romeiros precisam saber."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1.5">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail para pagamento *</label>
                    <input
                      type="email"
                      value={formData.payerEmail}
                      onChange={(e) => handleInputChange('payerEmail', e.target.value)}
                      className={fieldClass(!!errors.payerEmail)}
                      placeholder="contato@seuestabelecimento.com.br"
                    />
                    {errors.payerEmail && (
                      <p className="text-red-500 text-sm mt-1.5">{errors.payerEmail}</p>
                    )}
                  </div>
                </section>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed">
                      Aceito os{' '}
                      <a href="/termos" className="text-blue-600 hover:underline font-medium">
                        termos de uso
                      </a>{' '}
                      e{' '}
                      <a href="/privacidade" className="text-blue-600 hover:underline font-medium">
                        política de privacidade
                      </a>{' '}
                      *
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-sm pl-7">{errors.acceptTerms}</p>
                  )}
                </div>

                <div
                  className={`rounded-xl border p-5 ${
                    errors.contentAuthorization ? 'border-red-300 bg-red-50/80' : 'border-gray-200 bg-gray-50/90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="contentAuthorization"
                      checked={formData.contentAuthorization}
                      onChange={(e) => handleInputChange('contentAuthorization', e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="contentAuthorization"
                      className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                    >
                      Ao enviar fotos e informações do estabelecimento, você declara que possui os direitos sobre esse
                      conteúdo ou autorização para utilizá-lo e concorda que ele seja exibido no portal Explore Aparecida
                      para fins de divulgação do seu negócio. *
                    </label>
                  </div>
                  {errors.contentAuthorization && (
                    <p className="text-red-600 text-sm mt-3 font-medium">{errors.contentAuthorization}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 py-4 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enviando...' : 'Finalizar cadastro e pagar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default BusinessRegistration;
