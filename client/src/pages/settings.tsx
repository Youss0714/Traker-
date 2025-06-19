import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { TaxRateSelector } from "@/components/ui/tax-rate-selector";
import { Company, InsertCompany } from "@shared/schema";
import { useTheme } from "@/components/theme-provider";

export default function Settings() {
  const { setActivePage } = useAppContext();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [companyData, setCompanyData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  // Query company data
  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ['/api/company'],
  });

  // Effect to update form data when company data changes
  useEffect(() => {
    if (company) {
      setCompanyData({
        name: company.name || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
        description: company.description || ""
      });
    }
  }, [company]);

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async (data: Partial<InsertCompany>) => {
      const response = await apiRequest('PATCH', `/api/company/${company?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Informations mises à jour",
        description: "Les informations de l'entreprise ont été mises à jour avec succès",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/company'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateCompanyMutation.mutate(companyData);
  };

  const handleCancel = () => {
    if (company) {
      setCompanyData({
        name: company.name || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
        description: company.description || ""
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Paramètres généraux</h2>
      </div>

      <Card className="border-blue-200 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-4">Préférences d'affichage</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border border-indigo-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">dark_mode</span>
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="text-sm font-medium text-indigo-800">Mode sombre</Label>
                    <p className="text-xs text-indigo-600">Activer le thème sombre pour l'application</p>
                  </div>
                </div>
                <Switch id="dark-mode" className="data-[state=checked]:bg-indigo-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">notifications</span>
                  </div>
                  <div>
                    <Label htmlFor="notifications" className="text-sm font-medium text-emerald-800">Notifications</Label>
                    <p className="text-xs text-emerald-600">Recevoir des notifications de l'application</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-700 font-medium">Activé</span>
                  <Switch id="notifications" defaultChecked className="data-[state=checked]:bg-emerald-500" />
                </div>
              </div>
              

              
              <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-300 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">language</span>
                  </div>
                  <div>
                    <Label htmlFor="language" className="text-sm font-medium text-blue-800">Langue</Label>
                    <p className="text-xs text-blue-600">Choisir la langue de l'interface</p>
                  </div>
                </div>
                <Select defaultValue="fr">
                  <SelectTrigger id="language" className="border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">🇫🇷</span>
                        <span>Français</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">🇺🇸</span>
                        <span>English</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-orange-800">Informations de l'entreprise</h3>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <span className="material-icons text-sm mr-1">edit</span>
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    className="border-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={updateCompanyMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {updateCompanyMutation.isPending ? "..." : "Enregistrer"}
                  </Button>
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-center py-4 text-orange-600">Chargement...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name" className="text-sm font-medium text-orange-800">Nom de l'entreprise</Label>
                    {isEditing ? (
                      <Input
                        id="company-name"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        className="mt-1 border-orange-300 focus:border-orange-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-white rounded border border-orange-200 text-sm">
                        {companyData.name || "Non défini"}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="company-email" className="text-sm font-medium text-orange-800">Email</Label>
                    {isEditing ? (
                      <Input
                        id="company-email"
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                        className="mt-1 border-orange-300 focus:border-orange-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-white rounded border border-orange-200 text-sm">
                        {companyData.email || "Non défini"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-phone" className="text-sm font-medium text-orange-800">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="company-phone"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        className="mt-1 border-orange-300 focus:border-orange-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-white rounded border border-orange-200 text-sm">
                        {companyData.phone || "Non défini"}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="company-website" className="text-sm font-medium text-orange-800">Site web</Label>
                    {isEditing ? (
                      <Input
                        id="company-website"
                        value={companyData.website}
                        onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                        placeholder="https://..."
                        className="mt-1 border-orange-300 focus:border-orange-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-white rounded border border-orange-200 text-sm">
                        {companyData.website || "Non défini"}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="company-address" className="text-sm font-medium text-orange-800">Adresse</Label>
                  {isEditing ? (
                    <Textarea
                      id="company-address"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      rows={2}
                      className="mt-1 border-orange-300 focus:border-orange-500"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-white rounded border border-orange-200 text-sm min-h-[60px]">
                      {companyData.address || "Non définie"}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="company-description" className="text-sm font-medium text-orange-800">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="company-description"
                      value={companyData.description}
                      onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                      rows={3}
                      placeholder="Description de votre entreprise..."
                      className="mt-1 border-orange-300 focus:border-orange-500"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-white rounded border border-orange-200 text-sm min-h-[80px]">
                      {companyData.description || "Non définie"}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-300 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="material-icons text-white text-lg">backup</span>
                    </div>
                    <div>
                      <Label htmlFor="auto-backup" className="text-sm font-medium text-orange-800">Sauvegarde automatique</Label>
                      <p className="text-xs text-orange-600">Sauvegarder vos données automatiquement</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-orange-700 font-medium bg-orange-200 px-2 py-1 rounded-full">Activé</span>
                    <Switch id="auto-backup" defaultChecked className="data-[state=checked]:bg-orange-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <CurrencySelector />

      {/* Tax Rate Settings */}
      <TaxRateSelector />
    </div>
  );
}