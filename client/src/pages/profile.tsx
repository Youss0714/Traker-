import { useEffect } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Profil</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-20 w-20 mb-3">
              <div className="bg-[#1976D2] text-white h-full w-full flex items-center justify-center text-2xl font-medium">
                YS
              </div>
            </Avatar>
            <h3 className="text-lg font-medium">Youssouf Sawadogo</h3>
            <p className="text-sm text-gray-500">Administrateur</p>
            <Button variant="outline" className="mt-3">Changer la photo</Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input id="fullName" defaultValue="Youssouf Sawadogo" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input id="username" defaultValue="admin" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="contact@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+226 70 00 00 00" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" defaultValue="Ouagadougou, Burkina Faso" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input id="company" defaultValue="gYS" />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}