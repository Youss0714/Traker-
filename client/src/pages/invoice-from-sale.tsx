import { useState, useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { InvoiceHeader, PrintableInvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { Download, Eye, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface InvoiceFromSaleProps {
  saleId: string;
}

export default function InvoiceFromSale({ saleId }: InvoiceFromSaleProps) {
  const { setActivePage } = useAppContext();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  const { data: sale, isLoading } = useQuery<any>({
    queryKey: ['/api/sales', saleId],
  });

  const { data: company } = useQuery<any>({
    queryKey: ['/api/company'],
  });

  useEffect(() => {
    setActivePage('sales');
  }, [setActivePage]);

  const formatSaleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatSaleTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const generatePDF = () => {
    setShowPreview(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Génération de facture...</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Facture introuvable</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Vente non trouvée</p>
          <Link href="/sales">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux ventes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const saleItems = Array.isArray(sale.items) ? sale.items : JSON.parse(sale.items || '[]');

  if (showPreview) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none">
          <div className="no-print mb-4 flex gap-2">
            <Button onClick={() => setShowPreview(false)} variant="outline">
              Retour à l'édition
            </Button>
            <Button onClick={generatePDF}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>

          <div className="bg-white print:shadow-none shadow-lg">
            <PrintableInvoiceHeader 
              invoiceNumber={sale.invoiceNumber}
              date={formatSaleDate(sale.date)}
              time={formatSaleTime(sale.date)}
            />

            {/* Informations client */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Facturé à:</h3>
              <div className="bg-gray-50 print:bg-transparent p-4 rounded border print:border-gray-300">
                <p className="font-medium">{sale.clientName}</p>
              </div>
            </div>

            {/* Tableau des articles */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="border border-gray-300 p-3 text-left">Description</th>
                    <th className="border border-gray-300 p-3 text-center">Qté</th>
                    <th className="border border-gray-300 p-3 text-right">Prix unitaire</th>
                    <th className="border border-gray-300 p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-3">{item.productName}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-3 text-right">{item.price.toFixed(2)} €</td>
                      <td className="border border-gray-300 p-3 text-right">{(item.quantity * item.price).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{sale.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sale.notes && (
              <div className="mb-8">
                <h3 className="font-bold mb-2">Notes:</h3>
                <p className="text-gray-600">{sale.notes}</p>
              </div>
            )}

            {/* Informations de règlement */}
            <div className="text-center mt-8 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Merci pour votre confiance • {company?.name || 'Entreprise'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Facture générée le {formatSaleDate(new Date().toISOString())} à {formatSaleTime(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/sales">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h2 className="text-lg font-medium text-[#212121]">
            Facture - {sale.invoiceNumber}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPreview(true)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={generatePDF}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <InvoiceHeader 
            invoiceNumber={sale.invoiceNumber}
            date={formatSaleDate(sale.date)}
            time={formatSaleTime(sale.date)}
          />

          {/* Informations du client */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Client</h3>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">{sale.clientName}</p>
              <p className="text-sm text-gray-600">ID Client: {sale.clientId}</p>
            </div>
          </div>

          {/* Articles vendus */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Articles vendus</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Description</th>
                    <th className="border border-gray-300 p-3 text-center">Quantité</th>
                    <th className="border border-gray-300 p-3 text-right">Prix unitaire</th>
                    <th className="border border-gray-300 p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-3">{item.productName}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-3 text-right">{item.price.toFixed(2)} €</td>
                      <td className="border border-gray-300 p-3 text-right">{(item.quantity * item.price).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Résumé de la vente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {sale.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{sale.notes}</p>
                </div>
              )}
            </div>
            <div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total de la vente:</span>
                  <span>{sale.total.toFixed(2)} €</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <p>Date: {formatSaleDate(sale.date)}</p>
                  <p>Heure: {formatSaleTime(sale.date)}</p>
                  <p>Statut: {sale.status || 'Complétée'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}