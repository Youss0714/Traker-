import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const companySchema = z.object({
  name: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères'),
  email: z.string().email('Veuillez saisir une adresse email valide'),
  website: z.string().optional(),
  description: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanySetupProps {
  onComplete: () => void;
}

export function CompanySetup({ onComplete }: CompanySetupProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      description: '',
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      const response = await fetch('/api/company/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to setup company');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Configuration terminée',
        description: 'Les informations de votre entreprise ont été enregistrées avec succès.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/company/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/company'] });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la configuration.',
        variant: 'destructive',
      });
      console.error('Setup error:', error);
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    setupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="text-purple-600 w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bienvenue dans gYS
          </CardTitle>
          <CardDescription className="text-gray-600">
            Configurez les informations de votre entreprise pour commencer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'entreprise *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ex: Société Ivoirienne de Commerce"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              

            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Textarea
                id="address"
                {...form.register('address')}
                placeholder="Ex: Cocody Angré 7ème Tranche, Abidjan"
                rows={2}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="Ex: +225 07 45 78 32"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="Ex: contact@societe-ci.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web (optionnel)</Label>
              <Input
                id="website"
                {...form.register('website')}
                placeholder="Ex: https://societe-ci.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Décrivez brièvement votre activité..."
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={setupMutation.isPending}
            >
              {setupMutation.isPending ? 'Configuration en cours...' : 'Configurer mon entreprise'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}