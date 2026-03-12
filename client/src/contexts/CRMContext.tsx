import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  companyName: string;
  responsible?: string;
  instagram?: string;
  whatsapp?: string;
  contractValue: number;
  city?: string;
  niche?: string;
  notes?: string;
  followUps: number;
  createdAt?: number;
  status: 'leads' | 'prospectado' | 'enviar-analise' | 'follow-up' | 'reuniao' | 'no-show' | 'contrato-pix' | 'onboarding' | 'fechado' | 'perdido';
}

export interface FunnelMetric {
  count: number;
  totalValue: number;
  conversionRate: number;
  lostValue: number;
}

export interface CRMContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  moveClient: (id: string, newStatus: Client['status']) => void;
  incrementFollowUp: (id: string, delta?: number) => void;
  getClientsByStatus: (status: Client['status']) => Client[];
  getTotalByStatus: (status: Client['status']) => { count: number; total: number };
  checkDuplicateWhatsApp: (whatsapp: string, excludeId?: string) => boolean;
  checkDuplicateInstagram: (instagram: string, excludeId?: string) => boolean;
  getDashboardMetrics: () => {
    totalLeads: number;
    totalClosed: number;
    totalLost: number;
    totalValue: number;
  };
  getFunnelMetrics: () => {
    [key: string]: FunnelMetric;
  };
  getFinancialFunnelMetrics: () => {
    potentialRevenue: number;
    closedRevenue: number;
    efficiency: number;
    lossMap: { [key: string]: number };
    atRiskRevenue: number;
  };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const STORAGE_KEY = 'growhub_crm_clients';

const STATUSES = [
  'leads',
  'prospectado',
  'enviar-analise',
  'follow-up',
  'reuniao',
  'no-show',
  'contrato-pix',
  'onboarding',
  'fechado',
  'perdido',
] as const;

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setClients(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const moveClient = (id: string, newStatus: Client['status']) => {
    updateClient(id, { status: newStatus });
  };

  const incrementFollowUp = (id: string, delta: number = 1) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      const newFollowUps = Math.max(0, client.followUps + delta);
      updateClient(id, { followUps: newFollowUps });
    }
  };

  const getClientsByStatus = (status: Client['status']) => {
    return clients.filter(c => c.status === status);
  };

  const getTotalByStatus = (status: Client['status']) => {
    const statusClients = getClientsByStatus(status);
    return {
      count: statusClients.length,
      total: statusClients.reduce((sum, c) => sum + c.contractValue, 0),
    };
  };

  const checkDuplicateWhatsApp = (whatsapp: string, excludeId?: string) => {
    if (!whatsapp) return false;
    return clients.some(c => c.whatsapp === whatsapp && c.id !== excludeId);
  };

  const checkDuplicateInstagram = (instagram: string, excludeId?: string) => {
    if (!instagram) return false;
    const normalizedInstagram = instagram.toLowerCase().replace('@', '');
    return clients.some(c => {
      const clientInstagram = c.instagram?.toLowerCase().replace('@', '');
      return clientInstagram === normalizedInstagram && c.id !== excludeId;
    });
  };

  const getDashboardMetrics = () => {
    const totalLeads = clients.length;
    const closedClients = clients.filter(c => c.status === 'fechado');
    const lostClients = clients.filter(c => c.status === 'perdido');
    
    return {
      totalLeads,
      totalClosed: closedClients.length,
      totalLost: lostClients.length,
      totalValue: closedClients.reduce((sum, c) => sum + c.contractValue, 0),
    };
  };

  const getFunnelMetrics = () => {
    const metrics: { [key: string]: FunnelMetric } = {};
    let previousCount = 0;
    let previousValue = 0;

    STATUSES.forEach((status, index) => {
      const statusClients = clients.filter(c => c.status === status);
      const count = statusClients.length;
      const totalValue = statusClients.reduce((sum, c) => sum + c.contractValue, 0);
      
      let conversionRate = 100;
      let lostValue = 0;

      if (index === 0) {
        conversionRate = 100;
      } else if (previousCount > 0) {
        conversionRate = Math.round((count / previousCount) * 100);
        lostValue = previousValue - totalValue;
      }

      metrics[status] = {
        count,
        totalValue,
        conversionRate,
        lostValue: lostValue < 0 ? 0 : lostValue,
      };

      previousCount = count;
      previousValue = totalValue;
    });

    return metrics;
  };

  const getFinancialFunnelMetrics = () => {
    const potentialRevenue = clients.reduce((sum, c) => sum + c.contractValue, 0);
    const closedRevenue = clients
      .filter(c => c.status === 'fechado')
      .reduce((sum, c) => sum + c.contractValue, 0);
    
    const efficiency = potentialRevenue > 0 ? Math.round((closedRevenue / potentialRevenue) * 100) : 0;

    // Calcular perda por etapa (transições principais)
    const transitions = [
      { from: 'leads', to: 'prospectado' },
      { from: 'prospectado', to: 'enviar-analise' },
      { from: 'enviar-analise', to: 'reuniao' },
      { from: 'reuniao', to: 'contrato-pix' },
      { from: 'contrato-pix', to: 'fechado' },
    ];

    const lossMap: { [key: string]: number } = {};

    transitions.forEach(({ from, to }) => {
      const fromClients = clients.filter(c => c.status === from);
      const toClients = clients.filter(c => c.status === to);
      
      const fromValue = fromClients.reduce((sum, c) => sum + c.contractValue, 0);
      const toValue = toClients.reduce((sum, c) => sum + c.contractValue, 0);
      
      const loss = fromValue - toValue;
      lossMap[`${from}_to_${to}`] = loss > 0 ? loss : 0;
    });

    // Calcular receita em risco (parada há mais de 7 dias)
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const atRiskRevenue = clients
      .filter(c => {
        const createdAt = c.createdAt || 0;
        return createdAt < sevenDaysAgo && c.status !== 'fechado' && c.status !== 'perdido';
      })
      .reduce((sum, c) => sum + c.contractValue, 0);

    return {
      potentialRevenue,
      closedRevenue,
      efficiency,
      lossMap,
      atRiskRevenue,
    };
  };

  return (
    <CRMContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        moveClient,
        incrementFollowUp,
        getClientsByStatus,
        getTotalByStatus,
        checkDuplicateWhatsApp,
        checkDuplicateInstagram,
        getDashboardMetrics,
        getFunnelMetrics,
        getFinancialFunnelMetrics,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM deve ser usado dentro de CRMProvider');
  }
  return context;
};
