import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils/helpers";
import CompanyInvoiceHeader from "./CompanyInvoiceHeader";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface InvoiceTemplateProps {
  invoiceNumber: string;
  date: string;
  time?: string;
  dueDate?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  items: InvoiceItem[];
  total: number;
  status?: string;
  vatRate?: number;
  discount?: number;
  notes?: string;
  isPrintMode?: boolean;
}

export default function InvoiceTemplate({
  invoiceNumber,
  date,
  time,
  dueDate,
  clientName,
  clientEmail,
  clientPhone,
  clientAddress,
  items,
  total,
  status,
  vatRate = 0.18, // 18% TVA par défaut
  discount = 0,
  notes,
  isPrintMode = false
}: InvoiceTemplateProps) {

  // Calculs financiers
  const subtotalHT = total / (1 + vatRate);
  const vatAmount = total - subtotalHT;
  const totalWithDiscount = total - discount;

  const statusMap: Record<string, { label: string; color: string }> = {
    'paid': { label: 'Payé', color: '#059669' },
    'pending': { label: 'En attente', color: '#D97706' },
    'canceled': { label: 'Annulé', color: '#DC2626' }
  };

  const currentStatus = statusMap[status || 'pending'];

  return (
    <div className={`
      font-sans max-w-4xl mx-auto bg-white
      ${isPrintMode ? 'p-6 print:p-0' : 'p-8'}
      ${isPrintMode ? 'print:shadow-none' : 'shadow-lg rounded-lg'}
    `}>
      {/* En-tête avec informations entreprise */}
      <CompanyInvoiceHeader 
        isPrintMode={isPrintMode} 
        className="mb-6"
        showBorder={true}
      />

      {/* Informations de la facture */}
      <div className="flex justify-between items-start mb-8">
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 flex-1 max-w-md">
          <h3 className={`
            ${isPrintMode ? 'text-base' : 'text-lg'}
            font-bold text-indigo-800 mb-3
          `}>
            Informations de la facture
          </h3>
          <div className={`
            ${isPrintMode ? 'text-xs' : 'text-sm'}
            space-y-1
          `}>
            <div className="flex justify-between">
              <span className="font-medium">N°:</span>
              <span className="font-mono font-semibold">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{date}</span>
            </div>
            {time && (
              <div className="flex justify-between">
                <span className="font-medium">Heure:</span>
                <span>{time}</span>
              </div>
            )}
            {dueDate && (
              <div className="flex justify-between">
                <span className="font-medium">Échéance:</span>
                <span>{dueDate}</span>
              </div>
            )}
            {status && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-indigo-200">
                <span className="font-medium">Statut:</span>
                <span 
                  className="px-2 py-1 rounded text-xs font-semibold text-white"
                  style={{ backgroundColor: currentStatus.color }}
                >
                  {currentStatus.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations client */}
      <div className="mb-8">
        <h3 className={`
          ${isPrintMode ? 'text-base' : 'text-lg'}
          font-semibold text-gray-800 mb-3
        `}>
          Facturé à:
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="font-semibold text-gray-800 text-base">{clientName}</p>
          {clientEmail && (
            <p className="text-sm text-gray-600 mt-1">{clientEmail}</p>
          )}
          {clientPhone && (
            <p className="text-sm text-gray-600">{clientPhone}</p>
          )}
          {clientAddress && (
            <p className="text-sm text-gray-600">{clientAddress}</p>
          )}
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="mb-8">
        <h3 className={`
          ${isPrintMode ? 'text-base' : 'text-lg'}
          font-semibold text-gray-800 mb-4
        `}>
          Articles
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">
                Désignation
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800 w-20">
                Qté
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800 w-28">
                Prix unit.
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800 w-32">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-gray-800">
                  {item.name || 'Article'}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                  {item.quantity || 1}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                  {formatCurrency(item.price || 0)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-800">
                  {formatCurrency(item.subtotal || 0)}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                  Aucun article
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total HT:</span>
                <span className="font-medium text-gray-800">{formatCurrency(subtotalHT)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA ({Math.round(vatRate * 100)}%):</span>
                <span className="font-medium text-gray-800">{formatCurrency(vatAmount)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remise:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 text-lg">Total TTC:</span>
                  <span className="font-bold text-indigo-600 text-lg">
                    {formatCurrency(discount > 0 ? totalWithDiscount : total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes et pied de page */}
      <div className="border-t border-gray-200 pt-6">
        {notes && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
            <p className="text-sm text-gray-600">{notes}</p>
          </div>
        )}
        
        <div className="text-center text-gray-500">
          <p className="text-sm">Merci pour votre confiance !</p>
          <p className="text-xs mt-1">gYS - Système de gestion d'entreprise</p>
        </div>
      </div>
    </div>
  );
}

