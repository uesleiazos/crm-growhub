import React from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

const TRANSITION_LABELS = {
  leads_to_prospectado: 'Leads → Prospectado',
  prospectado_to_enviar_analise: 'Prospectado → Enviar análise',
  enviar_analise_to_reuniao: 'Enviar análise → Reunião',
  reuniao_to_contrato_pix: 'Reunião → Contrato/Pix',
  contrato_pix_to_fechado: 'Contrato/Pix → Fechado',
};

export default function FinancialFunnelMap() {
  const { getFinancialFunnelMetrics } = useCRM();
  const metrics = getFinancialFunnelMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Encontrar a maior perda para destacar
  const maxLoss = Math.max(...Object.values(metrics.lossMap));
  const totalLoss = Object.values(metrics.lossMap).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-primary">Mapa Financeiro do Funil</h2>
      </div>

      {/* Grid de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Receita Potencial */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Receita Potencial</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(metrics.potentialRevenue)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Total de leads no funil</p>
        </div>

        {/* Receita Fechada */}
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Receita Fechada</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(metrics.closedRevenue)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Contratos concluídos</p>
        </div>

        {/* Receita Perdida */}
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Receita Perdida</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalLoss)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Não avançou no funil</p>
        </div>

        {/* Eficiência do Funil */}
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Eficiência do Funil</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {metrics.efficiency}%
          </p>
          <p className="text-xs text-muted-foreground mt-2">Taxa de conversão geral</p>
        </div>
      </div>

      {/* Receita em Risco */}
      {metrics.atRiskRevenue > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400" />
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">Receita em Risco</p>
          </div>
          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {formatCurrency(metrics.atRiskRevenue)}
          </p>
          <p className="text-xs text-muted-foreground">
            Leads parados há mais de 7 dias que não avançaram
          </p>
        </div>
      )}

      {/* Perda de Receita por Etapa */}
      <div className="mt-6">
        <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={16} />
          Perda de Receita por Transição
        </h3>

        <div className="space-y-3">
          {Object.entries(metrics.lossMap).map(([key, loss]) => {
            const label = TRANSITION_LABELS[key as keyof typeof TRANSITION_LABELS];
            const percentage = maxLoss > 0 ? Math.round((loss / maxLoss) * 100) : 0;
            const isHighestLoss = loss === maxLoss && loss > 0;

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">{label}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-destructive">
                      {formatCurrency(loss)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage}% da maior perda
                    </p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHighestLoss
                        ? 'bg-destructive'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <strong>💡 Dica:</strong> A maior perda ocorre em{' '}
          {(() => {
            const entries = Object.entries(metrics.lossMap);
            if (entries.length === 0) return 'N/A';
            const maxEntry = entries.reduce((max, current) =>
              current[1] > max[1] ? current : max
            );
            return maxEntry[0]
              .split('_to_')
              .join(' → ')
              .replace(/_/g, ' ')
              .toLowerCase();
          })()}
          . Foque em melhorar essa etapa do funil.
        </p>
      </div>
    </div>
  );
}
