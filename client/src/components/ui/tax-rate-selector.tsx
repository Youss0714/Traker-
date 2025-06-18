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
    <Card className="border-purple-200 shadow-sm">
      <CardHeader className="bg-purple-50">
        <CardTitle className="text-lg font-medium text-purple-800">
          <span className="material-icons mr-2 align-middle text-purple-600">receipt</span>
          Configuration de la TVA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-purple-700 mb-2 block">
            Taux de TVA actuel : {selectedTaxRate}%
          </label>
          <Select value={selectedTaxRate.toString()} onValueChange={handleTaxRateChange}>
            <SelectTrigger className="w-full border-purple-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Sélectionner un taux de TVA" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TAX_RATES).map(([rate, config]) => (
                <SelectItem key={rate} value={rate}>
                  <span className="font-medium">{config.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        


        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-700">
            <span className="material-icons text-sm mr-1 align-middle text-purple-600">info</span>
            Ce taux sera appliqué par défaut sur toutes les nouvelles ventes et factures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}