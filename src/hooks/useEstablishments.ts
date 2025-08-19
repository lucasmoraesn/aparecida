import { useState, useEffect } from 'react';
import { supabase, Establishment, EstablishmentType } from '../lib/supabase';

// Dados mock para desenvolvimento
const mockData: Record<EstablishmentType, Establishment[]> = {
  hotels: [
    {
      id: 1,
      name: "Hotel Santuário",
      category: "Hospedagem",
      rating: 4.8,
      address: "Rua das Flores, 123 - Centro",
      phone: "(12) 3104-1000",
      whatsapp: "(12) 99999-9999",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Hotel confortável próximo ao Santuário Nacional",
      featured: true,
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    },
    {
      id: 2,
      name: "Pousada da Fé",
      category: "Hospedagem",
      rating: 4.5,
      address: "Av. Aparecida, 456 - Centro",
      phone: "(12) 3104-2000",
      whatsapp: "(12) 99999-8888",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Pousada familiar com vista para a Basílica",
      featured: false,
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ],
  restaurants: [
    {
      id: 3,
      name: "Restaurante Mineiro",
      category: "Restaurante",
      rating: 4.7,
      address: "Rua do Comércio, 789 - Centro",
      phone: "(12) 3104-3000",
      whatsapp: "(12) 99999-7777",
      image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Culinária mineira tradicional",
      featured: true,
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ],
  shops: [
    {
      id: 4,
      name: "Loja de Artigos Religiosos",
      category: "Loja",
      rating: 4.6,
      address: "Rua da Basílica, 321 - Centro",
      phone: "(12) 3104-4000",
      whatsapp: "(12) 99999-6666",
      image: "https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Artigos religiosos e souvenirs",
      featured: false,
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ],
  attractions: [
    {
      id: 5,
      name: "Basílica Nacional",
      category: "Atração",
      rating: 5.0,
      address: "Praça Nossa Senhora Aparecida, s/n - Centro",
      phone: "(12) 3104-5000",
      whatsapp: "(12) 99999-5555",
      image: "https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Principal atração religiosa da cidade",
      featured: true,
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ]
};

export const useEstablishments = (type: EstablishmentType) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setLoading(true);

        // Verifica se o Supabase está configurado corretamente
        if (supabase.supabaseUrl === 'https://placeholder.supabase.co') {
          // Usa dados mock
          setEstablishments(mockData[type] || []);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from(type)
          .select('*')
          .order('featured', { ascending: false })
          .order('rating', { ascending: false });

        if (error) throw error;
        setEstablishments(data || []);
      } catch (err) {
        console.error('Erro ao buscar estabelecimentos:', err);
        // Em caso de erro, usa dados mock
        setEstablishments(mockData[type] || []);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, [type]);

  return { establishments, loading, error };
};

export const useEstablishment = (type: EstablishmentType, id: number) => {
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        setLoading(true);

        // Verifica se o Supabase está configurado corretamente
        if (supabase.supabaseUrl === 'https://placeholder.supabase.co') {
          // Usa dados mock
          const mockEstablishment = mockData[type]?.find(item => item.id === id);
          setEstablishment(mockEstablishment || null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from(type)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEstablishment(data);
      } catch (err) {
        console.error('Erro ao buscar estabelecimento:', err);
        // Em caso de erro, usa dados mock
        const mockEstablishment = mockData[type]?.find(item => item.id === id);
        setEstablishment(mockEstablishment || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEstablishment();
    }
  }, [type, id]);

  return { establishment, loading, error };
};