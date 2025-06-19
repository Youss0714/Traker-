import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaxRate, TAX_RATES, getCurrentTaxRate, setCurrentTaxRate } from "@/lib/utils/tax";
import { useToast } from "@/hooks/use-toast";

interface TaxRateSelectorProps {
  onTaxRateChange?: (rate: TaxRate) => void;
}

export function TaxRateSelector({ onTaxRateChange }: TaxRateSelectorProps) {
  const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRate>(getCurrentTaxRate());
  const { toast } = useToast();

  useEffect(() => {
    setSelectedTaxRate(getCurrentTaxRate());
  }, []);

  const handleTaxRateChange = (value: string) => {
    const rate = parseInt(value) as TaxRate;
    setSelectedTaxRate(rate);
    setCurrentTaxRate(rate);
    
    toast({
      title: "Taux de TVA modifié",
      description: `Le taux de TVA a été défini à ${rate}%`,
    });

    if (onTaxRateChange) {
      onTaxRateChange(rate);
    }
  };

  return (
    <Card className="border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="text-lg font-medium text-purple-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-lg">receipt</span>
          </div>
          Configuration de la TVA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <label className="text-sm font-medium text-purple-700 mb-2 block">
            Taux de TVA actuel : {selectedTaxRate}%
          </label>
          <Select value={selectedTaxRate.toString()} onValueChange={handleTaxRateChange}>
            <SelectTrigger className="w-full border-purple-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Sélectionner un taux de TVA" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 shadow-lg">
              {Object.entries(TAX_RATES).map(([rate, config]) => (
                <SelectItem 
                  key={rate} 
                  value={rate}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-600 dark:hover:to-gray-500 text-purple-800 dark:text-purple-200 border-b border-purple-100 dark:border-gray-600 last:border-b-0"
                >
                  <span className="font-medium text-purple-700 dark:text-purple-300">{config.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        


        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border border-purple-300">
          <p className="text-xs text-purple-700 flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-xs">info</span>
            </div>
            Ce taux sera appliqué par défaut sur toutes les nouvelles ventes et factures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}