import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Export() {
  const { setActivePage } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  // Fetch data for exports
  const { data: products } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  const { data: sales } = useQuery<any[]>({
    queryKey: ['/api/sales'],
  });

  const { data: categories } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  // Export functions
  const downloadJSON = (data: any, filename: string) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: `${filename} exporté avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export",
        variant: "destructive",
      });
    }
  };

  const handleExportProducts = async () => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucun produit à exporter",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    console.log('🔄 Export des produits...', products);
    downloadJSON(products, 'produits');
    setIsLoading(false);
  };

  const handleExportClients = async () => {
    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucun client à exporter",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    console.log('🔄 Export des clients...', clients);
    downloadJSON(clients, 'clients');
    setIsLoading(false);
  };

  const handleExportSales = async () => {
    if (!sales || !Array.isArray(sales) || sales.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucune vente à exporter",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    console.log('🔄 Export des ventes...', sales);
    downloadJSON(sales, 'ventes');
    setIsLoading(false);
  };

  const handleExportAll = async () => {
    setIsLoading(true);
    console.log('🔄 Export de toutes les données...');
    
    const allData = {
      products: products || [],
      clients: clients || [],
      sales: sales || [],
      categories: categories || [],
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    downloadJSON(allData, 'export_complet');
    setIsLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Exporter les données</h2>
      </div>

      <Card className="bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-200 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-sky-100 to-indigo-100 m-4 rounded-lg border border-sky-200">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-3xl text-white">file_download</span>
            </div>
            <h3 className="text-lg font-medium text-sky-800 mb-4">Exporter vos données</h3>
            <p className="text-sky-600 max-w-md mx-auto mb-6">
              Téléchargez vos données d'entreprise pour les conserver ou les utiliser dans d'autres applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button 
                onClick={handleExportProducts}
                disabled={isLoading}
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-icons text-sm">list_alt</span>
                {isLoading ? "Export..." : "Exporter les produits"}
              </Button>
              
              <Button 
                onClick={handleExportClients}
                disabled={isLoading}
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-icons text-sm">people</span>
                {isLoading ? "Export..." : "Exporter les clients"}
              </Button>
              
              <Button 
                onClick={handleExportSales}
                disabled={isLoading}
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-icons text-sm">receipt</span>
                {isLoading ? "Export..." : "Exporter les ventes"}
              </Button>
              
              <Button 
                onClick={handleExportAll}
                disabled={isLoading}
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-icons text-sm">download</span>
                {isLoading ? "Export..." : "Exporter tout"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}