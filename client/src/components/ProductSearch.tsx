import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/helpers";
import { Search, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock?: number;
}

interface ProductSearchProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  placeholder?: string;
}

export function ProductSearch({ products, onProductSelect, placeholder = "Rechercher un produit..." }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 5); // Limiter à 5 résultats pour la performance
  }, [products, searchTerm]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setIsOpen(false);
    onProductSelect(product);
  };

  const handleClear = () => {
    setSelectedProduct(null);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setSelectedProduct(null);
    setIsOpen(value.length > 0);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
          className="pl-10 pr-10"
        />
        {(searchTerm || selectedProduct) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleProductSelect(product)}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {product.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(product.price)}
                    </div>
                    {product.stock !== undefined && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Stock: {product.stock}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {isOpen && searchTerm && filteredProducts.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500 dark:text-gray-400">
            Aucun produit trouvé pour "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}