import { queryClient } from '@/lib/queryClient';

export interface BackupData {
  timestamp: number;
  version: string;
  data: {
    products: any[];
    clients: any[];
    sales: any[];
    categories: any[];
    company: any;
  };
  metadata: {
    userAgent: string;
    url: string;
    backupType: 'auto' | 'manual' | 'recovery';
  };
}

export class BackupManager {
  private static instance: BackupManager;
  private backupKey = 'gys_backup_data';
  private autoBackupInterval: number | null = null;
  private lastBackupTime = 0;
  private readonly BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_BACKUPS = 10;

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  private constructor() {
    this.initializeBackupSystem();
  }

  private initializeBackupSystem() {
    // Démarrer la sauvegarde automatique
    this.startAutoBackup();
    
    // Écouter les événements de fermeture de page
    window.addEventListener('beforeunload', () => {
      this.createBackup('auto');
    });

    // Écouter les erreurs globales
    window.addEventListener('error', () => {
      this.createBackup('recovery');
    });

    // Écouter les erreurs de promesses non gérées
    window.addEventListener('unhandledrejection', () => {
      this.createBackup('recovery');
    });
  }

  async createBackup(type: 'auto' | 'manual' | 'recovery' = 'manual'): Promise<boolean> {
    try {
      const now = Date.now();
      
      // Éviter les sauvegardes trop fréquentes (sauf en cas d'urgence)
      if (type === 'auto' && now - this.lastBackupTime < this.BACKUP_INTERVAL) {
        return false;
      }

      const data = await this.collectAllData();
      
      const backup: BackupData = {
        timestamp: now,
        version: '1.0.0',
        data,
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          backupType: type
        }
      };

      // Sauvegarder dans localStorage
      await this.saveToLocalStorage(backup);
      
      // Sauvegarder dans IndexedDB pour plus de capacité
      await this.saveToIndexedDB(backup);
      
      this.lastBackupTime = now;
      
      console.log(`✅ Sauvegarde ${type} créée avec succès`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  private async collectAllData() {
    try {
      const [products, clients, sales, categories, company] = await Promise.allSettled([
        this.fetchWithFallback('/api/products'),
        this.fetchWithFallback('/api/clients'),
        this.fetchWithFallback('/api/sales'),
        this.fetchWithFallback('/api/categories'),
        this.fetchWithFallback('/api/company')
      ]);

      return {
        products: products.status === 'fulfilled' ? products.value : [],
        clients: clients.status === 'fulfilled' ? clients.value : [],
        sales: sales.status === 'fulfilled' ? sales.value : [],
        categories: categories.status === 'fulfilled' ? categories.value : [],
        company: company.status === 'fulfilled' ? company.value : null
      };
    } catch (error) {
      console.warn('Utilisation des données en cache pour la sauvegarde');
      return this.getCachedData();
    }
  }

  private async fetchWithFallback(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch {
      // Récupérer depuis le cache React Query
      return queryClient.getQueryData([url]) || [];
    }
  }

  private getCachedData() {
    return {
      products: queryClient.getQueryData(['/api/products']) || [],
      clients: queryClient.getQueryData(['/api/clients']) || [],
      sales: queryClient.getQueryData(['/api/sales']) || [],
      categories: queryClient.getQueryData(['/api/categories']) || [],
      company: queryClient.getQueryData(['/api/company']) || null
    };
  }

  private async saveToLocalStorage(backup: BackupData) {
    try {
      const backups = this.getLocalBackups();
      backups.unshift(backup);
      
      // Garder seulement les N dernières sauvegardes
      if (backups.length > this.MAX_BACKUPS) {
        backups.splice(this.MAX_BACKUPS);
      }
      
      localStorage.setItem(this.backupKey, JSON.stringify(backups));
    } catch (error) {
      console.warn('Échec de sauvegarde localStorage:', error);
    }
  }

  private async saveToIndexedDB(backup: BackupData) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['backups'], 'readwrite');
      const store = transaction.objectStore('backups');
      
      await store.put(backup, backup.timestamp);
      
      // Nettoyer les anciennes sauvegardes
      await this.cleanOldIndexedDBBackups(store);
      
      db.close();
    } catch (error) {
      console.warn('Échec de sauvegarde IndexedDB:', error);
    }
  }

  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('gys_backups', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('backups')) {
          db.createObjectStore('backups');
        }
      };
    });
  }

  private async cleanOldIndexedDBBackups(store: IDBObjectStore) {
    const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    if (keys.length > this.MAX_BACKUPS) {
      const sortedKeys = keys.sort((a, b) => Number(b) - Number(a));
      const keysToDelete = sortedKeys.slice(this.MAX_BACKUPS);
      
      for (const key of keysToDelete) {
        await new Promise<void>((resolve, reject) => {
          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
      }
    }
  }

  getLocalBackups(): BackupData[] {
    try {
      const data = localStorage.getItem(this.backupKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async getIndexedDBBackups(): Promise<BackupData[]> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['backups'], 'readonly');
      const store = transaction.objectStore('backups');
      
      const backups = await new Promise<BackupData[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
      
      return backups.sort((a: BackupData, b: BackupData) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  }

  async getAllBackups(): Promise<BackupData[]> {
    const [localBackups, indexedDBBackups] = await Promise.all([
      Promise.resolve(this.getLocalBackups()),
      this.getIndexedDBBackups()
    ]);

    // Fusionner et dédupliquer par timestamp
    const allBackups = [...localBackups, ...indexedDBBackups];
    const uniqueBackups = allBackups.reduce((acc, backup) => {
      if (!acc.find(b => b.timestamp === backup.timestamp)) {
        acc.push(backup);
      }
      return acc;
    }, [] as BackupData[]);

    return uniqueBackups.sort((a, b) => b.timestamp - a.timestamp);
  }

  async restoreFromBackup(timestamp: number): Promise<boolean> {
    try {
      const backups = await this.getAllBackups();
      const backup = backups.find(b => b.timestamp === timestamp);
      
      if (!backup) {
        throw new Error('Sauvegarde introuvable');
      }

      // Restaurer les données via l'API
      await this.restoreData(backup.data);
      
      // Invalider le cache React Query pour forcer le rechargement
      queryClient.invalidateQueries();
      
      console.log('✅ Données restaurées avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      return false;
    }
  }

  private async restoreData(data: BackupData['data']) {
    const results = await Promise.allSettled([
      this.restoreProducts(data.products),
      this.restoreClients(data.clients),
      this.restoreSales(data.sales),
      this.restoreCategories(data.categories)
    ]);

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn('Certaines données n\'ont pas pu être restaurées:', failures);
    }
  }

  private async restoreProducts(products: any[]) {
    for (const product of products) {
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      } catch (error) {
        console.warn('Échec de restauration produit:', product.name, error);
      }
    }
  }

  private async restoreClients(clients: any[]) {
    for (const client of clients) {
      try {
        await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(client)
        });
      } catch (error) {
        console.warn('Échec de restauration client:', client.name, error);
      }
    }
  }

  private async restoreSales(sales: any[]) {
    for (const sale of sales) {
      try {
        await fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sale)
        });
      } catch (error) {
        console.warn('Échec de restauration vente:', sale.id, error);
      }
    }
  }

  private async restoreCategories(categories: any[]) {
    for (const category of categories) {
      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        });
      } catch (error) {
        console.warn('Échec de restauration catégorie:', category.name, error);
      }
    }
  }

  exportBackupAsFile(timestamp: number): void {
    const backups = this.getLocalBackups();
    const backup = backups.find(b => b.timestamp === timestamp);
    
    if (!backup) {
      throw new Error('Sauvegarde introuvable');
    }

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gys_backup_${new Date(timestamp).toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  async importBackupFromFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);
      
      // Valider la structure
      if (!backup.timestamp || !backup.data) {
        throw new Error('Fichier de sauvegarde invalide');
      }

      // Ajouter aux sauvegardes locales
      await this.saveToLocalStorage(backup);
      await this.saveToIndexedDB(backup);
      
      return true;
    } catch (error) {
      console.error('Erreur d\'importation:', error);
      return false;
    }
  }

  startAutoBackup() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
    }
    
    this.autoBackupInterval = window.setInterval(() => {
      this.createBackup('auto');
    }, this.BACKUP_INTERVAL);
  }

  stopAutoBackup() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
    }
  }

  async checkForRecovery(): Promise<BackupData | null> {
    const backups = await this.getAllBackups();
    const recoveryBackup = backups.find(b => b.metadata.backupType === 'recovery');
    
    if (recoveryBackup && Date.now() - recoveryBackup.timestamp < 24 * 60 * 60 * 1000) {
      return recoveryBackup;
    }
    
    return null;
  }

  getBackupStatus() {
    const backups = this.getLocalBackups();
    const lastBackup = backups[0];
    
    return {
      hasBackups: backups.length > 0,
      lastBackupTime: lastBackup?.timestamp || 0,
      backupCount: backups.length,
      isAutoBackupActive: this.autoBackupInterval !== null
    };
  }
}

export const backupManager = BackupManager.getInstance();