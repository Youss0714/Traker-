import { useState, useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { InvoiceHeader, PrintableInvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { Plus, Trash2, FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceItem {
  id: string;
  productId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  clientId: number;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  date: string;
  time: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export default function Invoices() {
  const { setActivePage } = useAppContext();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientId: 0,
    clientName: "",
    clientAddress: "",
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ],
    notes: "",
    subtotal: 0,
    taxRate: 19.25,
    taxAmount: 0,
    total: 0
  });

  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  const { data: products } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  useEffect(() => {
    setActivePage('sales');
  }, [setActivePage]);

  useEffect(() => {
    calculateTotals();
  }, [invoiceData.items, invoiceData.taxRate]);

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * invoiceData.taxRate) / 100;
    const total = subtotal + taxAmount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const selectProduct = (itemId: string, productId: string) => {
    const product = products?.find((p: any) => p.id === parseInt(productId));
    if (product) {
      updateItem(itemId, 'description', product.name);
      updateItem(itemId, 'unitPrice', product.price);
      updateItem(itemId, 'productId', product.id);
    }
  };

  const selectClient = (clientId: string) => {
    const client = clients?.find((c: any) => c.id === parseInt(clientId));
    if (client) {
      setInvoiceData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientAddress: client.address || ""
      }));
    }
  };

  const generatePDF = () => {
    setShowPreview(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const saveInvoice = async () => {
    try {
      // Ici vous pourriez sauvegarder la facture dans la base de données
      toast({
        title: "Facture sauvegardée",
        description: `Facture ${invoiceData.invoiceNumber} sauvegardée avec succès`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la facture",
        variant: "destructive"
      });
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none">
          <div className="no-print mb-4 flex gap-2">
            <Button onClick={() => setShowPreview(false)} variant="outline">
              Retour à l'édition
            </Button>
            <Button onClick={generatePDF}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>

          <div className="bg-white print:shadow-none shadow-lg">
            <PrintableInvoiceHeader 
              invoiceNumber={invoiceData.invoiceNumber}
              date={invoiceData.date}
              time={invoiceData.time}
              dueDate={invoiceData.dueDate}
            />

            {/* Informations client */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Facturé à:</h3>
              <div className="bg-gray-50 print:bg-transparent p-4 rounded border print:border-gray-300">
                <p className="font-medium">{invoiceData.clientName}</p>
                <p className="text-gray-600">{invoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Tableau des articles */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="border border-gray-300 p-3 text-left">Description</th>
                    <th className="border border-gray-300 p-3 text-center">Qté</th>
                    <th className="border border-gray-300 p-3 text-right">Prix unitaire</th>
                    <th className="border border-gray-300 p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map(item => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-3">{item.description}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-3 text-right">{item.unitPrice.toFixed(2)} €</td>
                      <td className="border border-gray-300 p-3 text-right">{item.total.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{invoiceData.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({invoiceData.taxRate}%):</span>
                    <span>{invoiceData.taxAmount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{invoiceData.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoiceData.notes && (
              <div className="mb-8">
                <h3 className="font-bold mb-2">Notes:</h3>
                <p className="text-gray-600">{invoiceData.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Nouvelle Facture</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowPreview(true)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={saveInvoice}>
            <FileText className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <InvoiceHeader 
            invoiceNumber={invoiceData.invoiceNumber}
            date={invoiceData.date}
            time={invoiceData.time}
            dueDate={invoiceData.dueDate}
          />

          {/* Informations de la facture */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input 
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date"
                type="date"
                value={invoiceData.date}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time"
                type="time"
                value={invoiceData.time}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input 
                id="dueDate"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Sélection du client */}
          <div className="mb-6">
            <Label htmlFor="client">Client</Label>
            <Select onValueChange={selectClient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients && clients.length > 0 ? clients.map((client: any) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                )) : (
                  <SelectItem value="no-clients" disabled>
                    Aucun client disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {invoiceData.clientName && (
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p className="font-medium">{invoiceData.clientName}</p>
                <p className="text-sm text-gray-600">{invoiceData.clientAddress}</p>
              </div>
            )}
          </div>

          {/* Articles */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Articles</h3>
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un article
              </Button>
            </div>

            <div className="space-y-4">
              {invoiceData.items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label>Produit (optionnel)</Label>
                      <Select onValueChange={(value) => selectProduct(item.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products && products.length > 0 ? products.map((product: any) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} - {product.price}€
                            </SelectItem>
                          )) : (
                            <SelectItem value="no-products" disabled>
                              Aucun produit disponible
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Input 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description de l'article"
                      />
                    </div>
                    <div>
                      <Label>Quantité</Label>
                      <Input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>Prix unitaire</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.total.toFixed(2)} €</span>
                        <Button 
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Calculs et totaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea 
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes supplémentaires..."
                rows={4}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                <Input 
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span className="font-medium">{invoiceData.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA ({invoiceData.taxRate}%):</span>
                  <span className="font-medium">{invoiceData.taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{invoiceData.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}