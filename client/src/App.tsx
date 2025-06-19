import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import AppShell from "./components/layouts/AppShell";
import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Clients from "@/pages/clients";
import Sales from "@/pages/sales";
import More from "@/pages/more";
import AddSale from "@/pages/add-sale";
import AddProduct from "@/pages/add-product";
import AddClient from "@/pages/add-client";
import Invoices from "@/pages/invoices";
import Catalog from "@/pages/catalog";
import Export from "@/pages/export";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Sync from "@/pages/sync";
import Categories from "@/pages/categories";
import Help from "@/pages/help";
import Backup from "@/pages/backup";
import { AppProvider } from "./lib/context/AppContext";
import { SplashScreen } from "@/components/SplashScreen";
import { CompanySetup } from "@/components/CompanySetup";
import { useQuery } from "@tanstack/react-query";
import { RecoveryDialog, useRecoveryDetection } from "@/components/backup/RecoveryDialog";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/clients" component={Clients} />
      <Route path="/sales" component={Sales} />
      <Route path="/more" component={More} />
      <Route path="/add-sale" component={AddSale} />
      <Route path="/add-product" component={AddProduct} />
      <Route path="/add-client" component={AddClient} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/export" component={Export} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route path="/profile" component={Profile} />
      <Route path="/sync" component={Sync} />
      <Route path="/categories" component={Categories} />
      <Route path="/help" component={Help} />
      <Route path="/backup" component={Backup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const { recoveryBackup, showRecoveryDialog, closeRecoveryDialog } = useRecoveryDetection();

  const { data: companyStatus, isLoading } = useQuery<{ isSetup: boolean; company?: any }>({
    queryKey: ['/api/company/status'],
    enabled: !showSplash,
  });

  useEffect(() => {
    if (!showSplash && companyStatus && 'isSetup' in companyStatus) {
      setNeedsSetup(!companyStatus.isSetup);
    }
  }, [showSplash, companyStatus]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isLoading || needsSetup === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (needsSetup) {
    return <CompanySetup onComplete={() => setNeedsSetup(false)} />;
  }

  return (
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Router />
        </AppShell>
        
        {/* Dialogue de récupération automatique */}
        {recoveryBackup && (
          <RecoveryDialog
            isOpen={showRecoveryDialog}
            onClose={closeRecoveryDialog}
            recoveryBackup={recoveryBackup}
          />
        )}
      </TooltipProvider>
    </AppProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="gys-ui-theme">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
