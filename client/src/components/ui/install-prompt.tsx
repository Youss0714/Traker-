import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Vérifier si l'app est déjà installée
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  if (isInstalled) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 text-lg">
            Application installée
          </CardTitle>
          <CardDescription className="text-green-700">
            gYS est maintenant installé sur votre ordinateur comme application native.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isInstallable) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-800 text-lg">
            Installation disponible
          </CardTitle>
          <CardDescription className="text-blue-700">
            Vous pouvez installer gYS directement depuis votre navigateur (Chrome, Edge, Firefox).
            Recherchez l'icône d'installation dans la barre d'adresse.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800">
          Installer gYS sur votre ordinateur
        </CardTitle>
        <CardDescription className="text-blue-700">
          Installez l'application pour un accès rapide et une expérience native sur votre bureau.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleInstallClick}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <span className="material-icons mr-2">download</span>
          Installer l'application
        </Button>
        <p className="text-xs text-blue-600 mt-2 text-center">
          Fonctionne hors ligne • Démarrage rapide • Notifications
        </p>
      </CardContent>
    </Card>
  );
}