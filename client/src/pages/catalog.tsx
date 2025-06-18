import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

export default function Catalog() {
  const { setActivePage } = useAppContext();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  // Récupérer toutes les catégories uniques
  const categories = products ? 
    ["all", ...Array.from(new Set(products.map(product => product.category)))] :
    ["all"];

  // Filtrer les produits par catégorie et terme de recherche
  const filteredProducts = products?.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = searchTerm === "" || 
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Fonction pour formater le prix en FCFA
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
  };

  // Fonction pour déterminer le statut du stock
  const getStockStatus = (quantity: number, threshold: number | null) => {
    if (quantity <= 0) {
      return { label: "Épuisé", color: "bg-red-100 text-red-800" };
    } else if (threshold && quantity <= threshold) {
      return { label: "Stock faible", color: "bg-amber-100 text-amber-800" };
    } else {
      return { label: "En stock", color: "bg-green-100 text-green-800" };
    }
  };

  // Fonction pour naviguer vers la page de modification d'un produit
  const handleEditProduct = (productId: number) => {
    navigate(`/add-product?edit=${productId}`);
  };

  // Fonction pour naviguer vers la page de vente avec le produit présélectionné
  const handleSellProduct = (productId: number) => {
    navigate(`/add-sale?product=${productId}`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Catalogue de produits</h2>
        <Button onClick={() => navigate("/add-product")}>
          <span className="material-icons mr-1 text-sm">add</span>
          Ajouter un produit
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveCategory} value={activeCategory}>
        <TabsList className="mb-4 overflow-x-auto flex whitespace-nowrap py-1 px-0 h-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="px-4 py-2 data-[state=active]:bg-[#1976D2] data-[state=active]:text-white"
            >
              {category === "all" ? "Toutes les catégories" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="mt-2 text-gray-600">Chargement des produits...</p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantity, product.threshold);
                return (
                  <Card key={product.id} className="overflow-hidden bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="material-icons text-3xl text-white">inventory_2</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-cyan-800">{product.name}</h3>
                        <Badge className={`${stockStatus.color} border rounded-full`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-cyan-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-cyan-800 font-bold text-lg">{formatPrice(product.price)}</span>
                        <span className="text-sm text-cyan-600 bg-white px-2 py-1 rounded-full">Qté: {product.quantity}</span>
                      </div>
                      <div className="mt-4 flex justify-between gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <span className="material-icons text-sm mr-1">edit</span>
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                          onClick={() => handleSellProduct(product.id)}
                        >
                          <span className="material-icons text-sm mr-1">add_shopping_cart</span>
                          Vendre
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="material-icons text-4xl text-gray-300 mb-2">inventory_2</span>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Aucun produit ne correspond à vos critères de recherche.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}