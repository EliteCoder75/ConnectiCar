import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? 'bachirguedouda@gmail.com'

interface ReservationEmailData {
  customerName: string
  customerPhone: string
  customerEmail?: string
  carName: string
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
  totalPrice: number
  notes?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-DZ', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatPrice(amount: number) {
  return `${amount.toLocaleString('fr-DZ')} DA`
}

// ─── Email envoyé à l'admin à chaque nouvelle réservation ───────────────────
export async function sendAdminNotification(data: ReservationEmailData) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🚗 Nouvelle réservation — ${data.carName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A0A0A; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">
            Connecti<span style="color: #E31E24;">CAR</span>
          </h1>
          <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">Nouvelle demande de réservation</p>
        </div>

        <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0A0A0A; font-size: 18px; margin: 0 0 20px;">📋 Détails de la réservation</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%;">Véhicule</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0A0A0A; font-size: 14px;">${data.carName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Client</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0A0A0A; font-size: 14px;">${data.customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Téléphone</td>
              <td style="padding: 10px 0; font-weight: bold; color: #E31E24; font-size: 14px;">
                <a href="tel:${data.customerPhone}" style="color: #E31E24;">${data.customerPhone}</a>
              </td>
            </tr>
            ${data.customerEmail ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 10px 0; font-size: 14px;">
                <a href="mailto:${data.customerEmail}" style="color: #E31E24;">${data.customerEmail}</a>
              </td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Départ</td>
              <td style="padding: 10px 0; color: #0A0A0A; font-size: 14px;">${formatDate(data.startDate)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Retour</td>
              <td style="padding: 10px 0; color: #0A0A0A; font-size: 14px;">${formatDate(data.endDate)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Prise en charge</td>
              <td style="padding: 10px 0; color: #0A0A0A; font-size: 14px;">${data.pickupLocation}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Retour</td>
              <td style="padding: 10px 0; color: #0A0A0A; font-size: 14px;">${data.returnLocation}</td>
            </tr>
            ${data.notes ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Notes</td>
              <td style="padding: 10px 0; color: #0A0A0A; font-size: 14px; font-style: italic;">${data.notes}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 14px 0 0; color: #6b7280; font-size: 14px;">Total estimé</td>
              <td style="padding: 14px 0 0; font-weight: bold; color: #E31E24; font-size: 20px;">${formatPrice(data.totalPrice)}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #E31E24;">
            <p style="margin: 0; font-size: 14px; color: #0A0A0A; font-weight: bold;">Action requise</p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280;">
              Connectez-vous à votre espace admin pour confirmer ou annuler cette réservation.
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/admin/reservations"
               style="display: inline-block; background: #E31E24; color: white; font-weight: bold;
                      padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px;">
              Gérer les réservations
            </a>
          </div>
        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
          ConnectiCAR — Votre mobilité, notre priorité.
        </p>
      </div>
    `,
  })
}

// ─── Email envoyé au client si son email est fourni ─────────────────────────
export async function sendClientConfirmation(data: ReservationEmailData) {
  if (!data.customerEmail) return

  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Votre demande de réservation — ${data.carName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A0A0A; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">
            Connecti<span style="color: #E31E24;">CAR</span>
          </h1>
          <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">Location de voitures — Béjaïa & Alger</p>
        </div>

        <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0A0A0A; font-size: 18px; margin: 0 0 8px;">
            Bonjour ${data.customerName} 👋
          </h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px; line-height: 1.6;">
            Nous avons bien reçu votre demande de réservation. Notre équipe vous contactera
            dans les plus brefs délais pour confirmer votre location.
          </p>

          <div style="background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #0A0A0A; font-size: 15px; margin: 0 0 14px;">Récapitulatif de votre demande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Véhicule</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0A0A0A; font-size: 13px;">${data.carName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Départ</td>
                <td style="padding: 8px 0; color: #0A0A0A; font-size: 13px;">${formatDate(data.startDate)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Retour</td>
                <td style="padding: 8px 0; color: #0A0A0A; font-size: 13px;">${formatDate(data.endDate)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Lieu de prise en charge</td>
                <td style="padding: 8px 0; color: #0A0A0A; font-size: 13px;">${data.pickupLocation}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Total estimé</td>
                <td style="padding: 8px 0; font-weight: bold; color: #E31E24; font-size: 16px;">${formatPrice(data.totalPrice)}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #15803d; font-weight: bold;">✅ Demande reçue</p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
              Aucun paiement n'est requis à ce stade. Notre équipe vous appellera pour finaliser votre réservation.
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px;">Besoin d'aide ? Contactez-nous directement :</p>
            <p style="margin: 0;">
              <a href="tel:+213550385419" style="color: #E31E24; font-weight: bold; font-size: 14px;">
                📞 +213 5 50 38 54 19
              </a>
            </p>
            <p style="margin: 4px 0 0;">
              <a href="https://wa.me/213550385419" style="color: #25D366; font-weight: bold; font-size: 14px;">
                💬 WhatsApp
              </a>
            </p>
          </div>
        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
          ConnectiCAR — Votre mobilité, notre priorité. Béjaïa & Alger.
        </p>
      </div>
    `,
  })
}
