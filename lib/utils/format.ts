export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' DA'
}

export function calcTotalPrice(pricePerDay: number, days: number): number {
  return pricePerDay * days
}
