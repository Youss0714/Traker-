import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Currency, CURRENCIES, getCurrentCurrency, setCurrentCurrency } from "@/lib/utils/helpers";
import { useToast } from "@/hooks/use-toast";

export function CurrencyDropdown() {
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
      description: `Devise changée en ${CURRENCIES[currency].name}`,
    });

    // Trigger a page reload to update all currency displays
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-white hover:bg-blue-700">
          <span className="font-medium text-base">{CURRENCIES[selectedCurrency].symbol}</span>
          <span className="material-icons text-sm">keyboard_arrow_down</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
        <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
          Choisir une devise
        </div>
        {Object.entries(CURRENCIES).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleCurrencyChange(code as Currency)}
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
              selectedCurrency === code ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg w-8">{config.symbol}</span>
              <div>
                <div className="font-medium">{config.name}</div>
                <div className="text-xs text-gray-500">{code}</div>
              </div>
            </div>
            {selectedCurrency === code && (
              <span className="material-icons text-blue-600">check_circle</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}