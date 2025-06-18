import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { PWAInstaller } from '@/components/PWAInstaller';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Ajuster la hauteur de la fenêtre pour Android
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const navigationItems = [
    { icon: 'dashboard', label: 'Tableau de bord', href: '/', key: 'dashboard' },
    { icon: 'inventory_2', label: 'Inventaire', href: '/inventory', key: 'inventory' },
    { icon: 'shopping_cart', label: 'Ventes', href: '/sales', key: 'sales' },
    { icon: 'people', label: 'Clients', href: '/clients', key: 'clients' },
    { icon: 'category', label: 'Catégories', href: '/categories', key: 'categories' },
    { icon: 'library_books', label: 'Catalogue', href: '/catalog', key: 'catalog' },
    { icon: 'receipt_long', label: 'Factures', href: '/invoices', key: 'invoices' },
    { icon: 'assessment', label: 'Rapports', href: '/reports', key: 'reports' },
  ];

  const quickActions = [
    { icon: 'add_shopping_cart', label: 'Nouvelle vente', href: '/add-sale', color: 'bg-blue-500' },
    { icon: 'add_box', label: 'Nouveau produit', href: '/add-product', color: 'bg-green-500' },
    { icon: 'person_add', label: 'Nouveau client', href: '/add-client', color: 'bg-purple-500' },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => location === item.href);
    return currentItem?.label || 'gYS';
  };

  const isCurrentPage = (href: string) => location === href;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header mobile */}
      <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <span className="material-icons">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-left">gYS - Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              {/* Navigation principale */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isCurrentPage(item.href)
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                        <span className="material-icons mr-3 text-xl">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Actions rapides */}
              <div className="p-4 border-t">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Actions rapides
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className={`p-1 rounded-md ${action.color} mr-3`}>
                          <span className="material-icons text-white text-sm">
                            {action.icon}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold text-gray-900 truncate">
          {getCurrentPageTitle()}
        </h1>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 relative">
            <span className="material-icons">notifications</span>
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 border-0">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Navigation bottom pour mobile */}
      <nav className="mobile-nav bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around items-center">
          {navigationItems.slice(0, 5).map((item) => (
            <Link key={item.key} href={item.href}>
              <div className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isCurrentPage(item.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                <span className="material-icons text-xl mb-1">
                  {item.icon}
                </span>
                <span className="text-xs font-medium truncate max-w-[60px]">
                  {item.label.split(' ')[0]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* PWA Installer */}
      <PWAInstaller />
    </div>
  );
}