import { useState, useEffect } from 'react';
import { backupManager, BackupData } from '@/lib/backup/BackupManager';
import { MobileCard, MobileButton } from '@/components/ui/mobile-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';

interface BackupPanelProps {
  className?: string;
}

export default function BackupPanel({ className }: BackupPanelProps) {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState(backupManager.getBackupStatus());
  const { toast } = useToast();

  // Query data for exports
  const { data: products } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  const { data: sales } = useQuery<any[]>({
    queryKey: ['/api/sales'],
  });

  useEffect(() => {
    loadBackups();
    
    // Mettre à jour le statut périodiquement
    const interval = setInterval(() => {
      setBackupStatus(backupManager.getBackupStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadBackups = async () => {
    try {
      const allBackups = await backupManager.getAllBackups();
      setBackups(allBackups);
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const success = await backupManager.createBackup('manual');
      if (success) {
        toast({
          title: "Sauvegarde créée",
          description: "Vos données ont été sauvegardées avec succès"
        });
        await loadBackups();
        setBackupStatus(backupManager.getBackupStatus());
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de créer la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (timestamp: number) => {
    if (!confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Cela remplacera toutes les données actuelles.')) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await backupManager.restoreFromBackup(timestamp);
      if (success) {
        toast({
          title: "Données restaurées",
          description: "La sauvegarde a été restaurée avec succès"
        });
        window.location.reload(); // Recharger pour afficher les données restaurées
      } else {
        throw new Error('Échec de la restauration');
      }
    } catch (error) {
      toast({
        title: "Erreur de restauration",
        description: "Impossible de restaurer cette sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportBackup = (timestamp: number) => {
    try {
      backupManager.exportBackupAsFile(timestamp);
      toast({
        title: "Export réussi",
        description: "Le fichier de sauvegarde a été téléchargé"
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter cette sauvegarde",
        variant: "destructive"
      });
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const success = await backupManager.importBackupFromFile(file);
      if (success) {
        toast({
          title: "Import réussi",
          description: "La sauvegarde a été importée avec succès"
        });
        await loadBackups();
      } else {
        throw new Error('Échec de l\'import');
      }
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Le fichier de sauvegarde est invalide",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const getBackupTypeLabel = (type: string) => {
    switch (type) {
      case 'auto': return 'Automatique';
      case 'manual': return 'Manuelle';
      case 'recovery': return 'Récupération';
      default: return 'Inconnue';
    }
  };

  const getBackupTypeColor = (type: string) => {
    switch (type) {
      case 'auto': return 'bg-blue-100 text-blue-700';
      case 'manual': return 'bg-green-100 text-green-700';
      case 'recovery': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportProducts = () => {
    if (!products || products.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucun produit à exporter",
        variant: "destructive"
      });
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadJSON(products, `produits_${timestamp}.json`);
    
    toast({
      title: "Export réussi",
      description: `${products.length} produits exportés`
    });
  };

  const handleExportClients = () => {
    if (!clients || clients.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucun client à exporter",
        variant: "destructive"
      });
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadJSON(clients, `clients_${timestamp}.json`);
    
    toast({
      title: "Export réussi",
      description: `${clients.length} clients exportés`
    });
  };

  const handleExportSales = () => {
    if (!sales || sales.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucune vente à exporter",
        variant: "destructive"
      });
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadJSON(sales, `ventes_${timestamp}.json`);
    
    toast({
      title: "Export réussi",
      description: `${sales.length} ventes exportées`
    });
  };

  const handleExportAll = () => {
    const allData = {
      exportDate: new Date().toISOString(),
      products: products || [],
      clients: clients || [],
      sales: sales || [],
      summary: {
        totalProducts: (products || []).length,
        totalClients: (clients || []).length,
        totalSales: (sales || []).length
      }
    };

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadJSON(allData, `export_complet_${timestamp}.json`);
    
    toast({
      title: "Export complet réussi",
      description: "Toutes les données ont été exportées"
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Statut et contrôles */}
      <MobileCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Protection des données</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${backupStatus.isAutoBackupActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {backupStatus.isAutoBackupActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dernière sauvegarde:</span>
            <span className="font-medium">
              {backupStatus.lastBackupTime 
                ? formatDistanceToNow(new Date(backupStatus.lastBackupTime), { addSuffix: true, locale: fr })
                : 'Aucune'
              }
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sauvegardes disponibles:</span>
            <span className="font-medium">{backupStatus.backupCount}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <MobileButton
            onClick={handleCreateBackup}
            disabled={isLoading}
            icon={<span className="material-icons text-sm">save</span>}
            className="flex-1"
          >
            Sauvegarder maintenant
          </MobileButton>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
              disabled={isLoading}
            />
            <div className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-base min-h-[44px] font-medium rounded-lg transition-all duration-150 touch-manipulation active:scale-[0.98] border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span className="material-icons text-sm">upload</span>
              Importer
            </div>
          </label>
        </div>
      </MobileCard>

      {/* Export de données */}
      <MobileCard>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-icons text-blue-600">download</span>
          <h3 className="font-semibold text-gray-900">Exporter vos données</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Téléchargez vos données d'entreprise pour les conserver ou les utiliser dans d'autres applications.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <MobileButton
            onClick={handleExportProducts}
            disabled={isLoading}
            icon={<span className="material-icons text-sm">inventory</span>}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          >
            Exporter les produits
          </MobileButton>

          <MobileButton
            onClick={handleExportClients}
            disabled={isLoading}
            icon={<span className="material-icons text-sm">people</span>}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
          >
            Exporter les clients
          </MobileButton>

          <MobileButton
            onClick={handleExportSales}
            disabled={isLoading}
            icon={<span className="material-icons text-sm">receipt</span>}
            className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white"
          >
            Exporter les ventes
          </MobileButton>

          <MobileButton
            onClick={handleExportAll}
            disabled={isLoading}
            icon={<span className="material-icons text-sm">download</span>}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white"
          >
            Exporter tout
          </MobileButton>
        </div>
      </MobileCard>

      {/* Liste des sauvegardes */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-4">Historique des sauvegardes</h3>
        
        {backups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="material-icons text-4xl mb-2 block">backup</span>
            <p>Aucune sauvegarde disponible</p>
            <p className="text-sm">Créez votre première sauvegarde pour protéger vos données</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.timestamp} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(backup.timestamp).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(backup.timestamp), { addSuffix: true, locale: fr })}
                    </div>
                  </div>
                  <Badge className={getBackupTypeColor(backup.metadata.backupType)}>
                    {getBackupTypeLabel(backup.metadata.backupType)}
                  </Badge>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <div>Produits: {backup.data.products.length}</div>
                  <div>Clients: {backup.data.clients.length}</div>
                  <div>Ventes: {backup.data.sales.length}</div>
                  <div>Catégories: {backup.data.categories.length}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreBackup(backup.timestamp)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <span className="material-icons text-sm mr-1">restore</span>
                    Restaurer
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportBackup(backup.timestamp)}
                    disabled={isLoading}
                  >
                    <span className="material-icons text-sm">download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </MobileCard>

      {/* Informations de sécurité */}
      <MobileCard className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="material-icons text-blue-600 mt-1">info</span>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Protection automatique</h4>
            <p className="text-sm text-blue-700">
              Vos données sont sauvegardées automatiquement toutes les 5 minutes et avant 
              la fermeture de l'application. Les sauvegardes sont stockées localement 
              dans votre navigateur et peuvent être exportées vers un fichier.
            </p>
          </div>
        </div>
      </MobileCard>
    </div>
  );
}