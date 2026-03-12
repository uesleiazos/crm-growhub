import React from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { TrendingDown } from 'lucide-react';

const FUNNEL_LABELS = {
  leads: 'Leads',
  prospectado: 'Prospectado',
  'enviar-analise': 'Enviar análise',
  'follow-up': 'Follow up',
  reuniao: 'Reunião',
  'no-show': 'No Show',
  'contrato-pix': 'Contrato/Pix',
  onboarding: 'Onboarding',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

export default function FunnelMetrics() {
  const { getFunnelMetrics } = useCRM();
  const metrics = getFunnelMetrics();

  const statuses = [
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

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown size={18} className="text-primary" />
        <h3 className="font-semibold text-primary">Análise do Funil</h3>
      </div>

      <div className="space-y-2">
        {statuses.map((status) => {
          const metric = metrics[status];
          const barWidth = metric.conversionRate;

          return (
            <div key={status}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {FUNNEL_LABELS[status]}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {metric.count} | {metric.conversionRate}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <p>
          A porcentagem mostra a taxa de conversão de cada etapa em relação à etapa anterior.
        </p>
      </div>
    </div>
  );
}
