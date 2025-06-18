import { useState, useEffect } from 'react';
import { MobileButton } from '@/components/ui/mobile-card';
import { useIsAndroid } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isAndroid = useIsAndroid();

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppMode = (window.navigator as any).standalone === true;
      setIsInstalled(isInStandaloneMode || isInWebAppMode);
    };

    checkIfInstalled();

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Afficher le prompt d'installation seulement sur Android après un délai
      if (isAndroid && !isInstalled) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000);
      }
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isAndroid, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Ne plus afficher pendant cette session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Ne pas afficher si déjà installé ou si déjà refusé dans cette session
  if (isInstalled || !showInstallPrompt || !deferredPrompt || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="material-icons text-white text-xl">get_app</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Installer gYS</h3>
            <p className="text-sm text-gray-600">Accès rapide depuis votre écran d'accueil</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="material-icons text-lg">close</span>
        </button>
      </div>
      
      <div className="flex gap-2">
        <MobileButton
          onClick={handleInstallClick}
          variant="primary"
          size="sm"
          className="flex-1"
          icon={<span className="material-icons text-sm">download</span>}
        >
          Installer
        </MobileButton>
        <MobileButton
          onClick={handleDismiss}
          variant="outline"
          size="sm"
          className="px-3"
        >
          Plus tard
        </MobileButton>
      </div>
    </div>
  );
}