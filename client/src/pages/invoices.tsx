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
import { Plus, Trash2, FileText, Download, Eye, List, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  const queryClient = useQueryClient();
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
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

  // Fetch invoices data
  const { data: invoices } = useQuery<any[]>({
    queryKey: ['/api/invoices'],
  });

  // Fetch sales data to display as fallback invoices
  const { data: sales } = useQuery<any[]>({
    queryKey: ['/api/sales'],
  });

  // Mutation pour créer une facture
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoicePayload: any) => {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoicePayload),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la facture');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Facture sauvegardée avec succès",
      });
      setViewMode('list');
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la facture",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    setActivePage('sales');
  }, [setActivePage]);

  useEffect(() => {
    calculateTotals();
  }, [invoiceData.items, invoiceData.taxRate]);

  const calculateTotals = () => {
    if (!Array.isArray(invoiceData.items)) {
      console.warn('invoiceData.items is not an array:', invoiceData.items);
      return;
    }
    
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
    // Préparer les données de la facture pour l'API
    const invoicePayload = {
      invoiceNumber: invoiceData.invoiceNumber,
      clientId: invoiceData.clientId || null,
      clientName: invoiceData.clientName,
      clientAddress: invoiceData.clientAddress || null,
      status: "draft",
      subtotal: invoiceData.subtotal,
      taxRate: invoiceData.taxRate,
      taxAmount: invoiceData.taxAmount,
      total: invoiceData.total,
      issueDate: new Date(invoiceData.date).toISOString(),
      dueDate: new Date(invoiceData.dueDate).toISOString(),
      notes: invoiceData.notes || null,
      items: invoiceData.items
    };

    createInvoiceMutation.mutate(invoicePayload);
  };

  const printInvoice = (sale: any) => {
    // Create a temporary invoice data from sale
    const tempInvoiceData: InvoiceData = {
      clientId: sale.clientId || 0,
      clientName: sale.clientName || sale.client || "Client",
      clientAddress: sale.clientAddress || "",
      invoiceNumber: sale.invoiceNumber || `INV-${sale.id}`,
      date: sale.date || new Date().toISOString().split('T')[0],
      time: sale.time || new Date().toTimeString().slice(0, 5),
      dueDate: sale.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: Array.isArray(sale.items) ? sale.items : [
        {
          id: "1",
          description: sale.description || "Produit/Service",
          quantity: sale.quantity || 1,
          unitPrice: sale.total || 0,
          total: sale.total || 0
        }
      ],
      notes: sale.notes || "",
      subtotal: sale.total || 0,
      taxRate: 19.25,
      taxAmount: 0,
      total: sale.total || 0
    };

    // Set the data and show preview
    setInvoiceData(tempInvoiceData);
    setShowPreview(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const createNewInvoice = () => {
    setViewMode('create');
    // Reset invoice data
    setInvoiceData({
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
  };

  // Invoice List View Component
  const InvoiceListView = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Liste des factures</h2>
        <Button onClick={createNewInvoice} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Factures existantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(invoices && invoices.length > 0) || (sales && sales.length > 0) ? (
            <div className="space-y-4">
              {/* Afficher d'abord les vraies factures */}
              {invoices && invoices.map((invoice: any) => (
                <Card key={invoice.id} className="bg-white shadow-sm border border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">
                            {invoice.invoiceNumber}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {invoice.status === 'draft' ? 'Brouillon' : 
                             invoice.status === 'sent' ? 'Envoyée' : 
                             invoice.status === 'paid' ? 'Payée' : invoice.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Client: {invoice.clientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('fr-FR') : 'Date inconnue'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-blue-800">
                            {formatCurrency(invoice.total || 0)}
                          </p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printInvoice(invoice)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Printer className="w-4 h-4 mr-1" />
                            Imprimer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setInvoiceData({
                                ...invoiceData,
                                invoiceNumber: invoice.invoiceNumber,
                                clientName: invoice.clientName,
                                clientAddress: invoice.clientAddress || "",
                                total: invoice.total || 0,
                                items: Array.isArray(invoice.items) ? invoice.items : []
                              });
                              setShowPreview(true);
                            }}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Afficher les ventes comme factures de secours si pas de vraies factures */}
              {(!invoices || invoices.length === 0) && sales && sales.map((sale: any) => (
                <Card key={sale.id} className="bg-white shadow-sm border border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">
                            {sale.invoiceNumber || `INV-${sale.id}`}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {sale.status || 'Payé'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Client: {sale.clientName || sale.client || 'Client inconnu'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {sale.date ? new Date(sale.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-blue-800">
                            {formatCurrency(sale.total || 0)}
                          </p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printInvoice(sale)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Printer className="w-4 h-4 mr-1" />
                            Imprimer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setInvoiceData({
                                ...invoiceData,
                                invoiceNumber: sale.invoiceNumber || `INV-${sale.id}`,
                                clientName: sale.clientName || sale.client || "",
                                total: sale.total || 0
                              });
                              setShowPreview(true);
                            }}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucune facture trouvée</p>
              <Button onClick={createNewInvoice} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Créer votre première facture
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (showPreview) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none printable-invoice">
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
                  {Array.isArray(invoiceData.items) && invoiceData.items.map(item => (
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

  // Show list view by default, create view when requested
  if (viewMode === 'list') {
    return <InvoiceListView />;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setViewMode('list')} 
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <List className="w-4 h-4 mr-2" />
            Liste des factures
          </Button>
          <h2 className="text-lg font-medium text-[#212121]">Nouvelle Facture</h2>
        </div>
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
              {Array.isArray(invoiceData.items) && invoiceData.items.map((item) => (
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