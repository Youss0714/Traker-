import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Sale {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  items: any[];
  total: number;
  status: string;
  date: string;
}

// Sale item card component
const SaleItem = ({ sale }: { sale: Sale }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const statusMap: Record<string, { label: string; className: string }> = {
    'paid': { label: 'Payé', className: 'bg-green-100 text-green-600 border-green-200' },
    'pending': { label: 'En attente', className: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    'canceled': { label: 'Annulé', className: 'bg-red-100 text-red-600 border-red-200' }
  };
  const statusTag = statusMap[sale.status] || statusMap['pending'];

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1976D2; margin: 0;">gYS - Système de Gestion</h1>
          <p style="margin: 5px 0; color: #666;">Facture</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Informations de la vente</h3>
            <p style="margin: 3px 0;"><strong>Numéro:</strong> ${sale.invoiceNumber}</p>
            <p style="margin: 3px 0;"><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
            <p style="margin: 3px 0;"><strong>Statut:</strong> ${statusTag.label}</p>
          </div>
          <div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Client</h3>
            <p style="margin: 3px 0;"><strong>${sale.clientName}</strong></p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #333;">Articles</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Article</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qté</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Prix unit.</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(sale.items) ? sale.items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.name || 'Article'}</td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity || 1}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatCurrency(item.price || 0)}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatCurrency(item.subtotal || 0)}</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="padding: 10px; text-align: center; border: 1px solid #ddd;">Aucun article</td></tr>'}
            </tbody>
          </table>
        </div>
        
        <div style="text-align: right; margin-top: 20px;">
          <div style="display: inline-block; text-align: left;">
            <p style="margin: 5px 0; font-size: 18px;"><strong>Total: ${formatCurrency(sale.total)}</strong></p>
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
          <p>Merci pour votre confiance !</p>
          <p>gYS - Système de gestion d'entreprise</p>
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
                @page { margin: 20mm; }
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
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
            <span className="material-icons text-white">receipt</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-green-800">{sale.invoiceNumber}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusTag.className}`}>
                {statusTag.label}
              </span>
            </div>
            <p className="text-sm text-green-600">{sale.clientName}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-semibold text-green-800">{formatCurrency(sale.total)}</span>
              <span className="text-sm text-green-600">{new Date(sale.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md flex-1">
                <span className="material-icons text-sm mr-1">visibility</span>
                Voir détails
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-green-800">
                  Détails de la vente - {sale.invoiceNumber}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Info générale */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Informations de la vente</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Numéro:</span> {sale.invoiceNumber}</p>
                      <p><span className="font-medium">Date:</span> {new Date(sale.date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Statut:</span> <span className={`px-2 py-1 rounded text-xs ${statusTag.className}`}>{statusTag.label}</span></p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Client</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Nom:</span> {sale.clientName}</p>
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Articles vendus</h4>
                  <div className="space-y-2">
                    {Array.isArray(sale.items) && sale.items.length > 0 ? (
                      sale.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                          <div>
                            <p className="font-medium">{item.name || 'Article'}</p>
                            <p className="text-sm text-gray-600">Quantité: {item.quantity || 1}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(item.subtotal || 0)}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(item.price || 0)} / unité</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun article disponible</p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-800">Total de la vente:</span>
                    <span className="text-2xl font-bold text-green-800">{formatCurrency(sale.total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex-1"
                  >
                    <span className="material-icons text-sm mr-2">print</span>
                    Imprimer la facture
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                    className="border-gray-300"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-green-300 text-green-600 hover:bg-green-50"
            onClick={handlePrint}
          >
            <span className="material-icons text-sm">print</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Sales() {
  const { setActivePage } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  
  useEffect(() => {
    setActivePage('sales');
  }, [setActivePage]);
  
  const { data: sales, isLoading, error } = useQuery({
    queryKey: ['/api/sales'],
  });
  
  const statusOptions = ["Tous", "Payé", "En attente", "Annulé"];
  
  const filteredSales = Array.isArray(sales) ? sales.filter((sale: Sale) => {
    // Filter by search term
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    let matchesStatus = true;
    if (selectedStatus === "Payé") {
      matchesStatus = sale.status === "paid";
    } else if (selectedStatus === "En attente") {
      matchesStatus = sale.status === "pending";
    } else if (selectedStatus === "Annulé") {
      matchesStatus = sale.status === "canceled";
    }
    
    return matchesSearch && matchesStatus;
  }) : [];

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <span className="material-icons text-4xl text-gray-400 mb-2">error_outline</span>
          <p className="text-gray-500">Erreur lors du chargement des ventes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <Input
          placeholder="Rechercher une vente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              onClick={() => setSelectedStatus(status)}
              className={`whitespace-nowrap ${
                selectedStatus === status 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md" 
                  : "border-green-300 text-green-600 hover:bg-green-50"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {filteredSales.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400 mb-2">receipt</span>
            <p className="text-gray-500">Aucune vente trouvée</p>
          </div>
        ) : (
          filteredSales.map((sale: Sale) => (
            <SaleItem key={sale.id} sale={sale} />
          ))
        )}
      </div>
    </div>
  );
}