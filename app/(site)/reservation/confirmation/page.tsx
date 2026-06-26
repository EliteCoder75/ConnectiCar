import Link from 'next/link'
import { CheckCircle2, Phone, MessageCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ car?: string; start?: string; end?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { car, start, end } = await searchParams

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#0A0A0A] mb-2">
          Demande envoyée !
        </h1>
        <p className="text-gray-500 mb-6">
          Votre demande de réservation pour{' '}
          <strong className="text-[#0A0A0A]">{car ?? 'le véhicule'}</strong>
          {start && end && (
            <> du <strong>{start}</strong> au <strong>{end}</strong></>
          )}{' '}
          a bien été reçue.
        </p>

        <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-6 text-left">
          <h2 className="font-bold text-[#0A0A0A] mb-3">Prochaines étapes</h2>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="bg-[#E31E24] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              Notre équipe vérifie la disponibilité
            </li>
            <li className="flex gap-2">
              <span className="bg-[#E31E24] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              Vous recevez une confirmation par téléphone sous 24h
            </li>
            <li className="flex gap-2">
              <span className="bg-[#E31E24] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              Récupération du véhicule au lieu convenu
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:+213550385419"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-[#0A0A0A] text-[#0A0A0A] font-bold py-3 rounded-xl hover:bg-[#0A0A0A] hover:text-white transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            Appeler maintenant
          </a>
          <a
            href={`https://wa.me/213550385419?text=${encodeURIComponent('Bonjour, je viens de faire une demande de réservation sur votre site.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

        <Link
          href="/"
          className="block mt-4 text-sm text-gray-400 hover:text-[#E31E24] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
