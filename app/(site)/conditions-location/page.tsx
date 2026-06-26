import { CheckCircle2, XCircle, AlertTriangle, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const sections = [
  {
    title: 'Documents requis',
    icon: '🪪',
    items: [
      { ok: true, text: 'Permis de conduire valide (catégorie B minimum)' },
      { ok: true, text: 'Carte nationale d\'identité ou passeport en cours de validité' },
      { ok: true, text: 'Pour les étrangers : passeport + visa en cours de validité' },
      { ok: false, text: 'Permis international requis pour les permis non algériens' },
    ],
  },
  {
    title: 'Conditions du conducteur',
    icon: '🚘',
    items: [
      { ok: true, text: 'Âge minimum : 21 ans révolus' },
      { ok: true, text: 'Permis de conduire obtenu depuis au moins 2 ans' },
      { ok: true, text: 'Conducteur additionnel possible (à déclarer obligatoirement)' },
      { ok: false, text: 'Moins de 2 ans de permis : supplément jeune conducteur applicable' },
    ],
  },
  {
    title: 'Caution & paiement',
    icon: '💳',
    items: [
      { ok: true, text: 'Caution bloquée en espèces ou par virement à la remise du véhicule' },
      { ok: true, text: 'Paiement du loyer intégral à la remise du véhicule' },
      { ok: true, text: 'Caution restituée à la restitution du véhicule en bon état' },
      { ok: false, text: 'Aucun paiement en ligne requis pour la réservation' },
    ],
  },
  {
    title: 'Carburant',
    icon: '⛽',
    items: [
      { ok: true, text: 'Véhicule remis avec le plein de carburant' },
      { ok: true, text: 'Véhicule à restituer avec le plein de carburant' },
      { ok: false, text: 'Tout carburant manquant sera facturé au tarif en vigueur + frais de service' },
    ],
  },
  {
    title: 'Kilométrage',
    icon: '📍',
    items: [
      { ok: true, text: 'Kilométrage illimité inclus pour toute location' },
      { ok: true, text: 'Utilisation autorisée sur tout le territoire algérien' },
      { ok: false, text: 'Sortie du territoire algérien strictement interdite' },
    ],
  },
  {
    title: 'Restitution du véhicule',
    icon: '🔑',
    items: [
      { ok: true, text: 'Restitution au lieu et à l\'heure convenus lors de la réservation' },
      { ok: true, text: 'Livraison et reprise possible à l\'aéroport de Béjaïa ou d\'Alger' },
      { ok: false, text: 'Retard de restitution : une journée supplémentaire sera facturée après 2h de délai' },
      { ok: false, text: 'En cas d\'impossibilité de restitution, nous contacter immédiatement' },
    ],
  },
  {
    title: 'Assurance & sinistres',
    icon: '🛡️',
    items: [
      { ok: true, text: 'Tous les véhicules sont assurés tous risques' },
      { ok: true, text: 'Assistance en cas de panne ou d\'accident' },
      { ok: false, text: 'Franchise restant à la charge du locataire en cas d\'accident responsable' },
      { ok: false, text: 'Dommages causés par négligence (carburant incorrect, vitesse excessive…) non couverts' },
    ],
  },
  {
    title: 'Utilisation interdite',
    icon: '🚫',
    items: [
      { ok: false, text: 'Transport de marchandises commerciales ou de matières dangereuses' },
      { ok: false, text: 'Sous-location ou prêt à une tierce personne non déclarée' },
      { ok: false, text: 'Participation à des compétitions ou épreuves sportives' },
      { ok: false, text: 'Conduite sous l\'emprise de l\'alcool ou de stupéfiants' },
    ],
  },
]

export default function ConditionsLocationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* En-tête */}
      <div className="mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-3">Informations importantes</p>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0A0A0A] tracking-tight mb-4">
          Conditions de<br />
          <span className="text-gradient">location</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl">
          Veuillez lire attentivement les conditions avant de procéder à votre réservation. Notre équipe reste disponible pour toute question.
        </p>
      </div>

      {/* Bandeau alerte */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <span className="font-bold">Important :</span> La présentation de tous les documents requis est obligatoire à la remise du véhicule. Toute réservation sans documents valides sera annulée sans remboursement du premier versement.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6 mb-16">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <span className="text-xl">{section.icon}</span>
              <h2 className="font-black text-[#0A0A0A]">{section.title}</h2>
            </div>
            <ul className="px-6 py-4 space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  {item.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#E31E24] shrink-0 mt-0.5" />
                  )}
                  <span className={item.ok ? 'text-gray-700' : 'text-gray-600'}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Note légale */}
      <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-10 text-sm text-gray-500 leading-relaxed">
        <p>
          Ces conditions générales de location sont applicables à toute réservation effectuée auprès de <strong className="text-[#0A0A0A]">ConnectiCAR</strong>. En procédant à une réservation, le locataire reconnaît avoir pris connaissance et accepté l&apos;ensemble de ces conditions. ConnectiCAR se réserve le droit de refuser toute location en cas de non-respect de ces conditions ou de doute sur l&apos;identité du locataire.
        </p>
      </div>

      {/* CTA contact */}
      <div className="relative bg-[#0A0A0A] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="relative px-8 py-10 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Une question sur les conditions ?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+213550385419"
              className="flex items-center justify-center gap-2 border-2 border-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white hover:text-[#0A0A0A] transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Appeler
            </a>
            <a
              href={`https://wa.me/213550385419?text=${encodeURIComponent('Bonjour ConnectiCAR, j\'ai une question sur les conditions de location.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#E31E24] text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              Formulaire contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
