import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CurrencySelector } from "@/components/ui/currency-selector";

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

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-[#212121] mb-4">Préférences d'affichage</h3>
            
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
                <Label htmlFor="language" className="text-sm">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-[#212121] mb-4">Paramètres de l'entreprise</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="text-sm">Sauvegarde automatique</Label>
                  <p className="text-xs text-gray-500">Sauvegarder vos données automatiquement</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax-rate" className="text-sm">Taux de TVA (%)</Label>
                <Select defaultValue="18">
                  <SelectTrigger id="tax-rate">
                    <SelectValue placeholder="Sélectionner un taux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <CurrencySelector />
    </div>
  );
}