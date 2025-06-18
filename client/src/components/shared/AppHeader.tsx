import { useLocation } from 'wouter';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";
import { CurrencyDropdown } from "@/components/ui/currency-dropdown";
import { Logo } from "@/components/ui/logo";

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
    <header className="bg-[#1976D2] text-white shadow-md z-40 relative">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <span 
              className="material-icons cursor-pointer" 
              onClick={() => window.history.back()}
            >
              arrow_back
            </span>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <span className="material-icons cursor-pointer">menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="mb-6">
                  <Logo variant="full" size="md" />
                </SheetHeader>
                <div className="flex flex-col space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="material-icons text-white">person</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Youssouf Sawadogo</p>
                        <p className="text-sm text-blue-600">Administrateur</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/')}
                      >
                        <span className="material-icons mr-2">dashboard</span>
                        Tableau de bord
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/inventory')}
                      >
                        <span className="material-icons mr-2">inventory_2</span>
                        Inventaire
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/clients')}
                      >
                        <span className="material-icons mr-2">people</span>
                        Clients
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/sales')}
                      >
                        <span className="material-icons mr-2">point_of_sale</span>
                        Ventes
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/invoices')}
                      >
                        <span className="material-icons mr-2">receipt</span>
                        Factures
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/reports')}
                      >
                        <span className="material-icons mr-2">bar_chart</span>
                        Rapports
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/categories')}
                      >
                        <span className="material-icons mr-2">category</span>
                        Catégories
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="border-t pt-4">
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/settings')}
                      >
                        <span className="material-icons mr-2">settings</span>
                        Paramètres
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/profile')}
                      >
                        <span className="material-icons mr-2">person</span>
                        Profil
                      </Button>
                    </SheetClose>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <span className="material-icons mr-2">logout</span>
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          {location === '/' ? (
            <Logo variant="text" />
          ) : (
            <h1 className="text-xl font-medium">{getTitle()}</h1>
          )}
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
              <button className="relative cursor-pointer hover:scale-110 transition-transform bg-transparent border-none p-0">
                <span className="material-icons text-white">notifications</span>
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 border-none shadow-lg animate-pulse">3</Badge>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-50 to-gray-100 border-gray-200 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notifications
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="material-icons text-white text-sm">warning</span>
                      </div>
                      <h4 className="font-medium text-amber-800">Stock faible</h4>
                    </div>
                    <span className="text-xs text-amber-600 font-medium">Aujourd'hui</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-2 ml-11">Le produit "Smartphone XYZ" a un stock faible (5 restants).</p>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="material-icons text-white text-sm">monetization_on</span>
                      </div>
                      <h4 className="font-medium text-emerald-800">Nouvelle vente</h4>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">Hier</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2 ml-11">Une nouvelle vente de 127,500 FCFA a été enregistrée.</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                        <span className="material-icons text-white text-sm">person_add</span>
                      </div>
                      <h4 className="font-medium text-blue-800">Nouveau client</h4>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">Il y a 2 jours</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2 ml-11">Le client "Mamadou Traoré" a été ajouté à la base de données.</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setShowNotifications(false)}
                >
                  <span className="material-icons text-sm mr-2">done_all</span>
                  Marquer tout comme lu
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Currency Selector */}
          <CurrencyDropdown />
          
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
