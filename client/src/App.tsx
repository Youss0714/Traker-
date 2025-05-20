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
