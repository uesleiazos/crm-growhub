import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function ClearStorageButton() {
  const handleClearStorage = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados e recarregar os dados de demonstração?')) {
      localStorage.removeItem('growhub_crm_clients');
      window.location.reload();
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClearStorage}
      className="gap-2"
      title="Limpar dados e recarregar demonstração"
    >
      <RotateCcw size={14} />
      Recarregar Demo
    </Button>
  );
}
