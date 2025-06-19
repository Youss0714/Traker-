import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/helpers";

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
  const [selectedValue, setSelectedValue] = useState("");

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      setSelectedValue(productId);
      onProductSelect(product);
    }
  };

  return (
    <Select value={selectedValue} onValueChange={handleProductSelect}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id.toString()}>
            <div className="flex justify-between items-center w-full">
              <span className="truncate">{product.name}</span>
              <span className="ml-2 text-blue-600 font-medium">
                {formatCurrency(product.price)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}