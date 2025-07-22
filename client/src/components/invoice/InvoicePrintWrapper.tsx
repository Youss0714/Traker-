import InvoiceTemplate from "./InvoiceTemplate";
import { formatCurrency } from "@/lib/utils/helpers";
import { CompanyInvoiceHeaderPrint } from "./CompanyInvoiceHeader";

interface Sale {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  total: number;
  date: string;
  status: string;
  items: any[] | string;
}

interface InvoicePrintWrapperProps {
  sale: Sale;
}

export function InvoicePrintWrapper({ sale }: InvoicePrintWrapperProps) {
  // Parse items correctly
  let items = [];
  try {
    if (typeof sale.items === 'string') {
      items = JSON.parse(sale.items);
    } else if (Array.isArray(sale.items)) {
      items = sale.items;
    }
  } catch (e) {
    console.error('Error parsing items:', e);
    items = [];
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="print:hidden mb-4 text-center">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Imprimer
        </button>
      </div>
      
      <InvoiceTemplate
        invoiceNumber={sale.invoiceNumber}
        date={new Date(sale.date).toLocaleDateString()}
        clientName={sale.clientName}
        clientEmail={sale.clientEmail}
        clientPhone={sale.clientPhone}
        clientAddress={sale.clientAddress}
        items={items.map((item: any) => ({
          name: item.name || 'Article',
          quantity: item.quantity || 1,
          price: item.price || 0,
          subtotal: item.subtotal || 0
        }))}
        total={sale.total}
        status={sale.status}
        isPrintMode={true}
      />
    </div>
  );
}

export function printInvoice(sale: Sale) {
  // Parse items correctly
  let items = [];
  try {
    if (typeof sale.items === 'string') {
      items = JSON.parse(sale.items);
    } else if (Array.isArray(sale.items)) {
      items = sale.items;
    }
  } catch (e) {
    console.error('Error parsing items for print:', e);
    items = [];
  }

  // Calculate VAT
  const VAT_RATE = 0.18; // 18% TVA
  const subtotalHT = sale.total / (1 + VAT_RATE);
  const vatAmount = sale.total - subtotalHT;

  const statusMap: Record<string, string> = {
    'paid': 'Payé',
    'pending': 'En attente',
    'canceled': 'Annulé'
  };

  // Fetch company data pour l'en-tête unifié
  fetch('/api/company')
    .then(response => response.json())
    .then(company => {
      const printContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
          <!-- En-tête unifié avec informations entreprise -->
          ${CompanyInvoiceHeaderPrint({ company })}
          
          <!-- Informations de la facture -->
          <div style="background: #f0f9ff; padding: 16px; margin-bottom: 30px; border-radius: 8px; border: 1px solid #bfdbfe;">
            <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">Informations de la facture</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; line-height: 1.5;">
              <div>
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 500;">N°:</span>
                  <span style="font-family: monospace; font-weight: 600; margin-left: 8px;">${sale.invoiceNumber}</span>
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 500;">Date:</span>
                  <span style="margin-left: 8px;">${new Date(sale.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 500;">Statut:</span>
                  <span style="background: #059669; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px;">${statusMap[sale.status] || 'En attente'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Client -->
          <div style="margin-bottom: 30px;">
            <h3 style="font-weight: 600; color: #374151; margin-bottom: 12px;">Facturé à:</h3>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
              <p style="margin: 0; font-weight: 600; color: #374151; font-size: 16px;">${sale.clientName}</p>
            </div>
          </div>

          <!-- Articles -->
          <div style="margin-bottom: 30px;">
            <h3 style="font-weight: 600; color: #374151; margin-bottom: 16px;">Articles</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; font-weight: 600; color: #374151;">Désignation</th>
                  <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db; font-weight: 600; color: #374151; width: 80px;">Qté</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db; font-weight: 600; color: #374151; width: 120px;">Prix unit.</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db; font-weight: 600; color: #374151; width: 120px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.length > 0 ? items.map((item: any) => `
                  <tr>
                    <td style="padding: 12px; border: 1px solid #d1d5db; color: #374151;">${item.name || 'Article'}</td>
                    <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db; color: #374151;">${item.quantity || 1}</td>
                    <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db; color: #374151;">${formatCurrency(item.price || 0)}</td>
                    <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db; font-weight: 500; color: #374151;">${formatCurrency(item.subtotal || 0)}</td>
                  </tr>
                `).join('') : '<tr><td colspan="4" style="padding: 20px; text-align: center; border: 1px solid #d1d5db; color: #6b7280;">Aucun article</td></tr>'}
              </tbody>
            </table>
          </div>

          <!-- Totaux -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
            <div style="width: 320px;">
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 14px;">
                  <span style="color: #6b7280;">Sous-total HT:</span>
                  <span style="font-weight: 500; color: #374151;">${formatCurrency(subtotalHT)}</span>
                </div>
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 14px;">
                  <span style="color: #6b7280;">TVA (18%):</span>
                  <span style="font-weight: 500; color: #374151;">${formatCurrency(vatAmount)}</span>
                </div>
                <div style="border-top: 1px solid #d1d5db; padding-top: 8px; margin-top: 8px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: bold; color: #374151; font-size: 18px;">Total TTC:</span>
                    <span style="font-weight: bold; color: #6366f1; font-size: 18px;">${formatCurrency(sale.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pied de page -->
          <div style="border-top: 1px solid #d1d5db; padding-top: 20px; text-align: center; color: #6b7280;">
            <p style="margin: 0 0 4px 0; font-size: 14px;">Merci pour votre confiance !</p>
            <p style="margin: 0; font-size: 12px;">gYS - Système de gestion d'entreprise</p>
          </div>
        </div>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Facture ${sale.invoiceNumber}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  @page { margin: 15mm; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    })
    .catch(error => {
      console.error('Error fetching company data:', error);
      // Fallback sans données entreprise
      const fallbackContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          ${CompanyInvoiceHeaderPrint({})}
          <div style="text-align: center; margin: 30px 0; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px;">
            <h2 style="color: #1e3a8a; margin-bottom: 16px;">Facture ${sale.invoiceNumber}</h2>
            <p style="margin: 8px 0;">Date: ${new Date(sale.date).toLocaleDateString()}</p>
            <p style="margin: 8px 0;">Client: ${sale.clientName}</p>
            <p style="margin: 8px 0; font-weight: bold; font-size: 18px; color: #6366f1;">Total: ${formatCurrency(sale.total)}</p>
          </div>
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Facture ${sale.invoiceNumber}</title>
              <style>
                @media print { body { margin: 0; } @page { margin: 15mm; } }
              </style>
            </head>
            <body>${fallbackContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    });
}