import { useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';

const DEMO_CLIENTS = [
  {
    companyName: 'Tech Solutions Brasil',
    responsible: 'João Silva',
    whatsapp: '+55 11 98765-4321',
    instagram: '@techsolutions',
    contractValue: 5000,
    city: 'São Paulo',
    niche: 'SaaS',
    notes: 'Cliente potencial, muito interessado',
    status: 'leads' as const,
  },
  {
    companyName: 'E-commerce Plus',
    responsible: 'Maria Santos',
    whatsapp: '+55 21 99876-5432',
    instagram: '@ecommerceplus',
    contractValue: 3500,
    city: 'Rio de Janeiro',
    niche: 'E-commerce',
    notes: 'Já enviou documentos',
    status: 'prospectado' as const,
  },
  {
    companyName: 'Digital Agency Pro',
    responsible: 'Carlos Oliveira',
    whatsapp: '+55 31 97654-3210',
    contractValue: 7500,
    city: 'Belo Horizonte',
    niche: 'Agência Digital',
    notes: 'Aguardando análise',
    status: 'enviar-analise' as const,
  },
  {
    companyName: 'Consultoria Estratégica',
    responsible: 'Ana Costa',
    whatsapp: '+55 41 96543-2109',
    instagram: '@consultoriaest',
    contractValue: 4200,
    city: 'Curitiba',
    niche: 'Consultoria',
    notes: 'Precisa de follow-up',
    status: 'follow-up' as const,
  },
  {
    companyName: 'Plataforma Educacional',
    responsible: 'Pedro Ferreira',
    whatsapp: '+55 51 95432-1098',
    contractValue: 6000,
    city: 'Porto Alegre',
    niche: 'Educação',
    notes: 'Reunião marcada para próxima semana',
    status: 'reuniao' as const,
  },
  {
    companyName: 'Clínica Saúde+',
    responsible: 'Juliana Rocha',
    whatsapp: '+55 61 94321-0987',
    contractValue: 2500,
    city: 'Brasília',
    niche: 'Saúde',
    notes: 'Não compareceu na reunião',
    status: 'no-show' as const,
  },
  {
    companyName: 'Varejo Moderno',
    responsible: 'Roberto Lima',
    whatsapp: '+55 71 93210-9876',
    instagram: '@varejomoderno',
    contractValue: 8000,
    city: 'Salvador',
    niche: 'Varejo',
    notes: 'Contrato em fase final',
    status: 'contrato-pix' as const,
  },
  {
    companyName: 'Serviços Gerais XYZ',
    responsible: 'Fernanda Gomes',
    whatsapp: '+55 85 92109-8765',
    contractValue: 5500,
    city: 'Fortaleza',
    niche: 'Serviços',
    notes: 'Em processo de onboarding',
    status: 'onboarding' as const,
  },
  {
    companyName: 'Manufatura Avançada',
    responsible: 'Lucas Martins',
    whatsapp: '+55 92 91098-7654',
    instagram: '@manufaturaav',
    contractValue: 9000,
    city: 'Manaus',
    niche: 'Manufatura',
    notes: 'Contrato fechado com sucesso',
    status: 'fechado' as const,
  },
  {
    companyName: 'Tech Startup',
    responsible: 'Patricia Alves',
    whatsapp: '+55 47 90987-6543',
    contractValue: 2000,
    city: 'Joinville',
    niche: 'SaaS',
    notes: 'Cliente perdido para concorrente',
    status: 'perdido' as const,
  },
];

export function useDemoData() {
  const { clients, addClient } = useCRM();

  useEffect(() => {
    // Apenas carregar dados demo se não houver clientes
    if (clients.length === 0) {
      DEMO_CLIENTS.forEach((client) => {
        addClient({
          ...client,
          followUps: Math.floor(Math.random() * 3),
        });
      });
    }
  }, []);
}
