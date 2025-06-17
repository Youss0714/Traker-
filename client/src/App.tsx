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
import { AppProvider } from "./lib/context/AppContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <AppShell>
            <Router />
          </AppShell>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
