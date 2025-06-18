import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";

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
  const statusMap: Record<string, { label: string; className: string }> = {
    'paid': { label: 'Payé', className: 'bg-green-100 text-green-600 border-green-200' },
    'pending': { label: 'En attente', className: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    'canceled': { label: 'Annulé', className: 'bg-red-100 text-red-600 border-red-200' }
  };
  const statusTag = statusMap[sale.status] || statusMap['pending'];

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
          <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md flex-1">
            <span className="material-icons text-sm mr-1">visibility</span>
            Voir détails
          </Button>
          <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
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