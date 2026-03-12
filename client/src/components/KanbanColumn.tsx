import React from 'react';
import { Client } from '@/contexts/CRMContext';
import ClientCard from './ClientCard';

interface KanbanColumnProps {
  title: string;
  status: Client['status'];
  clients: Client[];
  onDelete: (id: string) => void;
  onFollowUpIncrement: (id: string) => void;
  onFollowUpDecrement: (id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Client['status']) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, client: Client) => void;
  count: number;
  total: number;
}

export default function KanbanColumn({
  title,
  status,
  clients,
  onDelete,
  onFollowUpIncrement,
  onFollowUpDecrement,
  onDragOver,
  onDrop,
  onDragStart,
  count,
  total,
}: KanbanColumnProps) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className="bg-muted/30 rounded-lg p-2 sm:p-3 md:p-4 min-h-96 flex flex-col flex-1 min-w-48 sm:min-w-56 md:min-w-64 lg:min-w-72 xl:min-w-80"
      style={{
        flex: '1 1 auto',
        minWidth: 'clamp(12rem, 20vw, 24rem)',
      }}
    >
      {/* Header da coluna */}
      <div className="mb-4 pb-3 border-b border-border">
        <h3 className="font-semibold text-primary text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {count} | {formatValue(total)}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {clients.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-xs">
            Nenhum cliente
          </div>
        ) : (
          clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={onDelete}
              onFollowUpIncrement={onFollowUpIncrement}
              onFollowUpDecrement={onFollowUpDecrement}
              onDragStart={(e) => onDragStart(e, client)}
            />
          ))
        )}
      </div>
    </div>
  );
}
