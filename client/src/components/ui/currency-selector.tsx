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
    <Card className="border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
        <CardTitle className="text-lg font-medium text-green-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-lg">monetization_on</span>
          </div>
          Devise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <label className="text-sm font-medium text-green-700 mb-2 block">
            Devise actuelle : {CURRENCIES[selectedCurrency].name}
          </label>
          <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full border-green-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-green-300 dark:border-gray-600 shadow-lg">
              {Object.entries(CURRENCIES).map(([code, config]) => (
                <SelectItem 
                  key={code} 
                  value={code}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 hover:from-green-100 hover:to-emerald-100 dark:hover:from-gray-600 dark:hover:to-gray-500 text-green-800 dark:text-green-200 border-b border-green-100 dark:border-gray-600 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700 dark:text-green-300">{config.symbol}</span>
                    <span className="text-green-800 dark:text-green-200">{config.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        


        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg border border-green-300">
          <div className="text-xs text-green-700 flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-xs">info</span>
            </div>
            <span>Le changement de devise s'appliquera à toute l'application et sera sauvegardé.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}