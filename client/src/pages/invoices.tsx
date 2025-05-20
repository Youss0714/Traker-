import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sale } from "@shared/schema";

export default function Invoices() {
  const { setActivePage } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: ['/api/sales'],
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

  // Filtrer les ventes
  const filteredSales = sales?.filter(sale => {
    const matchesStatus = filterStatus === "all" || (sale.status?.toLowerCase() === filterStatus);
    const matchesSearch = searchTerm === "" || 
                         sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Factures</h2>
        <Button>
          <span className="material-icons mr-1 text-sm">add</span>
          Nouvelle facture
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
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
                            <Button size="sm" variant="outline">
                              <span className="material-icons text-[18px]">visibility</span>
                            </Button>
                            <Button size="sm" variant="outline">
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