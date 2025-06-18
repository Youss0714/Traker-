import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Sale item card component
const SaleItem = ({ sale }: { sale: any }) => {
  const saleStatusTag = {
    'paid': { label: 'Payée', className: 'bg-green-100 text-green-600 border-green-200' },
    'pending': { label: 'En attente', className: 'bg-orange-100 text-orange-600 border-orange-200' },
    'canceled': { label: 'Annulée', className: 'bg-red-100 text-red-600 border-red-200' }
  }[sale.status || 'pending'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM yyyy, HH:mm", { locale: fr });
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-sm">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-green-800 font-medium">Vente #{sale.invoiceNumber}</h3>
                <span className={`text-xs px-2 py-1 rounded-full border ${saleStatusTag.className}`}>
                  {saleStatusTag.label}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1 bg-white px-2 py-1 rounded-full inline-block">{formatDate(sale.date)}</p>
              <p className="text-xs text-green-600 mt-1">Client: {sale.clientName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-800 font-medium text-lg">{formatCurrency(sale.total)}</p>
            <div className="flex space-x-2 mt-2">
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <span className="material-icons text-white text-sm">receipt</span>
              </button>
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <span className="material-icons text-white text-sm">share</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Sales() {
  const { setActivePage } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  
  useEffect(() => {
    setActivePage('sales');
  }, [setActivePage]);
  
  const { data: sales, isLoading, error } = useQuery({
    queryKey: ['/api/sales'],
  });
  
  const categories = ["Toutes", "Aujourd'hui", "Cette semaine", "Ce mois"];
  
  const filteredSales = sales ? sales.filter((sale: any) => {
    // Filter by search term
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sale.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    let matchesCategory = true;
    const saleDate = new Date(sale.date);
    const today = new Date();
    
    if (selectedCategory === "Aujourd'hui") {
      matchesCategory = saleDate.toDateString() === today.toDateString();
    } else if (selectedCategory === "Cette semaine") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchesCategory = saleDate >= startOfWeek;
    } else if (selectedCategory === "Ce mois") {
      matchesCategory = (
        saleDate.getMonth() === today.getMonth() && 
        saleDate.getFullYear() === today.getFullYear()
      );
    }
    
    return matchesSearch && matchesCategory;
  }) : [];
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Ventes</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <span className="material-icons text-[#757575] text-sm mr-1">filter_list</span>
              <span>Filtres</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <span className="material-icons text-[#757575] text-sm">sort</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
          <span className="material-icons text-[#757575]">search</span>
          <div className="ml-2 flex-1 h-5 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="flex overflow-x-auto pb-2 space-x-3 -mx-4 px-4">
          {categories.map((category, index) => (
            <div key={index} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
          ))}
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[100px]">
              <CardContent className="p-4 flex justify-between">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-32"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-40"></div>
                </div>
                <div className="space-y-2 items-end flex flex-col">
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-20"></div>
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-16 mt-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h3 className="text-red-700 font-medium">Erreur de chargement</h3>
            <p className="text-sm text-red-600 mt-1">
              Impossible de charger les données des ventes.
            </p>
            <Button className="mt-4 bg-red-600" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Ventes</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <span className="material-icons text-[#757575] text-sm mr-1">filter_list</span>
            <span>Filtres</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <span className="material-icons text-[#757575] text-sm">sort</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm flex items-center px-3 py-2">
        <span className="material-icons text-[#757575]">search</span>
        <Input 
          type="text" 
          placeholder="Rechercher une vente..." 
          className="ml-2 flex-1 border-none shadow-none focus-visible:ring-0 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sales Categories */}
      <div className="flex overflow-x-auto pb-2 space-x-3 -mx-4 px-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`px-4 py-2 text-sm rounded-full shadow-sm whitespace-nowrap ${
              selectedCategory === category 
                ? "bg-[#1976D2] text-white" 
                : "bg-white text-[#212121]"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Sales List */}
      <div className="space-y-3">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale: any) => (
            <SaleItem key={sale.id} sale={sale} />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <span className="material-icons text-3xl text-[#757575] mb-2">shopping_cart</span>
              <h3 className="text-[#212121] font-medium">Aucune vente trouvée</h3>
              <p className="text-sm text-[#757575] mt-1">
                Aucune vente ne correspond à vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
