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
    <Card className="border-green-200 shadow-sm">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-lg font-medium text-green-800">
          <span className="material-icons mr-2 align-middle text-green-600">monetization_on</span>
          Devise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-green-700 mb-2 block">
            Devise actuelle : {CURRENCIES[selectedCurrency].name}
          </label>
          <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full border-green-300 focus:border-green-500 focus:ring-green-500">
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
        


        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-xs text-green-700">
            <span className="material-icons text-sm mr-1 align-middle text-green-600">info</span>
            Le changement de devise s'appliquera à toute l'application et sera sauvegardé.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}