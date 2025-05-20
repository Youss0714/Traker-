import { useLocation } from 'wouter';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  const [location, navigate] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Get title based on the current path
  const getTitle = () => {
    if (location === '/') return 'gYS';
    if (location === '/inventory') return 'Inventaire';
    if (location === '/clients') return 'Clients';
    if (location === '/sales') return 'Ventes';
    if (location === '/more') return 'Plus';
    if (location === '/add-sale') return 'Nouvelle Vente';
    if (location === '/add-product') return 'Nouveau Produit';
    if (location === '/add-client') return 'Nouveau Client';
    if (location === '/invoices') return 'Factures';
    if (location === '/catalog') return 'Catalogue';
    if (location === '/export') return 'Exportation';
    if (location === '/reports') return 'Rapports';
    if (location === '/settings') return 'Paramètres';
    if (location === '/profile') return 'Profil';
    if (location === '/sync') return 'Synchronisation';
    return 'gYS';
  };
  
  // Determine if we should show back button
  const showBackButton = location.includes('add-') || 
                        location === '/invoices' || 
                        location === '/catalog' || 
                        location === '/export' || 
                        location === '/reports' || 
                        location === '/settings' || 
                        location === '/profile' || 
                        location === '/sync';
  
  const handleSearch = () => {
    alert(`Recherche en cours pour: ${searchQuery}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };
  
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Synchronisation terminée avec succès!");
    }, 2000);
  };
  
  return (
    <header className="bg-[#1976D2] text-white shadow-md z-10">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <span 
              className="material-icons cursor-pointer" 
              onClick={() => navigate(-1)}
            >
              arrow_back
            </span>
          ) : (
            <span className="material-icons">menu</span>
          )}
          <h1 className="text-xl font-medium">{getTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Recherche */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <span className="material-icons cursor-pointer">search</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rechercher</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-2">
                <Input 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button type="submit" onClick={handleSearch}>
                  <span className="material-icons mr-2">search</span>
                  Rechercher
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Notifications */}
          <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
            <DialogTrigger asChild>
              <div className="relative">
                <span className="material-icons cursor-pointer">notifications</span>
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0" variant="destructive">3</Badge>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="material-icons text-amber-500 mr-2">warning</span>
                      <h4 className="font-medium">Stock faible</h4>
                    </div>
                    <span className="text-xs text-gray-500">Aujourd'hui</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Le produit "Smartphone XYZ" a un stock faible (5 restants).</p>
                </div>
                
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="material-icons text-green-600 mr-2">monetization_on</span>
                      <h4 className="font-medium">Nouvelle vente</h4>
                    </div>
                    <span className="text-xs text-gray-500">Hier</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Une nouvelle vente de 127,500 FCFA a été enregistrée.</p>
                </div>
                
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="material-icons text-blue-600 mr-2">person_add</span>
                      <h4 className="font-medium">Nouveau client</h4>
                    </div>
                    <span className="text-xs text-gray-500">Il y a 2 jours</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Le client "Mamadou Traoré" a été ajouté à la base de données.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Synchronisation */}
          <span 
            className={`material-icons cursor-pointer ${isSyncing ? 'animate-spin text-gray-300' : ''}`}
            onClick={handleSync}
          >
            {isSyncing ? 'sync' : 'sync'}
          </span>
        </div>
      </div>
    </header>
  );
}
