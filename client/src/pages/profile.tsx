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

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 m-4 rounded-lg border border-indigo-200">
          <div className="flex flex-col items-center mb-6 p-6 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg border border-indigo-300">
            <Avatar className="h-20 w-20 mb-3 border-4 border-white shadow-lg">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-full w-full flex items-center justify-center text-2xl font-medium">
                YS
              </div>
            </Avatar>
            <h3 className="text-lg font-medium text-indigo-800">Youssouf Sawadogo</h3>
            <p className="text-sm text-indigo-600">Administrateur</p>
            <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg">
              <span className="material-icons text-sm mr-2">photo_camera</span>
              Changer la photo
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-indigo-700 font-medium">Nom complet</Label>
                <Input id="fullName" defaultValue="Youssouf Sawadogo" className="border-indigo-200 focus:border-indigo-400" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-indigo-700 font-medium">Nom d'utilisateur</Label>
                <Input id="username" defaultValue="admin" className="border-indigo-200 focus:border-indigo-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-indigo-700 font-medium">Email</Label>
                <Input id="email" type="email" defaultValue="contact@example.com" className="border-indigo-200 focus:border-indigo-400" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-indigo-700 font-medium">Téléphone</Label>
                <Input id="phone" defaultValue="+226 70 00 00 00" className="border-indigo-200 focus:border-indigo-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-indigo-700 font-medium">Adresse</Label>
              <Input id="address" defaultValue="Ouagadougou, Burkina Faso" className="border-indigo-200 focus:border-indigo-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-indigo-700 font-medium">Entreprise</Label>
              <Input id="company" defaultValue="gYS" className="border-indigo-200 focus:border-indigo-400" />
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