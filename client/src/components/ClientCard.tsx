import React, { useState } from 'react';
import { Client } from '@/contexts/CRMContext';
import { MessageCircle, Instagram, Trash2, Plus, Minus, Edit2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClientDetailsModal from './ClientDetailsModal';
import EditClientModal from './EditClientModal';

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
  onFollowUpIncrement: (id: string) => void;
  onFollowUpDecrement: (id: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function ClientCard({
  client,
  onDelete,
  onFollowUpIncrement,
  onFollowUpDecrement,
  onDragStart,
}: ClientCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Oi, me tira uma dúvida por favor?`;
    window.open(
      `https://wa.me/${client.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (client.instagram) {
      window.open(`https://instagram.com/${client.instagram.replace('@', '')}`, '_blank');
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart?.(e)}
        className="bg-card text-card-foreground border border-border rounded-md p-3 cursor-move hover:shadow-md transition-shadow duration-150"
      >
        {/* Nome da Empresa - Clicável para abrir modal */}
        <button
          onClick={() => setShowDetails(true)}
          className="w-full text-left font-semibold text-sm text-primary hover:text-primary/80 transition-colors mb-2 truncate"
        >
          {client.companyName}
        </button>

        {/* Responsável */}
        {client.responsible && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Responsável:</span> {client.responsible}
            </p>
          </div>
        )}

        {/* Nicho */}
        {client.niche && (
          <div className="mb-2">
            <p className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded inline-block">
              {client.niche}
            </p>
          </div>
        )}

        {/* Data de Criação */}
        {client.createdAt && (
          <div className="mb-2 flex items-center gap-1">
            <Calendar size={12} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{formatDate(client.createdAt)}</p>
          </div>
        )}

        {/* Informações de contato - Apenas se preenchidas */}
        <div className="flex items-center gap-2 mb-2">
          {client.whatsapp && (
            <button
              onClick={handleWhatsAppClick}
              className="p-1.5 hover:bg-accent/10 rounded transition-colors"
              title="Abrir WhatsApp"
            >
              <MessageCircle size={16} className="text-green-600" />
            </button>
          )}
          {client.instagram && (
            <button
              onClick={handleInstagramClick}
              className="p-1.5 hover:bg-accent/10 rounded transition-colors"
              title="Abrir Instagram"
            >
              <Instagram size={16} className="text-pink-600" />
            </button>
          )}
        </div>

        {/* Valor do contrato */}
        <div className="mb-2">
          <p className="text-xs text-muted-foreground">Valor</p>
          <p className="font-semibold text-sm text-primary">{formatValue(client.contractValue)}</p>
        </div>

        {/* Cidade */}
        {client.city && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground">{client.city}</p>
          </div>
        )}

        {/* Follow-ups */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Follow-ups: {client.followUps}</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onFollowUpDecrement(client.id);
              }}
              disabled={client.followUps === 0}
            >
              <Minus size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onFollowUpIncrement(client.id);
              }}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-7 text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowEdit(true);
            }}
          >
            <Edit2 size={14} className="mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-7 text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(client.id);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Modal de detalhes */}
      {showDetails && (
        <ClientDetailsModal
          client={client}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* Modal de edição */}
      {showEdit && (
        <EditClientModal
          client={client}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
