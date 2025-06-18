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
              <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2">
                <span className="material-icons text-sm">list_alt</span>
                Exporter les produits
              </Button>
              
              <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2">
                <span className="material-icons text-sm">people</span>
                Exporter les clients
              </Button>
              
              <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2">
                <span className="material-icons text-sm">receipt</span>
                Exporter les ventes
              </Button>
              
              <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2">
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