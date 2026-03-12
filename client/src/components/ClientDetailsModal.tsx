import React from 'react';
import { Client } from '@/contexts/CRMContext';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
}

export default function ClientDetailsModal({ client, onClose }: ClientDetailsModalProps) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded-lg p-6 max-w-md w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">{client.companyName}</h2>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-3">
          {client.responsible && (
            <div>
              <p className="text-xs text-muted-foreground">Responsável</p>
              <p className="text-sm font-medium">{client.responsible}</p>
            </div>
          )}

          {client.niche && (
            <div>
              <p className="text-xs text-muted-foreground">Nicho</p>
              <p className="text-sm font-medium">{client.niche}</p>
            </div>
          )}

          {client.createdAt && (
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                Data de Adição
              </p>
              <p className="text-sm font-medium">{formatDate(client.createdAt)}</p>
            </div>
          )}

          {client.whatsapp && (
            <div>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
              <p className="text-sm font-medium">{client.whatsapp}</p>
            </div>
          )}

          {client.instagram && (
            <div>
              <p className="text-xs text-muted-foreground">Instagram</p>
              <p className="text-sm font-medium">{client.instagram}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Valor do Contrato</p>
            <p className="text-sm font-medium text-primary">{formatValue(client.contractValue)}</p>
          </div>

          {client.city && (
            <div>
              <p className="text-xs text-muted-foreground">Cidade</p>
              <p className="text-sm font-medium">{client.city}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Follow-ups</p>
            <p className="text-sm font-medium">{client.followUps}</p>
          </div>

          {client.notes && (
            <div>
              <p className="text-xs text-muted-foreground">Observações</p>
              <p className="text-sm font-medium">{client.notes}</p>
            </div>
          )}
        </div>

        <Button
          className="w-full mt-4"
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}
