import { useState, useEffect } from 'react';
import { backupManager } from '@/lib/backup/BackupManager';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export function BackupStatus() {
  const [backupStatus, setBackupStatus] = useState(backupManager.getBackupStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mettre à jour le statut périodiquement
    const updateStatus = () => {
      setBackupStatus(backupManager.getBackupStatus());
    };

    const interval = setInterval(updateStatus, 30000); // Toutes les 30 secondes

    // Montrer l'indicateur après 10 secondes
    const timer = setTimeout(() => setIsVisible(true), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  const timeSinceLastBackup = backupStatus.lastBackupTime 
    ? Date.now() - backupStatus.lastBackupTime 
    : Infinity;

  const isRecentBackup = timeSinceLastBackup < 10 * 60 * 1000; // 10 minutes

  return (
    <Link href="/backup">
      <div className="fixed bottom-20 right-4 z-40 cursor-pointer">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-icons text-gray-600 text-lg">backup</span>
              <div 
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  backupStatus.isAutoBackupActive && isRecentBackup 
                    ? 'bg-green-500' 
                    : backupStatus.isAutoBackupActive 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
              />
            </div>
            
            <div className="hidden sm:block">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  backupStatus.isAutoBackupActive && isRecentBackup 
                    ? 'border-green-200 text-green-700' 
                    : backupStatus.isAutoBackupActive 
                    ? 'border-yellow-200 text-yellow-700' 
                    : 'border-red-200 text-red-700'
                }`}
              >
                {backupStatus.isAutoBackupActive && isRecentBackup 
                  ? 'Protégé' 
                  : backupStatus.isAutoBackupActive 
                  ? 'En cours' 
                  : 'Inactif'
                }
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}