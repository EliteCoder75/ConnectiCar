const STEPS = [
  {
    number: '01',
    title: 'Choisissez vos dates',
    desc: 'Entrez vos dates de départ et de retour pour voir les véhicules disponibles et les tarifs pour votre période.',
  },
  {
    number: '02',
    title: 'Choisissez votre voiture',
    desc: 'Sélectionnez le véhicule qui vous convient parmi notre flotte. Livraison possible à l\'aéroport de Béjaïa ou d\'Alger.',
  },
  {
    number: '03',
    title: 'Remplissez le formulaire',
    desc: 'Renseignez vos informations personnelles, le lieu de prise en charge et vos éventuelles demandes spéciales.',
  },
  {
    number: '04',
    title: 'Confirmation rapide',
    desc: 'Notre équipe vous confirme la réservation par téléphone ou WhatsApp sous 24h. Aucun paiement en ligne requis.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-[#F7F6F4] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-3">
            Comment ça fonctionne ?
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">
            Étapes pour réserver une voiture
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="relative pt-7">
              {/* Badge numéro */}
              <div className="absolute -top-0 left-6 w-14 h-14 bg-[#E31E24] rounded-2xl flex items-center justify-center z-10 shadow-lg shadow-red-500/20">
                <span className="text-white font-black text-xl">{step.number}</span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl pt-14 pb-7 px-6 shadow-sm border border-gray-100 h-full">
                <h3 className="font-black text-[#0A0A0A] text-lg mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
