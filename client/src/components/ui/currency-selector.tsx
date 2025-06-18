import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Currency, CURRENCIES, getCurrentCurrency, setCurrentCurrency } from "@/lib/utils/helpers";
import { useToast } from "@/hooks/use-toast";

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
}

export function CurrencySelector({ onCurrencyChange }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(getCurrentCurrency());
  const { toast } = useToast();

  useEffect(() => {
    setSelectedCurrency(getCurrentCurrency());
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setCurrentCurrency(currency);
    
    toast({
      title: "Devise modifiée",
      description: `La devise a été changée en ${CURRENCIES[currency].name}`,
    });

    // Trigger a page reload to update all currency displays
    setTimeout(() => {
      window.location.reload();
    }, 1000);

    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          <span className="material-icons mr-2 align-middle">monetization_on</span>
          Devise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Devise actuelle : {CURRENCIES[selectedCurrency].name}
          </label>
          <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CURRENCIES).map(([code, config]) => (
                <SelectItem key={code} value={code}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{config.symbol}</span>
                    <span>{config.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Devises disponibles :</p>
          <div className="space-y-1">
            {Object.entries(CURRENCIES).map(([code, config]) => (
              <div key={code} className="flex justify-between text-sm">
                <span>{config.name}</span>
                <span className="font-medium">{config.symbol}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-700">
            <span className="material-icons text-sm mr-1 align-middle">info</span>
            Le changement de devise s'appliquera à toute l'application et sera sauvegardé.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}