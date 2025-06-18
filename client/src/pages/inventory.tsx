import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

// Inventory item card component
const InventoryItem = ({ item }: { item: Product }) => {
  const stockStatus = item.quantity <= 5 ? 
    { label: 'Stock faible', className: 'bg-red-100 text-red-600 border-red-200' } :
    { label: 'En stock', className: 'bg-green-100 text-green-600 border-green-200' };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
            <span className="material-icons text-white">inventory_2</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-purple-800">{item.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${stockStatus.className}`}>
                {stockStatus.label}
              </span>
            </div>
            <p className="text-sm text-purple-600">{item.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-semibold text-purple-800">{formatCurrency(item.price)}</span>
              <span className="text-sm text-purple-600">Stock: {item.quantity}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md flex-1">
            <span className="material-icons text-sm mr-1">edit</span>
            Modifier
          </Button>
          <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
            <span className="material-icons text-sm">visibility</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Inventory() {
  const { setActivePage } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  
  useEffect(() => {
    setActivePage('inventory');
  }, [setActivePage]);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
  });
  
  const categories = ["Tous", "Faible stock", "Électronique", "Alimentaire", "Vêtements"];
  
  const filteredProducts = Array.isArray(products) ? products.filter((product: Product) => {
    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    let matchesCategory = true;
    if (selectedCategory === "Faible stock") {
      matchesCategory = product.quantity <= 5;
    } else if (selectedCategory !== "Tous") {
      matchesCategory = product.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  }) : [];
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <span className="material-icons text-4xl text-gray-400 mb-2">error_outline</span>
          <p className="text-gray-500">Erreur lors du chargement des produits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <Input
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md" 
                  : "border-purple-300 text-purple-600 hover:bg-purple-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400 mb-2">inventory_2</span>
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        ) : (
          filteredProducts.map((product: Product) => (
            <InventoryItem key={product.id} item={product} />
          ))
        )}
      </div>
    </div>
  );
}