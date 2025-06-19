import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useTranslation } from "@/hooks/useTranslation";

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const { activePage } = useAppContext();
  const [location] = useLocation();
  const { t } = useTranslation();

  const navigationItems = [
    { icon: "dashboard", label: t('dashboard'), href: "/", key: "dashboard" },
    { icon: "inventory_2", label: t('inventory'), href: "/inventory", key: "inventory" },
    { icon: "shopping_cart", label: t('sales'), href: "/sales", key: "sales" },
    { icon: "people", label: t('clients'), href: "/clients", key: "clients" },
    { icon: "category", label: t('categories'), href: "/categories", key: "categories" },
    { icon: "library_books", label: t('catalog'), href: "/catalog", key: "catalog" },
    { icon: "receipt_long", label: t('invoices'), href: "/invoices", key: "invoices" },
    { icon: "assessment", label: t('reports'), href: "/reports", key: "reports" },
    { icon: "file_download", label: t('export'), href: "/export", key: "export" },
    { icon: "sync", label: t('sync'), href: "/sync", key: "sync" },
    { icon: "settings", label: t('settings'), href: "/settings", key: "settings" },
    { icon: "account_circle", label: t('profile'), href: "/profile", key: "profile" },
    { icon: "help_outline", label: t('help'), href: "/help", key: "help" },
  ];

  const quickActions = [
    { icon: "add_shopping_cart", label: t('newSale'), href: "/add-sale", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: "person_add", label: t('newClient'), href: "/add-client", color: "bg-green-600 hover:bg-green-700" },
    { icon: "add_box", label: t('newProduct'), href: "/add-product", color: "bg-purple-600 hover:bg-purple-700" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <Logo variant="full" size="lg" />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('quickActions')}</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Button 
                  className={`w-full justify-start ${action.color} text-white`}
                  size="sm"
                >
                  <span className="material-icons mr-2 text-lg">{action.icon}</span>
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location === item.href || activePage === item.key;
              return (
                <Link key={item.href} to={item.href}>
                  <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}>
                    <span className="material-icons mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">YS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Youssouf Sawadogo</p>
              <p className="text-xs text-gray-500 truncate">Administrateur</p>
            </div>
            <Button variant="ghost" size="sm">
              <span className="material-icons text-lg">logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => location === item.href || activePage === item.key)?.label || 'Tableau de bord'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <span className="material-icons mr-2">notifications</span>
                Notifications
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}