import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";

export default function Catalog() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Catalogue de produits</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <span className="material-icons text-6xl text-gray-300 mb-2">category</span>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Catalogue de produits</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Cette fonctionnalité sera bientôt disponible. Vous pourrez créer et gérer votre catalogue de produits avec des catégories personnalisées.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}