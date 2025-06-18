import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";

// Inventory item card component
const InventoryItem = ({ item }: { item: any }) => {
  const stockStatus = item.quantity <= (item.threshold || 5) ? 
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
            <div className="flex justify-between">
              <h3 className="text-purple-800 font-medium">{item.name}</h3>
              <span className="text-purple-800 font-medium">{formatCurrency(item.price)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{item.category}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${stockStatus.className}`}>
                  {stockStatus.label}
                </span>
              </div>
              <span className="text-xs text-purple-600 bg-white px-2 py-1 rounded-full">{item.quantity} unités</span>
            </div>
          </div>
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
  
  const filteredProducts = products ? products.filter((product: any) => {
    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    let matchesCategory = true;
    if (selectedCategory === "Faible stock") {
      matchesCategory = product.quantity <= (product.threshold || 5);
    } else if (selectedCategory !== "Tous") {
      matchesCategory = product.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  }) : [];
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Inventaire</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <span className="material-icons text-[#757575] text-sm mr-1">filter_list</span>
              <span>Filtres</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <span className="material-icons text-[#757575] text-sm">sort</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
          <span className="material-icons text-[#757575]">search</span>
          <div className="ml-2 flex-1 h-5 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="flex overflow-x-auto pb-2 space-x-3 -mx-4 px-4">
          {categories.map((category, index) => (
            <div key={index} className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"></div>
          ))}
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[80px]">
              <CardContent className="p-4 flex items-center">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h3 className="text-red-700 font-medium">Erreur de chargement</h3>
            <p className="text-sm text-red-600 mt-1">
              Impossible de charger les données d'inventaire.
            </p>
            <Button className="mt-4 bg-red-600" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Inventaire</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <span className="material-icons text-[#757575] text-sm mr-1">filter_list</span>
            <span>Filtres</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <span className="material-icons text-[#757575] text-sm">sort</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm flex items-center px-3 py-2">
        <span className="material-icons text-[#757575]">search</span>
        <Input 
          type="text" 
          placeholder="Rechercher un produit..." 
          className="ml-2 flex-1 border-none shadow-none focus-visible:ring-0 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inventory Categories */}
      <div className="flex overflow-x-auto pb-2 space-x-3 -mx-4 px-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`px-4 py-2 text-sm rounded-full shadow-sm whitespace-nowrap ${
              selectedCategory === category 
                ? "bg-[#1976D2] text-white" 
                : "bg-white text-[#212121]"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any) => (
            <InventoryItem key={product.id} item={product} />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <span className="material-icons text-3xl text-[#757575] mb-2">inventory</span>
              <h3 className="text-[#212121] font-medium">Aucun produit trouvé</h3>
              <p className="text-sm text-[#757575] mt-1">
                Aucun produit ne correspond à vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
