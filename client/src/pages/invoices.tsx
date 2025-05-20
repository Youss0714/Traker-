import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";

export default function Invoices() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Factures</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <span className="material-icons text-6xl text-gray-300 mb-2">receipt_long</span>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Gestion des factures</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Cette fonctionnalité sera bientôt disponible. Vous pourrez gérer toutes vos factures depuis cette page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}