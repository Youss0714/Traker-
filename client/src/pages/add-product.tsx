import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Product } from "@shared/schema";

// Define schema for product form
const productSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  price: z.coerce.number().positive({ message: "Le prix doit être positif" }),
  quantity: z.coerce.number().int({ message: "La quantité doit être un nombre entier" }).nonnegative({ message: "La quantité doit être positive ou zéro" }),
  threshold: z.coerce.number().int({ message: "Le seuil doit être un nombre entier" }).nonnegative({ message: "Le seuil doit être positif ou zéro" }),
  isActive: z.boolean().default(true)
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProduct() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  
  // Fetch product data if editing
  const { data: product } = useQuery<Product>({
    queryKey: ['/api/products', editId],
    enabled: isEditing && !!editId,
  });
  
  // Define form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
      threshold: 5,
      isActive: true
    }
  });
  
  // Update form when product data is loaded
  useEffect(() => {
    if (product && isEditing) {
      form.reset({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        threshold: product.threshold || 5,
        isActive: product.isActive ?? true
      });
    }
  }, [product, isEditing, form]);
  
  // Categories list
  const categories = ["Électronique", "Vêtements", "Alimentaire", "Mobilier", "Papeterie", "Autres"];
  
  // Product mutation (create or update)
  const productMutation = useMutation({
    mutationFn: async (product: ProductFormValues) => {
      if (isEditing && editId) {
        const response = await apiRequest('PATCH', `/api/products/${editId}`, product);
        return response.json();
      } else {
        const response = await apiRequest('POST', '/api/products', product);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Produit modifié" : "Produit ajouté",
        description: isEditing ? "Le produit a été modifié avec succès" : "Le produit a été ajouté avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      navigate('/catalog');
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: ProductFormValues) => {
    productMutation.mutate(data);
  };
  
  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-[#212121]">
          {isEditing ? "Modifier le produit" : "Ajouter un nouveau produit"}
        </h2>
      </div>
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
        <CardContent className="pt-6 bg-gradient-to-r from-purple-100 to-pink-100 m-6 rounded-lg border border-purple-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description du produit (optionnel)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (FCFA)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité en stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seuil d'alerte</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Actif</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Produit disponible à la vente
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-3">
                {isEditing && (
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate('/catalog')}
                  >
                    <span className="material-icons mr-2">cancel</span>
                    Annuler
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className={`${isEditing ? 'flex-1' : 'w-full'} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg`}
                  disabled={productMutation.isPending}
                >
                  <span className="material-icons mr-2">save</span>
                  {productMutation.isPending ? "Enregistrement..." : (isEditing ? "Modifier le produit" : "Enregistrer le produit")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
