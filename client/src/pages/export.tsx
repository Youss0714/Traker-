import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Export() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Exporter les données</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <span className="material-icons text-4xl text-gray-400 mb-2">file_download</span>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exporter vos données</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Téléchargez vos données d'entreprise pour les conserver ou les utiliser dans d'autres applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <span className="material-icons text-sm">list_alt</span>
                Exporter les produits
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <span className="material-icons text-sm">people</span>
                Exporter les clients
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <span className="material-icons text-sm">receipt</span>
                Exporter les ventes
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <span className="material-icons text-sm">download</span>
                Exporter tout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}