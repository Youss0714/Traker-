import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { TaxRateSelector } from "@/components/ui/tax-rate-selector";

export default function Settings() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Paramètres généraux</h2>
      </div>

      <Card className="border-blue-200 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-4">Préférences d'affichage</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-sm">Mode sombre</Label>
                  <p className="text-xs text-gray-500">Activer le thème sombre pour l'application</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                  <p className="text-xs text-gray-500">Recevoir des notifications de l'application</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              

              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-blue-700">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger id="language" className="border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">🇫🇷</span>
                        <span>Français</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">🇺🇸</span>
                        <span>English</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-sm font-medium text-orange-800 mb-4">Paramètres de l'entreprise</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="text-sm">Sauvegarde automatique</Label>
                  <p className="text-xs text-gray-500">Sauvegarder vos données automatiquement</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>
              

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <CurrencySelector />

      {/* Tax Rate Settings */}
      <TaxRateSelector />
    </div>
  );
}