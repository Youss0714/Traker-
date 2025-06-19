import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils/helpers";
import { Company, Sale } from "@shared/schema";
import { getCurrentTaxRate, calculateTaxAmount, calculateBasePriceFromTotal } from "@/lib/utils/tax";
import { QuickAddClient } from "@/components/QuickAddClient";
import { Plus } from "lucide-react";

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
  
  // Get URL parameters for product preselection
  const searchParams = new URLSearchParams(window.location.search);
  const preselectedProductId = searchParams.get('product');
  
  const [selectedClient, setSelectedClient] = useState("");
  const [status, setStatus] = useState("pending");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(preselectedProductId || "");
  const [selectedProductObj, setSelectedProductObj] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [shouldPrintInvoice, setShouldPrintInvoice] = useState(true);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Generate invoice number on mount
  useEffect(() => {
    const timestamp = Date.now().toString().slice(-6);
    setInvoiceNumber(`INV-${timestamp}`);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Query clients
  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });
  
  // Query products
  const { data: products } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  // Filter products based on search term
  const filteredProducts = products?.filter((product: any) => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(productSearchTerm.toLowerCase())
  ) || [];

  // Query company for invoice printing
  const { data: company } = useQuery<Company>({
    queryKey: ['/api/company'],
  });
  
  // Add sale mutation
  const addSaleMutation = useMutation({
    mutationFn: async (sale: any) => {
      const response = await apiRequest('POST', '/api/sales', sale);
      return response.json();
    },
    onSuccess: (newSale: Sale) => {
      toast({
        title: "Vente ajoutée",
        description: "La vente a été ajoutée avec succès",
      });
      
      // Imprimer automatiquement la facture si l'option est activée
      if (newSale && shouldPrintInvoice) {
        setTimeout(() => {
          printInvoice(newSale);
        }, 500); // Petit délai pour s'assurer que les données sont disponibles
      }
      
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
    if (!selectedProductObj || quantity <= 0) return;
    
    const product = selectedProductObj;
    
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
    setSelectedProductObj(null);
    setQuantity(1);
    setProductSearchTerm("");
    setShowProductDropdown(false);
  };
  
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Fonction pour formater le montant en FCFA
  const formatAmount = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Fonction pour imprimer une facture
  const printInvoice = (sale: Sale) => {
    const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
    const currentTaxRate = getCurrentTaxRate();
    
    // Calculer le total HT et TVA
    const subtotalHT = Array.isArray(items) ? 
      items.reduce((sum: number, item: any) => 
        sum + ((item.quantity || 1) * (item.price || item.unitPrice || 0)), 0) : 0;
    
    const taxAmount = calculateTaxAmount(subtotalHT, currentTaxRate);
    const totalTTC = subtotalHT + taxAmount;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${sale.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company { font-size: 24px; font-weight: bold; color: #1976D2; }
          .company-info { margin-top: 10px; font-size: 14px; color: #555; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-details, .client-details { flex: 1; }
          .invoice-details { text-align: right; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; }
          .total-section { text-align: right; font-size: 18px; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${company ? `
            <div class="company">${company.name}</div>
            <div class="company-info">
              ${company.address}<br>
              Tél: ${company.phone} | Email: ${company.email}<br>
              ${company.website ? `Site: ${company.website}<br>` : ''}
            </div>
          ` : `
            <div class="company">gYS - Gestion d'Entreprise</div>
            <div>Système de gestion commerciale</div>
          `}
        </div>
        
        <div class="invoice-info">
          <div class="client-details">
            <h3>Facturé à:</h3>
            <strong>${sale.clientName}</strong><br>
            ${sale.clientId ? `Réf. Client: ${sale.clientId}` : ''}
          </div>
          <div class="invoice-details">
            <h3>Détails de la facture:</h3>
            <strong>N° Facture: ${sale.invoiceNumber}</strong><br>
            Date: ${formatDate(sale.date)}<br>
            Statut: ${sale.status === 'paid' ? 'Payée' : sale.status === 'pending' ? 'En attente' : 'Autre'}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${Array.isArray(items) ? items.map((item: any) => `
              <tr>
                <td>${item.name || item.productName || 'Article'}</td>
                <td>${item.quantity || 1}</td>
                <td>${formatAmount(item.price || item.unitPrice || 0)}</td>
                <td>${formatAmount((item.quantity || 1) * (item.price || item.unitPrice || 0))}</td>
              </tr>
            `).join('') : '<tr><td colspan="4">Aucun article disponible</td></tr>'}
          </tbody>
        </table>

        <div class="total-section">
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Sous-total HT:</span>
              <span><strong>${formatAmount(subtotalHT)}</strong></span>
            </div>
            ${currentTaxRate > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>TVA (${currentTaxRate}%):</span>
                <span><strong>${formatAmount(taxAmount)}</strong></span>
              </div>
              <div style="border-top: 1px solid #ddd; padding-top: 5px; display: flex; justify-content: space-between;">
                <span>Total TTC:</span>
                <span><strong>${formatAmount(totalTTC)}</strong></span>
              </div>
            ` : `
              <div style="border-top: 1px solid #ddd; padding-top: 5px; display: flex; justify-content: space-between;">
                <span>Total:</span>
                <span><strong>${formatAmount(subtotalHT)}</strong></span>
              </div>
            `}
          </div>
        </div>

        <div class="footer">
          <p>Merci pour votre confiance !</p>
          ${company ? `
            <p>Cette facture a été générée par ${company.name} le ${new Date().toLocaleDateString('fr-FR')}</p>
          ` : `
            <p>Cette facture a été générée automatiquement par gYS le ${new Date().toLocaleDateString('fr-FR')}</p>
          `}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
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
    const client = clients?.find((c: any) => c.id === parseInt(selectedClient));
    
    const sale = {
      invoiceNumber,
      clientId: parseInt(selectedClient),
      clientName: client?.name || "Client inconnu",
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
            <div className="flex items-center justify-between">
              <Label htmlFor="client">Client</Label>
              <QuickAddClient 
                onClientCreated={(newClient) => {
                  setSelectedClient(newClient.id.toString());
                }}
                trigger={
                  <Button variant="outline" size="sm" type="button">
                    <Plus className="w-4 h-4 mr-1" />
                    Nouveau client
                  </Button>
                }
              />
            </div>
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
              <div className="flex-1 relative" ref={dropdownRef}>
                <Input
                  placeholder="Rechercher un produit..."
                  value={productSearchTerm}
                  onChange={(e) => {
                    setProductSearchTerm(e.target.value);
                    setShowProductDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowProductDropdown(productSearchTerm.length > 0 || filteredProducts.length > 0)}
                  className="w-full"
                />
                
                {/* Dropdown des produits filtrés */}
                {showProductDropdown && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSelectedProduct(product.id.toString());
                            setSelectedProductObj(product);
                            setProductSearchTerm(product.name);
                            setShowProductDropdown(false);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">{formatCurrency(product.price)}</p>
                              <p className="text-xs text-gray-500">Stock: {product.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : productSearchTerm ? (
                      <div className="p-3 text-center text-gray-500">
                        Aucun produit trouvé pour "{productSearchTerm}"
                      </div>
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        Tapez pour rechercher un produit
                      </div>
                    )}
                  </div>
                )}
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
                <Plus className="w-4 h-4" />
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

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="print-invoice"
              checked={shouldPrintInvoice}
              onCheckedChange={(checked) => setShouldPrintInvoice(checked as boolean)}
            />
            <Label htmlFor="print-invoice" className="text-sm">
              Imprimer automatiquement la facture après la vente
            </Label>
          </div>
          
          <div className="pt-4 flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate('/dashboard')}
            >
              <span className="material-icons mr-2">cancel</span>
              Annuler
            </Button>
            <Button 
              className="flex-1 bg-[#1976D2]" 
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
