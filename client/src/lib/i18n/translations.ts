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
    
    // Quick actions
    newSale: "Nouvelle vente",
    newClient: "Nouveau client",
    newProduct: "Nouveau produit",
    quickActions: "Actions rapides",
    
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
    searchProduct: "Rechercher un produit...",
    noProductFound: "Aucun produit trouvé",
    
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
    registerSale: "Enregistrer la vente",
    printInvoice: "Imprimer automatiquement la facture après la vente",
    notes: "Notes",
    additionalNotes: "Notes supplémentaires (optionnel)",
    
    // Settings
    language: "Langue",
    currency: "Devise",
    darkMode: "Mode sombre",
    autoBackup: "Sauvegarde automatique",
    companyInfo: "Informations de l'entreprise",
    displayPreferences: "Préférences d'affichage",
    chooseLanguage: "Choisir la langue de l'interface",
    enableDarkTheme: "Activer le thème sombre pour l'application",
    
    // Messages
    success: "Succès",
    error: "Erreur",
    loading: "Chargement...",
    noData: "Aucune donnée disponible",
    languageChanged: "Langue modifiée",
    interfaceInFrench: "L'interface est maintenant en français",
    
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
    
    // Quick actions
    newSale: "New Sale",
    newClient: "New Client",
    newProduct: "New Product",
    quickActions: "Quick Actions",
    
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
    searchProduct: "Search for a product...",
    noProductFound: "No product found",
    
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
    registerSale: "Register Sale",
    printInvoice: "Automatically print invoice after sale",
    notes: "Notes",
    additionalNotes: "Additional notes (optional)",
    
    // Settings
    language: "Language",
    currency: "Currency",
    darkMode: "Dark Mode",
    autoBackup: "Auto Backup",
    companyInfo: "Company Information",
    displayPreferences: "Display Preferences",
    chooseLanguage: "Choose the interface language",
    enableDarkTheme: "Enable dark theme for the application",
    
    // Messages
    success: "Success",
    error: "Error",
    loading: "Loading...",
    noData: "No data available",
    languageChanged: "Language changed",
    interfaceInEnglish: "Interface is now in English",
    
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
  return (translations[currentLang] as any)[key] || (translations.en as any)[key] || key;
}