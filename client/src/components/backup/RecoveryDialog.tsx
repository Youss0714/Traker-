import { useState, useEffect } from 'react';
import { backupManager, BackupData } from '@/lib/backup/BackupManager';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecoveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recoveryBackup: BackupData;
}

export function RecoveryDialog({ isOpen, onClose, recoveryBackup }: RecoveryDialogProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const success = await backupManager.restoreFromBackup(recoveryBackup.timestamp);
      if (success) {
        toast({
          title: "Données récupérées",
          description: "Vos données ont été restaurées avec succès"
        });
        window.location.reload();
      } else {
        throw new Error('Échec de la récupération');
      }
    } catch (error) {
      toast({
        title: "Erreur de récupération",
        description: "Impossible de récupérer les données automatiquement",
        variant: "destructive"
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDismiss = () => {
    // Marquer comme vu pour ne plus afficher
    localStorage.setItem('recovery_dismissed', recoveryBackup.timestamp.toString());
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="material-icons text-orange-600 text-xl">warning</span>
            </div>
            <div>
              <AlertDialogTitle>Récupération des données</AlertDialogTitle>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Sauvegarde d'urgence trouvée
              </Badge>
            </div>
          </div>
          
          <AlertDialogDescription className="space-y-3">
            <p>
              Une sauvegarde d'urgence a été créée lors de votre dernière session. 
              Cela peut indiquer qu'une erreur s'est produite.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date de sauvegarde:</span>
                <span className="font-medium">
                  {new Date(recoveryBackup.timestamp).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Il y a:</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(recoveryBackup.timestamp), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                <div>Produits: {recoveryBackup.data.products.length}</div>
                <div>Clients: {recoveryBackup.data.clients.length}</div>
                <div>Ventes: {recoveryBackup.data.sales.length}</div>
              </div>
            </div>
            
            <p className="text-sm">
              Voulez-vous restaurer vos données depuis cette sauvegarde ?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={handleDismiss} disabled={isRestoring}>
            Continuer sans restaurer
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleRestore} 
            disabled={isRestoring}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isRestoring ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Restauration...
              </div>
            ) : (
              <>
                <span className="material-icons text-sm mr-1">restore</span>
                Restaurer
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useRecoveryDetection() {
  const [recoveryBackup, setRecoveryBackup] = useState<BackupData | null>(null);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);

  useEffect(() => {
    const checkForRecovery = async () => {
      try {
        const backup = await backupManager.checkForRecovery();
        if (backup) {
          const dismissed = localStorage.getItem('recovery_dismissed');
          if (dismissed !== backup.timestamp.toString()) {
            setRecoveryBackup(backup);
            setShowRecoveryDialog(true);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de récupération:', error);
      }
    };

    // Vérifier après un délai pour laisser l'app se charger
    const timer = setTimeout(checkForRecovery, 2000);
    return () => clearTimeout(timer);
  }, []);

  const closeRecoveryDialog = () => {
    setShowRecoveryDialog(false);
    setRecoveryBackup(null);
  };

  return {
    recoveryBackup,
    showRecoveryDialog,
    closeRecoveryDialog
  };
}