/**
 * Utility functions for the application
 */

/**
 * Available currencies in the application
 */
export type Currency = 'FCFA' | 'USD' | 'GHS';

export const CURRENCIES = {
  FCFA: { symbol: 'FCFA', name: 'Franc CFA', locale: 'fr-FR' },
  USD: { symbol: '$', name: 'Dollar US', locale: 'en-US' },
  GHS: { symbol: '₵', name: 'Cedi ghanéen', locale: 'en-GH' }
} as const;

/**
 * Get the current currency from localStorage or default to FCFA
 */
export function getCurrentCurrency(): Currency {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currency') as Currency;
    return stored && stored in CURRENCIES ? stored : 'FCFA';
  }
  return 'FCFA';
}

/**
 * Set the current currency in localStorage
 */
export function setCurrentCurrency(currency: Currency): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currency', currency);
  }
}

/**
 * Formats a number as currency based on current currency setting
 * @param amount - The amount to format
 * @param currency - Optional currency override
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency?: Currency): string {
  const currentCurrency = currency || getCurrentCurrency();
  const currencyConfig = CURRENCIES[currentCurrency];
  
  // Format with thousand separators
  const formattedAmount = amount.toLocaleString(currencyConfig.locale);
  
  // Return with appropriate symbol
  if (currentCurrency === 'USD') {
    return `${currencyConfig.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${currencyConfig.symbol}`;
  }
}

/**
 * Generate a random invoice number with a given prefix
 * @param prefix - Prefix for the invoice number
 * @returns Generated invoice number
 */
export function generateInvoiceNumber(prefix = 'INV-'): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}`;
}

/**
 * Check if a product is low in stock
 * @param quantity - Current quantity
 * @param threshold - Threshold for low stock warning
 * @returns Boolean indicating if stock is low
 */
export function isLowStock(quantity: number, threshold: number = 5): boolean {
  return quantity <= threshold;
}

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format a time to a readable string
 * @param date - Date to extract time from
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a date and time to a readable string
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return `${formatDate(date)}, ${formatTime(date)}`;
}

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
}

/**
 * Calculate percentage change between two values
 * @param oldValue - Original value
 * @param newValue - New value
 * @returns Percentage change with + or - sign
 */
export function calculatePercentageChange(oldValue: number, newValue: number): string {
  if (oldValue === 0) return newValue > 0 ? "+100%" : "0%";
  
  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change > 0 ? "+" : "";
  return `${sign}${Math.round(change)}%`;
}

/**
 * Apply a discount to a price
 * @param price - Original price
 * @param discountPercent - Discount percentage
 * @returns Price after discount
 */
export function applyDiscount(price: number, discountPercent: number): number {
  return price * (1 - (discountPercent / 100));
}

/**
 * Calculate total value of inventory
 * @param products - Array of products with price and quantity
 * @returns Total inventory value
 */
export function calculateInventoryValue(products: Array<{price: number, quantity: number}>): number {
  return products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
}

/**
 * Convert a string to title case
 * @param str - String to convert
 * @returns Title-cased string
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Validate an email address
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Format a phone number
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // This is a simple formatter for West African phone numbers
  // Replace with more specific logic as needed
  if (!phoneNumber) return '';
  
  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  if (digits.length < 8) return phoneNumber;
  
  // Format as +XXX XX XX XX XX for international numbers with country code
  if (digits.length >= 10) {
    const countryCode = digits.slice(0, digits.length - 8);
    const restDigits = digits.slice(digits.length - 8);
    return `+${countryCode} ${restDigits.slice(0, 2)} ${restDigits.slice(2, 4)} ${restDigits.slice(4, 6)} ${restDigits.slice(6, 8)}`;
  }
  
  // Format as XX XX XX XX for local numbers
  return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)}`;
}
