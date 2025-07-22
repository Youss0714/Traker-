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
import { useTranslation } from "@/hooks/useTranslation";
import { CompanyInvoiceHeaderPrint } from "@/components/invoice/CompanyInvoiceHeader";

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
  const { t } = useTranslation();
  
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

  // Fonction pour imprimer une facture avec header unifié
  const printInvoice = (sale: Sale) => {
    const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
    const currentTaxRate = getCurrentTaxRate();
    
    // Calculer le total HT et TVA
    const subtotalHT = Array.isArray(items) ? 
      items.reduce((sum: number, item: any) => 
        sum + ((item.quantity || 1) * (item.price || item.unitPrice || 0)), 0) : 0;
    
    const taxAmount = calculateTaxAmount(subtotalHT, currentTaxRate);
    const totalTTC = subtotalHT + taxAmount;
    
    // Récupérer les données de l'entreprise pour l'en-tête unifié
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${sale.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
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
        <!-- En-tête unifié avec informations entreprise -->
        ${CompanyInvoiceHeaderPrint({ company })}
        
        <!-- Informations de la facture -->
        <div style="background: #f0f9ff; padding: 16px; margin-bottom: 30px; border-radius: 8px; border: 1px solid #bfdbfe;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">Informations de la facture</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; line-height: 1.5;">
            <div>
              <div style="margin-bottom: 4px;">
                <span style="font-weight: 500;">N°:</span>
                <span style="font-family: monospace; font-weight: 600; margin-left: 8px;">${sale.invoiceNumber}</span>
              </div>
              <div style="margin-bottom: 4px;">
                <span style="font-weight: 500;">Date:</span>
                <span style="margin-left: 8px;">${formatDate(sale.date)}</span>
              </div>
            </div>
            <div>
              <div style="margin-bottom: 4px;">
                <span style="font-weight: 500;">Statut:</span>
                <span style="background: #059669; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px;">
                  ${sale.status === 'paid' ? 'Payée' : sale.status === 'pending' ? 'En attente' : 'Autre'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Client -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-weight: 600; color: #374151; margin-bottom: 12px;">Facturé à:</h3>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
            <p style="margin: 0; font-weight: 600; color: #374151; font-size: 16px;">${sale.clientName}</p>
            ${sale.clientId ? `<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Réf. Client: ${sale.clientId}</p>` : ''}
          </div>
        </div>

        <!-- Articles -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-weight: 600; color: #374151; margin-bottom: 16px;">Articles</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; font-weight: 600; color: #374151;">Désignation</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db; font-weight: 600; color: #374151; width: 80px;">Qté</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db; font-weight: 600; color: #374151; width: 120px;">Prix unit.</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db; font-weight: 600; color: #374151; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(items) ? items.map((item: any) => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #d1d5db; color: #374151;">${item.name || item.productName || 'Article'}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db; color: #374151;">${item.quantity || 1}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db; color: #374151;">${formatAmount(item.price || item.unitPrice || 0)}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db; font-weight: 500; color: #374151;">${formatAmount((item.quantity || 1) * (item.price || item.unitPrice || 0))}</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="padding: 20px; text-align: center; border: 1px solid #d1d5db; color: #6b7280;">Aucun article disponible</td></tr>'}
            </tbody>
          </table>
        </div>

        <!-- Totaux -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
          <div style="width: 320px;">
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
              <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 14px;">
                <span style="color: #6b7280;">Sous-total HT:</span>
                <span style="font-weight: 500; color: #374151;">${formatAmount(subtotalHT)}</span>
              </div>
              ${currentTaxRate > 0 ? `
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 14px;">
                  <span style="color: #6b7280;">TVA (${currentTaxRate}%):</span>
                  <span style="font-weight: 500; color: #374151;">${formatAmount(taxAmount)}</span>
                </div>
                <div style="border-top: 1px solid #d1d5db; padding-top: 8px; margin-top: 8px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: bold; color: #374151; font-size: 18px;">Total TTC:</span>
                    <span style="font-weight: bold; color: #6366f1; font-size: 18px;">${formatAmount(totalTTC)}</span>
                  </div>
                </div>
              ` : `
                <div style="border-top: 1px solid #d1d5db; padding-top: 8px; margin-top: 8px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: bold; color: #374151; font-size: 18px;">Total:</span>
                    <span style="font-weight: bold; color: #6366f1; font-size: 18px;">${formatAmount(subtotalHT)}</span>
                  </div>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <div style="border-top: 1px solid #d1d5db; padding-top: 20px; text-align: center; color: #6b7280;">
          <p style="margin: 0 0 4px 0; font-size: 14px;">Merci pour votre confiance !</p>
          <p style="margin: 0; font-size: 12px;">
            ${company ? `Cette facture a été générée par ${company.name} le ${new Date().toLocaleDateString('fr-FR')}` : `Cette facture a été générée automatiquement par gYS le ${new Date().toLocaleDateString('fr-FR')}`}
          </p>
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
                  placeholder={t('searchProduct')}
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
                        {t('noProductFound')} "{productSearchTerm}"
                      </div>
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        Type to search for a product
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
                No products added
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <Input 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder={t('additionalNotes')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="print-invoice"
              checked={shouldPrintInvoice}
              onCheckedChange={(checked) => setShouldPrintInvoice(checked as boolean)}
            />
            <Label htmlFor="print-invoice" className="text-sm">
              {t('printInvoice')}
            </Label>
          </div>
          
          <div className="pt-4 flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate('/dashboard')}
            >
              <span className="material-icons mr-2">cancel</span>
              {t('cancel')}
            </Button>
            <Button 
              className="flex-1 bg-[#1976D2]" 
              onClick={handleSubmit}
              disabled={addSaleMutation.isPending}
            >
              {addSaleMutation.isPending ? (t('language') === 'fr' ? "Enregistrement..." : "Saving...") : t('registerSale')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
