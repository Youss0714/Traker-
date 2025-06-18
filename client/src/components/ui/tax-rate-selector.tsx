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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          <span className="material-icons mr-2 align-middle">receipt</span>
          Configuration de la TVA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Taux de TVA actuel : {selectedTaxRate}%
          </label>
          <Select value={selectedTaxRate.toString()} onValueChange={handleTaxRateChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un taux de TVA" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TAX_RATES).map(([rate, config]) => (
                <SelectItem key={rate} value={rate}>
                  <div className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-gray-500">{config.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Taux disponibles :</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TAX_RATES).map(([rate, config]) => (
              <div key={rate} className="text-xs">
                <span className="font-medium">{rate}%</span> - {config.description}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-700">
            <span className="material-icons text-sm mr-1 align-middle">info</span>
            Ce taux sera appliqué par défaut sur toutes les nouvelles ventes et factures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}