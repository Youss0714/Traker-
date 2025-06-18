import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export function InventoryAlertsWidget() {
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  const lowStockProducts = Array.isArray(products) ? products.filter((product: any) => product.quantity < 10) : [];

  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {lowStockProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <span className="material-icons text-4xl text-green-500 mb-2">check_circle</span>
          <p className="text-sm text-gray-600">Aucune alerte stock</p>
        </div>
      ) : (
        lowStockProducts.map((product: any) => (
          <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-sm">warning</span>
              </div>
              <div>
                <h4 className="font-medium text-amber-800 text-sm">{product.name}</h4>
                <p className="text-xs text-amber-600">{product.category}</p>
              </div>
            </div>
            <Badge className="bg-amber-500 text-white">
              {product.quantity} restants
            </Badge>
          </div>
        ))
      )}
    </div>
  );
}