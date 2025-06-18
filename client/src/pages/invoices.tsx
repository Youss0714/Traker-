import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sale, Company } from "@shared/schema";
import { getCurrentTaxRate, calculateTaxAmount } from "@/lib/utils/tax";
import { useLocation } from "wouter";

export default function Invoices() {
  const { setActivePage } = useAppContext();
  const [, navigate] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: ['/api/sales'],
  });

  const { data: company } = useQuery<Company>({
    queryKey: ['/api/company'],
  });
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  // Fonction pour formater le montant en FCFA
  const formatAmount = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusBadge = (status: string | null) => {
    if (!status) return { label: "Inconnu", color: "bg-gray-200 text-gray-800" };
    
    switch(status.toLowerCase()) {
      case 'paid':
        return { label: "Payée", color: "bg-green-100 text-green-800" };
      case 'pending':
        return { label: "En attente", color: "bg-amber-100 text-amber-800" };
      case 'cancelled':
        return { label: "Annulée", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-200 text-gray-800" };
    }
  };

  // Fonction pour imprimer une facture
  const printInvoice = (sale: Sale) => {
    const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
    const currentTaxRate = getCurrentTaxRate();
    
    // Calculer le total HT et TVA
    const subtotalHT = Array.isArray(items) ? 
      items.reduce((sum: number, item: any) => 
        sum + ((item.quantity || 1) * (item.price || item.unitPrice || 0)), 0) : 0;
    
    const taxAmount = calculateTaxAmount(subtotalHT, currentTaxRate);
    const totalTTC = subtotalHT + taxAmount;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${sale.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company { font-size: 24px; font-weight: bold; color: #1976D2; }
          .company-info { margin-top: 10px; font-size: 14px; color: #555; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-details, .client-details { flex: 1; }
          .invoice-details { text-align: right; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; }
          .total-section { text-align: right; font-size: 18px; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${company ? `
            <div class="company">${company.name}</div>
            <div class="company-info">
              ${company.address}<br>
              Tél: ${company.phone} | Email: ${company.email}<br>
              ${company.website ? `Site: ${company.website}<br>` : ''}
            </div>
          ` : `
            <div class="company">gYS - Gestion d'Entreprise</div>
            <div>Système de gestion commerciale</div>
          `}
        </div>
        
        <div class="invoice-info">
          <div class="client-details">
            <h3>Facturé à:</h3>
            <strong>${sale.clientName}</strong><br>
            ${sale.clientId ? `Réf. Client: ${sale.clientId}` : ''}
          </div>
          <div class="invoice-details">
            <h3>Détails de la facture:</h3>
            <strong>N° Facture: ${sale.invoiceNumber}</strong><br>
            Date: ${formatDate(sale.date)}<br>
            Statut: ${getStatusBadge(sale.status).label}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${Array.isArray(items) ? items.map((item: any) => `
              <tr>
                <td>${item.name || item.productName || 'Article'}</td>
                <td>${item.quantity || 1}</td>
                <td>${formatAmount(item.price || item.unitPrice || 0)}</td>
                <td>${formatAmount((item.quantity || 1) * (item.price || item.unitPrice || 0))}</td>
              </tr>
            `).join('') : '<tr><td colspan="4">Aucun article disponible</td></tr>'}
          </tbody>
        </table>

        <div class="total-section">
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Sous-total HT:</span>
              <span><strong>${formatAmount(subtotalHT)}</strong></span>
            </div>
            ${currentTaxRate > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>TVA (${currentTaxRate}%):</span>
                <span><strong>${formatAmount(taxAmount)}</strong></span>
              </div>
              <div style="border-top: 1px solid #ddd; padding-top: 5px; display: flex; justify-content: space-between;">
                <span>Total TTC:</span>
                <span><strong>${formatAmount(totalTTC)}</strong></span>
              </div>
            ` : `
              <div style="border-top: 1px solid #ddd; padding-top: 5px; display: flex; justify-content: space-between;">
                <span>Total:</span>
                <span><strong>${formatAmount(subtotalHT)}</strong></span>
              </div>
            `}
          </div>
        </div>

        <div class="footer">
          <p>Merci pour votre confiance !</p>
          ${company ? `
            <p>Cette facture a été générée par ${company.name} le ${new Date().toLocaleDateString('fr-FR')}</p>
          ` : `
            <p>Cette facture a été générée automatiquement par gYS le ${new Date().toLocaleDateString('fr-FR')}</p>
          `}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  // Filtrer les ventes
  const filteredSales = sales?.filter(sale => {
    const matchesStatus = filterStatus === "all" || (sale.status?.toLowerCase() === filterStatus);
    const matchesSearch = searchTerm === "" || 
                         sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des factures</h2>
          <p className="text-gray-600 mt-1">Consultez et imprimez vos factures clients</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (filteredSales && filteredSales.length > 0) {
                filteredSales.forEach((sale, index) => {
                  setTimeout(() => printInvoice(sale), index * 1000);
                });
              }
            }}
            disabled={!filteredSales || filteredSales.length === 0}
          >
            <span className="material-icons mr-1 text-sm">print</span>
            Imprimer tout
          </Button>
          <Button onClick={() => navigate('/add-sale')}>
            <span className="material-icons mr-1 text-sm">add</span>
            Nouvelle facture
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 m-4 rounded-lg border border-yellow-200">
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Rechercher par numéro de facture ou nom de client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px] h-10">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-10">
                <span className="material-icons mr-2">file_download</span>
                Exporter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="mt-2 text-gray-600">Chargement des factures...</p>
            </div>
          ) : filteredSales && filteredSales.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => {
                    const statusBadge = getStatusBadge(sale.status);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                        <TableCell>{sale.clientName}</TableCell>
                        <TableCell>{formatAmount(sale.total)}</TableCell>
                        <TableCell>
                          <Badge className={statusBadge.color}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" title="Voir les détails">
                              <span className="material-icons text-[18px]">visibility</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => printInvoice(sale)}
                              title="Imprimer la facture"
                            >
                              <span className="material-icons text-[18px]">print</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="material-icons text-4xl text-gray-300 mb-2">receipt_long</span>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune facture trouvée</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Aucune facture ne correspond à vos critères de recherche.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}