import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

// Edit Product Modal component
const EditProductModal = ({ product, onUpdate }: { product: Product; onUpdate: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    category: product.category
  });
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Produit modifié",
        description: "Le produit a été mis à jour avec succès",
      });
      setIsOpen(false);
      onUpdate();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md flex-1">
          <span className="material-icons text-sm mr-1">edit</span>
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Prix (FCFA)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Électronique">Électronique</SelectItem>
                <SelectItem value="Alimentaire">Alimentaire</SelectItem>
                <SelectItem value="Vêtements">Vêtements</SelectItem>
                <SelectItem value="Accessoires">Accessoires</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Modification..." : "Modifier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Inventory item card component
const InventoryItem = ({ item, onUpdate }: { item: Product; onUpdate: () => void }) => {
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
          <EditProductModal product={item} onUpdate={onUpdate} />
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
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    setActivePage('inventory');
  }, [setActivePage]);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products', refreshKey],
  });

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };
  
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
            <InventoryItem key={product.id} item={product} onUpdate={handleUpdate} />
          ))
        )}
      </div>
    </div>
  );
}