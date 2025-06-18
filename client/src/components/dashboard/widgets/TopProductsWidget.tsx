import { useQuery } from "@tanstack/react-query";

export function TopProductsWidget() {
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  const topProducts = Array.isArray(products) ? products.slice(0, 5) : [];

  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {topProducts.map((product: any, index: number) => (
        <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">#{index + 1}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
              <p className="text-xs text-gray-600">{product.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">{product.price.toLocaleString()} FCFA</p>
            <p className="text-xs text-gray-600">Stock: {product.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}