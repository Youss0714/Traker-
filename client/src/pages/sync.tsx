import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function Sync() {
  const { setActivePage } = useAppContext();
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [lastSyncDate, setLastSyncDate] = useState("20/05/2025 09:45");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    // Simulation de la synchronisation
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setLastSyncDate(new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Synchronisation</h2>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Synchronisation automatique</Label>
              <p className="text-sm text-gray-500">Activer la synchronisation des données</p>
            </div>
            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
          </div>
          
          {syncEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dernière synchronisation:</span>
                  <span className="text-sm font-medium">{lastSyncDate}</span>
                </div>
                
                {isSyncing ? (
                  <div className="space-y-2">
                    <Progress value={syncProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Synchronisation en cours...</span>
                      <span>{syncProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <Button onClick={handleSync} className="w-full">
                    <span className="material-icons text-sm mr-2">sync</span>
                    Synchroniser maintenant
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-medium">Paramètres de synchronisation</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Synchroniser sur Wi-Fi uniquement</Label>
                    <p className="text-xs text-gray-500">Économiser les données mobiles</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Synchronisation des images</Label>
                    <p className="text-xs text-gray-500">Inclure les images des produits</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Synchronisation en arrière-plan</Label>
                    <p className="text-xs text-gray-500">Mettre à jour même quand l'app est fermée</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}