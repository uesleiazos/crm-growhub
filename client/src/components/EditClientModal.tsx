import React, { useState } from 'react';
import { Client, useCRM } from '@/contexts/CRMContext';
import { X, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditClientModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

const STATUSES: { value: Client['status']; label: string }[] = [
  { value: 'leads', label: 'Leads' },
  { value: 'prospectado', label: 'Prospectado' },
  { value: 'enviar-analise', label: 'Enviar análise' },
  { value: 'follow-up', label: 'Follow up' },
  { value: 'reuniao', label: 'Reunião' },
  { value: 'no-show', label: 'No Show' },
  { value: 'contrato-pix', label: 'Contrato/Pix' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' },
];

export default function EditClientModal({ client, isOpen, onClose }: EditClientModalProps) {
  const { updateClient, deleteClient, checkDuplicateWhatsApp, checkDuplicateInstagram } = useCRM();
  const [formData, setFormData] = useState({
    companyName: client.companyName,
    responsible: client.responsible || '',
    instagram: client.instagram || '',
    whatsapp: client.whatsapp || '',
    contractValue: client.contractValue.toString(),
    city: client.city || '',
    niche: client.niche || '',
    notes: client.notes || '',
    status: client.status,
  });
  const [duplicateWarnings, setDuplicateWarnings] = useState<{ whatsapp?: boolean; instagram?: boolean }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleWhatsAppChange = (value: string) => {
    setFormData({ ...formData, whatsapp: value });
    if (value && value !== client.whatsapp) {
      const isDuplicate = checkDuplicateWhatsApp(value, client.id);
      setDuplicateWarnings(prev => ({ ...prev, whatsapp: isDuplicate }));
    } else {
      setDuplicateWarnings(prev => ({ ...prev, whatsapp: false }));
    }
  };

  const handleInstagramChange = (value: string) => {
    setFormData({ ...formData, instagram: value });
    if (value && value !== client.instagram) {
      const isDuplicate = checkDuplicateInstagram(value, client.id);
      setDuplicateWarnings(prev => ({ ...prev, instagram: isDuplicate }));
    } else {
      setDuplicateWarnings(prev => ({ ...prev, instagram: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    setErrors(newErrors);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateClient(client.id, {
      companyName: formData.companyName || 'Sem nome',
      responsible: formData.responsible || undefined,
      instagram: formData.instagram || undefined,
      whatsapp: formData.whatsapp || undefined,
      contractValue: formData.contractValue ? parseFloat(formData.contractValue) : 0,
      city: formData.city || undefined,
      niche: formData.niche || undefined,
      notes: formData.notes || undefined,
      status: formData.status as Client['status'],
    });

    onClose();
  };

  const handleDelete = () => {
    deleteClient(client.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded-lg p-6 max-w-md w-full mx-4 shadow-lg max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Editar Cliente</h2>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
              >
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nome da Empresa */}
            <div>
              <label className="text-xs text-muted-foreground">Nome da Empresa</label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Nome da empresa"
                className="mt-1"
              />
              {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
            </div>

            {/* Responsável */}
            <div>
              <label className="text-xs text-muted-foreground">Responsável</label>
              <Input
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Nome do responsável"
                className="mt-1"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs text-muted-foreground">WhatsApp</label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                placeholder="+55 11 99999-9999"
                className="mt-1"
              />
              {errors.whatsapp && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
              {duplicateWarnings.whatsapp && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
                  <AlertCircle size={14} />
                  Este WhatsApp já existe em outro cliente
                </div>
              )}
            </div>

            {/* Instagram */}
            <div>
              <label className="text-xs text-muted-foreground">Instagram</label>
              <Input
                value={formData.instagram}
                onChange={(e) => handleInstagramChange(e.target.value)}
                placeholder="@usuario"
                className="mt-1"
              />
              {duplicateWarnings.instagram && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
                  <AlertCircle size={14} />
                  Este Instagram já existe em outro cliente
                </div>
              )}
            </div>

            {/* Valor */}
            <div>
              <label className="text-xs text-muted-foreground">Valor do Contrato (R$)</label>
              <Input
                type="number"
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                placeholder="1000.00"
                step="0.01"
                className="mt-1"
              />
              {errors.contractValue && <p className="text-xs text-red-600 mt-1">{errors.contractValue}</p>}
            </div>

            {/* Cidade */}
            <div>
              <label className="text-xs text-muted-foreground">Cidade</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="São Paulo"
                className="mt-1"
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>

            {/* Nicho */}
            <div>
              <label className="text-xs text-muted-foreground">Nicho</label>
              <Input
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                placeholder="Ex: SaaS, E-commerce, Consultoria..."
                className="mt-1"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Client['status'] })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div>
              <label className="text-xs text-muted-foreground">Observações</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione notas sobre o cliente"
                className="mt-1 resize-none"
                rows={2}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                Salvar
              </Button>
            </div>

            {/* Botão de deletar */}
            <Button
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={14} className="mr-1" />
              Remover Cliente
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
