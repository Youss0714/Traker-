/**
 * Translation system for the application
 */
import { getCurrentLanguage } from '../utils/helpers';

export const translations = {
  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    sales: "Ventes",
    inventory: "Inventaire",
    clients: "Clients",
    invoices: "Factures",
    reports: "Rapports",
    settings: "Paramètres",
    more: "Plus",
    
    // Common actions
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    search: "Rechercher",
    filter: "Filtrer",
    
    // Product management
    products: "Produits",
    addProduct: "Ajouter un produit",
    productName: "Nom du produit",
    description: "Description",
    price: "Prix",
    quantity: "Quantité",
    category: "Catégorie",
    
    // Client management
    addClient: "Ajouter un client",
    clientName: "Nom du client",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    
    // Sales
    addSale: "Nouvelle vente",
    invoiceNumber: "Numéro de facture",
    total: "Total",
    tax: "TVA",
    
    // Settings
    language: "Langue",
    currency: "Devise",
    darkMode: "Mode sombre",
    autoBackup: "Sauvegarde automatique",
    companyInfo: "Informations de l'entreprise",
    
    // Messages
    success: "Succès",
    error: "Erreur",
    loading: "Chargement...",
    noData: "Aucune donnée disponible",
    
    // Form validation
    required: "Ce champ est requis",
    invalidEmail: "Email invalide",
    invalidPhone: "Numéro de téléphone invalide"
  },
  
  en: {
    // Navigation
    dashboard: "Dashboard",
    sales: "Sales",
    inventory: "Inventory",
    clients: "Clients",
    invoices: "Invoices",
    reports: "Reports",
    settings: "Settings",
    more: "More",
    
    // Common actions
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    
    // Product management
    products: "Products",
    addProduct: "Add Product",
    productName: "Product Name",
    description: "Description",
    price: "Price",
    quantity: "Quantity",
    category: "Category",
    
    // Client management
    addClient: "Add Client",
    clientName: "Client Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    
    // Sales
    addSale: "New Sale",
    invoiceNumber: "Invoice Number",
    total: "Total",
    tax: "Tax",
    
    // Settings
    language: "Language",
    currency: "Currency",
    darkMode: "Dark Mode",
    autoBackup: "Auto Backup",
    companyInfo: "Company Information",
    
    // Messages
    success: "Success",
    error: "Error",
    loading: "Loading...",
    noData: "No data available",
    
    // Form validation
    required: "This field is required",
    invalidEmail: "Invalid email",
    invalidPhone: "Invalid phone number"
  }
} as const;

export type TranslationKey = keyof typeof translations.fr;

/**
 * Get translation for a key based on current language
 */
export function t(key: TranslationKey, language?: 'fr' | 'en'): string {
  const currentLang = language || getCurrentLanguage();
  return translations[currentLang][key] || translations.fr[key] || key;
}