import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertClientSchema } from "@shared/schema";
import { Plus } from "lucide-react";
import { z } from "zod";

type ClientFormValues = z.infer<typeof insertClientSchema>;

interface QuickAddClientProps {
  onClientCreated?: (client: any) => void;
  trigger?: React.ReactNode;
}

export function QuickAddClient({ onClientCreated, trigger }: QuickAddClientProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      email: null,
      phone: null,
      address: null,
      type: "individual",
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (client: ClientFormValues) => {
      const response = await apiRequest('POST', '/api/clients', client);
      return response.json();
    },
    onSuccess: (newClient) => {
      toast({
        title: "Client ajouté",
        description: `Le client ${newClient.name} a été créé avec succès`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      
      if (onClientCreated) {
        onClientCreated(newClient);
      }
      
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le client",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ClientFormValues) => {
    createClientMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+226 70 00 00 00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de client</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="individual">Particulier</option>
                      <option value="business">Entreprise</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createClientMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createClientMutation.isPending}
              >
                {createClientMutation.isPending ? "Création..." : "Créer le client"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}