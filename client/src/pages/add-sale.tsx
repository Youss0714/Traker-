import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils/helpers";

interface SaleItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function AddSale() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [selectedClient, setSelectedClient] = useState("");
  const [status, setStatus] = useState("pending");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Generate invoice number on mount
  useEffect(() => {
    const timestamp = Date.now().toString().slice(-6);
    setInvoiceNumber(`INV-${timestamp}`);
  }, []);
  
  // Query clients
  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
  });
  
  // Query products
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });
  
  // Add sale mutation
  const addSaleMutation = useMutation({
    mutationFn: async (sale: any) => {
      const response = await apiRequest('POST', '/api/sales', sale);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vente ajoutée",
        description: "La vente a été ajoutée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      navigate('/sales');
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return;
    
    const product = products.find((p: any) => p.id === parseInt(selectedProduct));
    if (!product) return;
    
    // Check if we already have this product in the items
    const existingItemIndex = items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].subtotal = 
        updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          subtotal: product.price * quantity
        }
      ]);
    }
    
    // Reset selection
    setSelectedProduct("");
    setQuantity(1);
  };
  
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };
  
  const handleSubmit = () => {
    if (!selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un produit",
        variant: "destructive",
      });
      return;
    }
    
    // Find client details
    const client = clients.find((c: any) => c.id === parseInt(selectedClient));
    
    const sale = {
      invoiceNumber,
      clientId: parseInt(selectedClient),
      clientName: client.name,
      status,
      total: calculateTotal(),
      items: JSON.stringify(items),
      notes
    };
    
    addSaleMutation.mutate(sale);
  };
  
  return (
    <div className="p-4 space-y-6 pb-20">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client: any) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Numéro de facture</Label>
            <Input 
              id="invoiceNumber" 
              value={invoiceNumber} 
              onChange={(e) => setInvoiceNumber(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="canceled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Produits</h3>
            
            <div className="flex space-x-2">
              <div className="flex-1">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product: any) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - {formatCurrency(product.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                />
              </div>
              <Button onClick={handleAddItem} className="bg-[#1976D2]">
                <span className="material-icons text-sm">add</span>
              </Button>
            </div>
            
            {/* Items list */}
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-[#757575]">
                        {item.quantity} x {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{formatCurrency(item.subtotal)}</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(index)}
                        className="h-7 w-7 p-0 text-[#D32F2F]"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-[#757575]">
                Aucun produit ajouté
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Notes supplémentaires (optionnel)"
            />
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full bg-[#1976D2]" 
              onClick={handleSubmit}
              disabled={addSaleMutation.isPending}
            >
              {addSaleMutation.isPending ? "Enregistrement..." : "Enregistrer la vente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
