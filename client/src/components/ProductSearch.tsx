import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/helpers";
import { Search, X, ChevronDown } from "lucide-react";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products.slice(0, 10); // Afficher les 10 premiers produits par défaut
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 8); // Limiter à 8 résultats pour la performance
  }, [products, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setIsOpen(false);
    setShowDropdown(false);
    onProductSelect(product);
  };

  const handleClear = () => {
    setSelectedProduct(null);
    setSearchTerm("");
    setIsOpen(false);
    setShowDropdown(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setSelectedProduct(null);
    setIsOpen(value.length > 0);
    setShowDropdown(value.length > 0);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setIsOpen(!showDropdown);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            setShowDropdown(true);
          }}
          className="pl-10 pr-16"
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {(searchTerm || selectedProduct) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleDropdown}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {(isOpen || showDropdown) && filteredProducts.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelect(product)}
                  className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0 focus:bg-blue-100 dark:focus:bg-blue-900/30 focus:outline-none transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {product.description}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
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
            </div>
          </CardContent>
        </Card>
      )}

      {(isOpen || showDropdown) && searchTerm && filteredProducts.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div>Aucun produit trouvé pour "{searchTerm}"</div>
            <div className="text-xs mt-1">Essayez avec un autre terme de recherche</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}