/**
 * Tax calculation utilities for the application
 */

export type TaxRate = 0 | 4 | 5 | 6 | 10 | 17 | 18 | 20;

export const TAX_RATES = {
  0: { label: "0% - Exonéré", description: "Produits exonérés de TVA" },
  4: { label: "4% - Taux réduit", description: "Produits de première nécessité" },
  5: { label: "5% - Taux réduit", description: "Certains produits alimentaires" },
  6: { label: "6% - Taux intermédiaire", description: "Services spécialisés" },
  10: { label: "10% - Taux intermédiaire", description: "Restauration, hôtellerie" },
  17: { label: "17% - Taux normal", description: "Taux normal pour certains pays" },
  18: { label: "18% - Taux normal", description: "Taux normal standard" },
  20: { label: "20% - Taux normal", description: "Taux normal européen" }
} as const;

/**
 * Get the current tax rate from localStorage or default to 18%
 */
export function getCurrentTaxRate(): TaxRate {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('taxRate');
    const rate = stored ? parseInt(stored) : 18;
    return (rate in TAX_RATES ? rate : 18) as TaxRate;
  }
  return 18;
}

/**
 * Set the current tax rate in localStorage
 */
export function setCurrentTaxRate(rate: TaxRate): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('taxRate', rate.toString());
  }
}

/**
 * Calculate tax amount from a base price
 */
export function calculateTaxAmount(basePrice: number, taxRate?: TaxRate): number {
  const rate = taxRate || getCurrentTaxRate();
  return (basePrice * rate) / 100;
}

/**
 * Calculate price including tax
 */
export function calculatePriceWithTax(basePrice: number, taxRate?: TaxRate): number {
  const rate = taxRate || getCurrentTaxRate();
  return basePrice + calculateTaxAmount(basePrice, rate);
}

/**
 * Calculate base price from price including tax
 */
export function calculateBasePriceFromTotal(totalPrice: number, taxRate?: TaxRate): number {
  const rate = taxRate || getCurrentTaxRate();
  return totalPrice / (1 + rate / 100);
}

/**
 * Format tax rate for display
 */
export function formatTaxRate(rate: TaxRate): string {
  return TAX_RATES[rate].label;
}

/**
 * Get tax breakdown for invoice display
 */
export function getTaxBreakdown(items: Array<{ price: number; quantity: number; taxRate?: TaxRate }>) {
  const breakdown = new Map<TaxRate, { baseAmount: number; taxAmount: number; totalAmount: number }>();
  
  items.forEach(item => {
    const rate = item.taxRate || getCurrentTaxRate();
    const baseAmount = item.price * item.quantity;
    const taxAmount = calculateTaxAmount(baseAmount, rate);
    const totalAmount = baseAmount + taxAmount;
    
    if (breakdown.has(rate)) {
      const existing = breakdown.get(rate)!;
      breakdown.set(rate, {
        baseAmount: existing.baseAmount + baseAmount,
        taxAmount: existing.taxAmount + taxAmount,
        totalAmount: existing.totalAmount + totalAmount
      });
    } else {
      breakdown.set(rate, { baseAmount, taxAmount, totalAmount });
    }
  });
  
  return breakdown;
}