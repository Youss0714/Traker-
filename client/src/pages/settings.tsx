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
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border border-indigo-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">dark_mode</span>
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="text-sm font-medium text-indigo-800">Mode sombre</Label>
                    <p className="text-xs text-indigo-600">Activer le thème sombre pour l'application</p>
                  </div>
                </div>
                <Switch id="dark-mode" className="data-[state=checked]:bg-indigo-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">notifications</span>
                  </div>
                  <div>
                    <Label htmlFor="notifications" className="text-sm font-medium text-emerald-800">Notifications</Label>
                    <p className="text-xs text-emerald-600">Recevoir des notifications de l'application</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-700 font-medium">Activé</span>
                  <Switch id="notifications" defaultChecked className="data-[state=checked]:bg-emerald-500" />
                </div>
              </div>
              

              
              <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-300 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">language</span>
                  </div>
                  <div>
                    <Label htmlFor="language" className="text-sm font-medium text-blue-800">Langue</Label>
                    <p className="text-xs text-blue-600">Choisir la langue de l'interface</p>
                  </div>
                </div>
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
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">backup</span>
                  </div>
                  <div>
                    <Label htmlFor="auto-backup" className="text-sm font-medium text-orange-800">Sauvegarde automatique</Label>
                    <p className="text-xs text-orange-600">Sauvegarder vos données automatiquement</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-orange-700 font-medium bg-orange-200 px-2 py-1 rounded-full">Activé</span>
                  <Switch id="auto-backup" defaultChecked className="data-[state=checked]:bg-orange-500" />
                </div>
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