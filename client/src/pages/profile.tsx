import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { setActivePage } = useAppContext();
  
  const { data: company, isLoading } = useQuery({
    queryKey: ['/api/company'],
  });
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Profil de l'entreprise</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Profil de l'entreprise</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune information d'entreprise trouvée</p>
        </div>
      </div>
    );
  }

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Profil de l'entreprise</h2>
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 m-4 rounded-lg border border-indigo-200">
          <div className="flex flex-col items-center mb-6 p-6 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg border border-indigo-300">
            <Avatar className="h-20 w-20 mb-3 border-4 border-white shadow-lg">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-full w-full flex items-center justify-center text-2xl font-medium">
                {getCompanyInitials(company.name)}
              </div>
            </Avatar>
            <h3 className="text-lg font-medium text-indigo-800">{company.name}</h3>
            <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg">
              <span className="material-icons text-sm mr-2">photo_camera</span>
              Changer le logo
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-indigo-700 font-medium">Nom de l'entreprise</Label>
                <Input id="companyName" defaultValue={company.name} className="border-indigo-200 focus:border-indigo-400" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="text-indigo-700 font-medium">Site web</Label>
                <Input id="website" defaultValue={company.website || ""} placeholder="https://..." className="border-indigo-200 focus:border-indigo-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-indigo-700 font-medium">Email</Label>
                <Input id="email" type="email" defaultValue={company.email} className="border-indigo-200 focus:border-indigo-400" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-indigo-700 font-medium">Téléphone</Label>
                <Input id="phone" defaultValue={company.phone} className="border-indigo-200 focus:border-indigo-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-indigo-700 font-medium">Adresse</Label>
              <Input id="address" defaultValue={company.address} className="border-indigo-200 focus:border-indigo-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-indigo-700 font-medium">Description</Label>
              <Input id="description" defaultValue={company.description || ""} placeholder="Description de l'entreprise..." className="border-indigo-200 focus:border-indigo-400" />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg">
                <span className="material-icons text-sm mr-2">save</span>
                Enregistrer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}