import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Rapports</h2>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-4">
                <span className="material-icons text-4xl text-gray-400 mb-2">trending_up</span>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Rapports de vente</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Analysez vos performances de vente sur différentes périodes.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">calendar_today</span>
                    Rapport quotidien
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">date_range</span>
                    Rapport hebdomadaire
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">event_note</span>
                    Rapport mensuel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-4">
                <span className="material-icons text-4xl text-gray-400 mb-2">inventory_2</span>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Rapports d'inventaire</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Suivez votre inventaire et identifiez les produits à réapprovisionner.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">warning</span>
                    Produits à faible stock
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">trending_down</span>
                    Produits peu vendus
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">trending_up</span>
                    Produits les plus vendus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-4">
                <span className="material-icons text-4xl text-gray-400 mb-2">people</span>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Rapports clients</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Analysez le comportement d'achat et la fidélité de vos clients.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">stars</span>
                    Meilleurs clients
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">person_add</span>
                    Nouveaux clients
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">people_outline</span>
                    Clients inactifs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}