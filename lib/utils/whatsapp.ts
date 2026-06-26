const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '213550385419'

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function buildCarWhatsAppMessage(
  carName: string,
  startDate: string,
  endDate: string,
): string {
  return `Bonjour ConnectiCAR ! 👋\n\nJe souhaite réserver le véhicule suivant :\n🚗 ${carName}\n📅 Du : ${startDate}\n📅 Au : ${endDate}\n\nMerci de me confirmer la disponibilité.`
}

export function buildSimpleContactMessage(): string {
  return `Bonjour ConnectiCAR ! 👋\n\nJe souhaite obtenir des informations sur vos véhicules disponibles.`
}
