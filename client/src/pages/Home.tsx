import React, { useState } from 'react';
import { useCRM, Client } from '@/contexts/CRMContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Plus, Moon, Sun, Search, X } from 'lucide-react';
import KanbanColumn from '@/components/KanbanColumn';
import AddClientModal from '@/components/AddClientModal';
import ClearStorageButton from '@/components/ClearStorageButton';
import Dashboard from '@/components/Dashboard';
import FunnelMetrics from '@/components/FunnelMetrics';
import FinancialFunnelMap from '@/components/FinancialFunnelMap';
import ImportExportClients from '@/components/ImportExportClients';
import { useDemoData } from '@/hooks/useDemoData';

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

export default function Home() {
  useDemoData();
  const { clients, deleteClient, moveClient, incrementFollowUp, getTotalByStatus } = useCRM();
  const { theme, toggleTheme } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draggedClient, setDraggedClient] = useState<Client | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar clientes baseado no termo de busca
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.companyName?.toLowerCase().includes(searchLower) ||
      client.responsible?.toLowerCase().includes(searchLower) ||
      client.whatsapp?.includes(searchTerm) ||
      client.instagram?.toLowerCase().includes(searchLower) ||
      client.city?.toLowerCase().includes(searchLower) ||
      client.niche?.toLowerCase().includes(searchLower) ||
      client.notes?.toLowerCase().includes(searchLower)
    );
  });

  const getFilteredTotalByStatus = (status: Client['status']) => {
    const statusClients = filteredClients.filter(c => c.status === status);
    const count = statusClients.length;
    const total = statusClients.reduce((sum, c) => sum + (c.contractValue || 0), 0);
    return { count, total };
  };

  const handleFollowUpDecrement = (id: string) => {
    incrementFollowUp(id, -1);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, client: Client) => {
    setDraggedClient(client);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Client['status']) => {
    e.preventDefault();
    if (draggedClient) {
      moveClient(draggedClient.id, status);
      setDraggedClient(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/favicon.png" alt="GrowHub Logo" className="h-8 sm:h-10 w-8 sm:w-10" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-primary">GrowHub</h1>
              <p className="text-xs text-muted-foreground">CRM</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
            <ImportExportClients />
            <ClearStorageButton />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMetrics(!showMetrics)}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="hidden sm:inline">{showMetrics ? 'Ocultar' : 'Mostrar'}</span>
              <span className="sm:hidden">{showMetrics ? 'X' : 'M'}</span>
              <span className="hidden sm:inline">Métricas</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Novo Cliente</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Barra de Busca */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
          <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar lead por nome, empresa, WhatsApp, Instagram, cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder-muted-foreground"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-muted-foreground mt-2">
              {filteredClients.length} lead(s) encontrado(s)
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Métricas */}
        {showMetrics && (
          <>
            <Dashboard />
            <FunnelMetrics />
            <FinancialFunnelMap />
          </>
        )}

        {/* Kanban Board */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 md:-mx-0 px-4 sm:px-6 md:px-0" style={{ scrollBehavior: 'smooth' }}>
          {STATUSES.map((status, index) => {
            const statusClients = filteredClients.filter(c => c.status === status.value);
            const { count, total } = getFilteredTotalByStatus(status.value);

            return (
              <KanbanColumn
                key={`${status.value}-${index}`}
                title={status.label}
                status={status.value}
                clients={statusClients}
                count={count}
                total={total}
                onDelete={deleteClient}
                onFollowUpIncrement={incrementFollowUp}
                onFollowUpDecrement={handleFollowUpDecrement}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            );
          })}
        </div>
      </main>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
