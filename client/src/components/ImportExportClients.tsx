import React, { useRef } from 'react';
import { useCRM, Client } from '@/contexts/CRMContext';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export default function ImportExportClients() {
  const { clients, addClient } = useCRM();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToCSV = () => {
    const data = clients.map(client => ({
      'Nome da Empresa': client.companyName,
      'Responsável': client.responsible || '',
      'WhatsApp': client.whatsapp || '',
      'Instagram': client.instagram || '',
      'Valor do Contrato': client.contractValue,
      'Cidade': client.city || '',
      'Nicho': client.niche || '',
      'Observações': client.notes || '',
      'Status': client.status,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads exportados em CSV com sucesso!');
  };

  const exportToExcel = () => {
    const data = clients.map(client => ({
      'Nome da Empresa': client.companyName,
      'Responsável': client.responsible || '',
      'WhatsApp': client.whatsapp || '',
      'Instagram': client.instagram || '',
      'Valor do Contrato': client.contractValue,
      'Cidade': client.city || '',
      'Nicho': client.niche || '',
      'Observações': client.notes || '',
      'Status': client.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    
    // Ajustar largura das colunas
    const colWidths = [
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `leads_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Leads exportados em Excel com sucesso!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel' ||
                    file.name.endsWith('.xlsx') ||
                    file.name.endsWith('.xls');

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processImportedData(results.data);
        },
        error: (error) => {
          toast.error(`Erro ao processar CSV: ${error.message}`);
        },
      });
    } else if (isExcel) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          processImportedData(jsonData);
        } catch (error) {
          toast.error('Erro ao processar arquivo Excel');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('Por favor, selecione um arquivo CSV ou Excel');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImportedData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      toast.error('Arquivo vazio ou formato inválido');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    data.forEach((row, index) => {
      try {
        // Mapear colunas - suportar variações de nomes
        const companyName = row['Nome da Empresa'] || row['companyName'] || row['Empresa'] || '';
        const whatsapp = row['WhatsApp'] || row['whatsapp'] || row['Telefone'] || '';
        const contractValue = parseFloat(row['Valor do Contrato'] || row['contractValue'] || row['Valor'] || '0');

        if (!companyName || !whatsapp) {
          errorCount++;
          return;
        }

        const newClient: Omit<Client, 'id'> = {
          companyName: companyName.toString(),
          responsible: row['Responsável'] || row['responsible'] || row['Contato'] || undefined,
          instagram: row['Instagram'] || row['instagram'] || undefined,
          whatsapp: whatsapp.toString(),
          contractValue: contractValue || 0,
          city: row['Cidade'] || row['city'] || undefined,
          niche: row['Nicho'] || row['niche'] || undefined,
          notes: row['Observações'] || row['notes'] || undefined,
          status: 'leads',
          followUps: 0,
          createdAt: Date.now(),
        };

        addClient(newClient);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    });

    if (successCount > 0) {
      toast.success(`${successCount} lead(s) importado(s) com sucesso!`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} linha(s) com erro ou campos obrigatórios faltando`);
    }
  };

  return (
    <div className="flex gap-2">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleImport}
          className="hidden"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
          title="Importar leads de CSV ou Excel"
        >
          <Upload size={14} />
          Importar
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={exportToCSV}
          className="gap-2"
          title="Exportar leads em CSV"
        >
          <Download size={14} />
          CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={exportToExcel}
          className="gap-2"
          title="Exportar leads em Excel"
        >
          <Download size={14} />
          Excel
        </Button>
      </div>
    </div>
  );
}
