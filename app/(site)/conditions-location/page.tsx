import { CheckCircle2, XCircle, AlertTriangle, Phone, MessageCircle, FileText, Car, CreditCard, Shield, Fuel } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const sections = [
  {
    title: 'Documents & conducteur',
    icon: FileText,
    accent: '#E31E24',
    items: [
      { ok: true, text: 'Permis de conduire valide (catégorie B minimum, +2 ans)' },
      { ok: true, text: 'Carte nationale d\'identité ou passeport en cours de validité' },
      { ok: true, text: 'Âge minimum : 21 ans révolus' },
      { ok: false, text: 'Permis international requis pour les permis non algériens' },
    ],
  },
  {
    title: 'Caution & paiement',
    icon: CreditCard,
    accent: '#0891b2',
    items: [
      { ok: true, text: 'Caution en espèces ou par virement à la remise du véhicule' },
      { ok: true, text: 'Paiement intégral à la prise en charge' },
      { ok: true, text: 'Caution restituée au retour du véhicule en bon état' },
      { ok: false, text: 'Aucun paiement en ligne requis pour la réservation' },
    ],
  },
  {
    title: 'Véhicule & carburant',
    icon: Fuel,
    accent: '#ea580c',
    items: [
      { ok: true, text: 'Kilométrage illimité sur tout le territoire algérien' },
      { ok: true, text: 'Véhicule remis et à restituer avec le plein' },
      { ok: false, text: 'Carburant manquant facturé au tarif en vigueur' },
      { ok: false, text: 'Sortie du territoire strictement interdite' },
    ],
  },
  {
    title: 'Assurance & restitution',
    icon: Shield,
    accent: '#16a34a',
    items: [
      { ok: true, text: 'Véhicules assurés tous risques avec assistance' },
      { ok: true, text: 'Livraison et reprise aux aéroports de Béjaïa et Alger' },
      { ok: false, text: 'Franchise à la charge du locataire en cas d\'accident responsable' },
      { ok: false, text: 'Retard de restitution : journée supplémentaire après 2h de délai' },
    ],
  },
]

export default function ConditionsLocationPage() {
  return (
    <>
      {/* Hero pleine largeur */}
      <div className="relative bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/conditions.jpg"
            alt="Véhicule ConnectiCAR"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-4">Informations importantes</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-5">
            Conditions de<br />
            <span className="text-[#E31E24]">location</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg">
            Tout ce qu&apos;il faut savoir avant de prendre la route avec ConnectiCAR.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Bandeau alerte */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-14">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-bold">Important :</span> La présentation de tous les documents requis est obligatoire à la remise du véhicule.
          </p>
        </div>

        {/* Grille des conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.title}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: section.accent + '12' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: section.accent }} />
                  </div>
                  <h2 className="font-black text-[#0A0A0A] text-lg">{section.title}</h2>
                </div>
                <ul className="px-6 pb-6 space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {item.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <span className="text-gray-600">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="h-1 w-full" style={{ backgroundColor: section.accent + '20' }} />
              </div>
            )
          })}
        </div>

        {/* Note légale */}
        <p className="text-xs text-gray-400 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          En procédant à une réservation, le locataire reconnaît avoir pris connaissance et accepté l&apos;ensemble de ces conditions. ConnectiCAR se réserve le droit de refuser toute location en cas de non-respect.
        </p>

        {/* CTA */}
        <div className="relative bg-[#0A0A0A] rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
          <div className="relative px-8 py-10 text-center">
            <h2 className="text-2xl font-black text-white mb-2">Une question ?</h2>
            <p className="text-gray-400 text-sm mb-6">
              Notre équipe est disponible 7j/7.
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
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
