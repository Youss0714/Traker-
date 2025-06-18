import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarInitials } from "@/components/ui/avatar-initials";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  totalSpent: number;
  lastOrderDate: string;
}

// Client item card component
const ClientItem = ({ client }: { client: Client }) => {
  const typeMap: Record<string, { label: string; className: string }> = {
    'regular': { label: 'Client régulier', className: 'bg-blue-100 text-blue-600 border-blue-200' },
    'new': { label: 'Nouveau client', className: 'bg-orange-100 text-orange-600 border-orange-200' },
    'vip': { label: 'Client VIP', className: 'bg-green-100 text-green-600 border-green-200' }
  };
  const clientTypeTag = typeMap[client.type] || typeMap['regular'];

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="mr-3">
            <AvatarInitials 
              name={client.name} 
              type={client.type as "regular" | "new" | "vip" | undefined}
              size="md" 
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-orange-800">{client.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${clientTypeTag.className}`}>
                {clientTypeTag.label}
              </span>
            </div>
            <p className="text-sm text-orange-600">{client.email}</p>
            <p className="text-sm text-orange-600">{client.phone}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-semibold text-orange-800">{formatCurrency(client.totalSpent)}</span>
              <span className="text-sm text-orange-600">Total dépensé</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md flex-1">
            <span className="material-icons text-sm mr-1">edit</span>
            Modifier
          </Button>
          <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
            <span className="material-icons text-sm">visibility</span>
          </Button>
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
  
  const filteredClients = Array.isArray(clients) ? clients.filter((client: Client) => {
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
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <span className="material-icons text-4xl text-gray-400 mb-2">error_outline</span>
          <p className="text-gray-500">Erreur lors du chargement des clients</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md" 
                  : "border-orange-300 text-orange-600 hover:bg-orange-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400 mb-2">people</span>
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        ) : (
          filteredClients.map((client: Client) => (
            <ClientItem key={client.id} client={client} />
          ))
        )}
      </div>
    </div>
  );
}