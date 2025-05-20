import { ReactNode } from "react";
import MobileNavigation from "@/components/shared/MobileNavigation";
import AppHeader from "@/components/shared/AppHeader";
import FloatingActionButton from "@/components/shared/FloatingActionButton";
import { useAppContext } from "@/lib/context/AppContext";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { activePage } = useAppContext();

  return (
    <div className="flex flex-col h-screen">
      {/* App Bar */}
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16" id="main-content">
        {children}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}
