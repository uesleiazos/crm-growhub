import React from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { getDashboardMetrics } = useCRM();
  const metrics = getDashboardMetrics();

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const dashboardCards = [
    {
      label: 'Total de Leads',
      value: metrics.totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Fechados',
      value: metrics.totalClosed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'Perdidos',
      value: metrics.totalLost,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      label: 'Valor Fechado',
      value: formatValue(metrics.totalValue),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      isValue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {dashboardCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-4 border border-border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-primary">
                  {card.isValue ? card.value : card.value}
                </p>
              </div>
              <Icon className={`${card.color} opacity-20`} size={32} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
