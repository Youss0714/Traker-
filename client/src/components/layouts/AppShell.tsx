import { ReactNode } from "react";
import { useMobileDevice } from "@/hooks/use-mobile";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isMobileDevice } = useMobileDevice();

  // Use mobile layout optimized for Android and small screens
  if (isMobileDevice) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  // Use desktop layout for larger screens
  return <DesktopLayout>{children}</DesktopLayout>;
}
