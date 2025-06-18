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
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 m-4 rounded-lg border border-emerald-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-3xl text-white">trending_up</span>
                </div>
                <h3 className="text-lg font-medium text-emerald-800 mb-4">Rapports de vente</h3>
                <p className="text-emerald-600 max-w-md mx-auto mb-6">
                  Analysez vos performances de vente sur différentes périodes.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">calendar_today</span>
                    Rapport quotidien
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">date_range</span>
                    Rapport hebdomadaire
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">event_note</span>
                    Rapport mensuel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-violet-100 to-purple-100 m-4 rounded-lg border border-violet-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-3xl text-white">inventory_2</span>
                </div>
                <h3 className="text-lg font-medium text-violet-800 mb-4">Rapports d'inventaire</h3>
                <p className="text-violet-600 max-w-md mx-auto mb-6">
                  Suivez votre inventaire et identifiez les produits à réapprovisionner.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">warning</span>
                    Produits à faible stock
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">trending_down</span>
                    Produits peu vendus
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">trending_up</span>
                    Produits les plus vendus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 m-4 rounded-lg border border-amber-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-3xl text-white">people</span>
                </div>
                <h3 className="text-lg font-medium text-amber-800 mb-4">Rapports clients</h3>
                <p className="text-amber-600 max-w-md mx-auto mb-6">
                  Analysez le comportement d'achat et la fidélité de vos clients.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">stars</span>
                    Meilleurs clients
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">person_add</span>
                    Nouveaux clients
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg flex items-center justify-center gap-2">
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