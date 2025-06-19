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
      <DropdownMenuContent align="end" side="bottom" className="w-56 bg-white dark:bg-gray-800 border border-blue-300 dark:border-gray-600 shadow-xl z-[9999] mt-2">
        <div className="px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600">
          Choisir une devise
        </div>
        {Object.entries(CURRENCIES).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleCurrencyChange(code as Currency)}
            className={`flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-gray-600 dark:hover:to-gray-500 border-b border-blue-100 dark:border-gray-600 last:border-b-0 ${
              selectedCurrency === code ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400' : 'text-blue-800 dark:text-blue-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg w-8 text-blue-700 dark:text-blue-300">{config.symbol}</span>
              <div>
                <div className="font-medium text-blue-800 dark:text-blue-200">{config.name}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">{code}</div>
              </div>
            </div>
            {selectedCurrency === code && (
              <span className="material-icons text-blue-600 dark:text-blue-400">check_circle</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}