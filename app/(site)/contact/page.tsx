'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error('Veuillez remplir les champs obligatoires.')
      return
    }
    startTransition(async () => {
      // Redirection WhatsApp avec le message pré-rempli
      const msg = encodeURIComponent(
        `Bonjour ConnectiCAR !\n\nNom : ${form.name}\nTél : ${form.phone}${form.email ? `\nEmail : ${form.email}` : ''}\n\nMessage : ${form.message}`
      )
      window.open(`https://wa.me/213550385419?text=${msg}`, '_blank')
      toast.success('Redirection vers WhatsApp...')
      setForm({ name: '', phone: '', email: '', message: '' })
    })
  }

  const whatsappUrl = `https://wa.me/213550385419?text=${encodeURIComponent('Bonjour ConnectiCAR, je souhaite avoir des informations sur la location de voitures.')}`

  return (
    <>
      {/* Hero immersif */}
      <div className="relative bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/contact-hero.jpg"
            alt="Famille en voiture ConnectiCAR"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-4">Contact</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-5">
            Parlons de votre<br />
            <span className="text-[#E31E24]">prochain trajet</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg">
            Notre équipe est disponible 7j/7 pour répondre à toutes vos questions et organiser votre location.
          </p>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Infos contact ── */}
        <div className="space-y-6">
          {[
            {
              icon: Phone,
              label: 'Téléphone',
              value: '+213 5 50 38 54 19',
              sub: '+33 6 15 36 99 59 (France)',
              href: 'tel:+213550385419',
            },
            {
              icon: MapPin,
              label: 'Localisation',
              value: 'Béjaïa & Alger',
              sub: 'Livraison aéroport disponible',
              href: null,
            },
            {
              icon: Clock,
              label: 'Disponibilité',
              value: '7j/7 · 24h/24',
              sub: 'Réponse rapide garantie',
              href: null,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#E31E24]/10 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-[#E31E24]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-bold text-[#0A0A0A] hover:text-[#E31E24] transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-bold text-[#0A0A0A]">{item.value}</p>
                )}
                <p className="text-sm text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}

          {/* Bouton WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-5 h-5" />
            Discuter sur WhatsApp
          </a>
        </div>

        {/* ── Formulaire ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-black text-[#0A0A0A] text-xl mb-6">Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom complet <span className="text-[#E31E24]">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Votre nom"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Téléphone <span className="text-[#E31E24]">*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+213 5 XX XX XX XX"
                  type="tel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="votre@email.com"
                type="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message <span className="text-[#E31E24]">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                rows={5}
                placeholder="Décrivez votre besoin (dates, véhicule souhaité, lieu de prise en charge...)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2.5 w-full bg-[#E31E24] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 text-base shadow-lg shadow-red-500/20"
            >
              <Send className="w-4 h-4" />
              {isPending ? 'Envoi...' : 'Envoyer via WhatsApp'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Votre message sera envoyé directement sur notre WhatsApp pour une réponse rapide.
            </p>
          </form>
        </div>

      </div>

    </div>

      {/* Map pleine largeur */}
      <div className="overflow-hidden">
        <div className="bg-[#0A0A0A] px-5 py-4 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E31E24] shrink-0" />
          <div>
            <p className="text-white font-bold text-sm">Siège ConnectiCAR</p>
            <p className="text-gray-400 text-xs">Cité 212 logements GMP, Béjaïa 06000</p>
          </div>
        </div>
        <iframe
          src="https://maps.google.com/maps?q=cité+212+logements+GMP+bejaia+06000+Algeria&output=embed&z=15"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="ConnectiCAR — Cité 212 logements GMP, Béjaïa"
        />
      </div>
    </>
  )
}
