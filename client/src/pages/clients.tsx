import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarInitials } from "@/components/ui/avatar-initials";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";

// Client item card component
const ClientItem = ({ client }: { client: any }) => {
  const clientTypeTag = {
    'regular': { label: 'Client régulier', className: 'bg-blue-100 text-blue-600 border-blue-200' },
    'new': { label: 'Nouveau client', className: 'bg-orange-100 text-orange-600 border-orange-200' },
    'vip': { label: 'Client VIP', className: 'bg-green-100 text-green-600 border-green-200' }
  }[client.type || 'regular'];

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center">
          <AvatarInitials name={client.name} type={client.type} />
          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="text-orange-800 font-medium">{client.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="material-icons text-white text-sm">call</span>
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="material-icons text-white text-sm">message</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-orange-600 bg-white px-2 py-1 rounded-full">
                {client.totalOrders} commandes • {formatCurrency(client.totalSpent)}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border ${clientTypeTag.className}`}>
                {clientTypeTag.label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Clients() {
  const { setActivePage } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  
  useEffect(() => {
    setActivePage('clients');
  }, [setActivePage]);
  
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['/api/clients'],
  });
  
  const categories = ["Tous", "Réguliers", "Nouveaux", "VIP"];
  
  const filteredClients = clients ? clients.filter((client: any) => {
    // Filter by search term
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (client.phone && client.phone.includes(searchTerm));
    
    // Filter by category
    let matchesCategory = true;
    if (selectedCategory === "Réguliers") {
      matchesCategory = client.type === "regular";
    } else if (selectedCategory === "Nouveaux") {
      matchesCategory = client.type === "new";
    } else if (selectedCategory === "VIP") {
      matchesCategory = client.type === "vip";
    }
    
    return matchesSearch && matchesCategory;
  }) : [];
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Clients</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <span className="material-icons text-[#757575] text-sm mr-1">filter_list</span>
              <span>Filtres</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <span className="material-icons text-[#757575] text-sm">sort</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
          <span className="material-icons text-[#757575]">search</span>
          <div className="ml-2 flex-1 h-5 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="flex overflow-x-auto pb-2 space-x-3 -mx-4 px-4">
          {categories.map((category, index) => (
            <div key={index} className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"></div>
          ))}
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[80px]">
              <CardContent className="p-4 flex items-center">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h3 className="text-red-700 font-medium">Erreur de chargement</h3>
            <p className="text-sm text-red-600 mt-1">
              Impossible de charger les données des clients.
            </p>
            <Button className="mt-4 bg-red-600" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Clients</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <span className="material-icons text-[#757575] text-sm mr-1">filter_list</span>
            <span>Filtres</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <span className="material-icons text-[#757575] text-sm">sort</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm flex items-center px-3 py-2">
        <span className="material-icons text-[#757575]">search</span>
        <Input 
          type="text" 
          placeholder="Rechercher un client..." 
          className="ml-2 flex-1 border-none shadow-none focus-visible:ring-0 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Client Categories */}
      <div className="flex overflow-x-auto pb-2 space-x-3 -mx-4 px-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`px-4 py-2 text-sm rounded-full shadow-sm whitespace-nowrap ${
              selectedCategory === category 
                ? "bg-[#1976D2] text-white" 
                : "bg-white text-[#212121]"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client: any) => (
            <ClientItem key={client.id} client={client} />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <span className="material-icons text-3xl text-[#757575] mb-2">people</span>
              <h3 className="text-[#212121] font-medium">Aucun client trouvé</h3>
              <p className="text-sm text-[#757575] mt-1">
                Aucun client ne correspond à vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
