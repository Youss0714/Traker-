import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";

type ActivePage = 'dashboard' | 'inventory' | 'clients' | 'sales' | 'more' | 'categories';

interface AppContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  
  // Set initial active page based on current location
  const getInitialPage = (): ActivePage => {
    if (location === '/') return 'dashboard';
    if (location === '/inventory') return 'inventory';
    if (location === '/clients') return 'clients';
    if (location === '/sales') return 'sales';
    if (location === '/more') return 'more';
    return 'dashboard';
  };
  
  const [activePage, setActivePage] = useState<ActivePage>(getInitialPage());

  return (
    <AppContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
