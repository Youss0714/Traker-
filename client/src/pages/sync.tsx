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

      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-teal-100 to-cyan-100 m-4 rounded-lg border border-teal-200 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-lg border border-teal-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-lg">cloud_sync</span>
              </div>
              <div>
                <Label className="text-base font-medium text-teal-800">Synchronisation automatique</Label>
                <p className="text-sm text-teal-600">Activer la synchronisation des données</p>
              </div>
            </div>
            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} className="data-[state=checked]:bg-teal-500" />
          </div>
          
          {syncEnabled && (
            <>
              <div className="space-y-2 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-700">Dernière synchronisation:</span>
                  <span className="text-sm font-medium text-teal-800">{lastSyncDate}</span>
                </div>
                
                {isSyncing ? (
                  <div className="space-y-2">
                    <Progress value={syncProgress} className="h-2 bg-teal-200" />
                    <div className="flex justify-between text-xs text-teal-600">
                      <span>Synchronisation en cours...</span>
                      <span>{syncProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <Button onClick={handleSync} className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg">
                    <span className="material-icons text-sm mr-2">sync</span>
                    Synchroniser maintenant
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 pt-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <h3 className="text-sm font-medium text-teal-800">Paramètres de synchronisation</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-teal-700">Synchroniser sur Wi-Fi uniquement</Label>
                    <p className="text-xs text-teal-600">Économiser les données mobiles</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-teal-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-teal-700">Synchronisation des images</Label>
                    <p className="text-xs text-teal-600">Inclure les images des produits</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-teal-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-teal-700">Synchronisation en arrière-plan</Label>
                    <p className="text-xs text-teal-600">Mettre à jour même quand l'app est fermée</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-teal-500" />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}