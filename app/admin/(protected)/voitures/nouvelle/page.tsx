'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCar } from '@/lib/actions/cars'
import { toast } from 'sonner'
import type { CarCategory, Transmission, FuelType } from '@/types'
import { CATEGORY_LABELS } from '@/types'

export default function NouvelleVoiturePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'economique' as CarCategory,
    transmission: 'automatic' as Transmission,
    fuel_type: 'essence' as FuelType,
    seats: 5,
    price_per_day: 0,
    deposit_amount: null as number | null,
    features: '' as string,
    images: '',
    thumbnail_url: '',
    is_active: true,
  })

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        const features = form.features ? form.features.split(',').map((s) => s.trim()).filter(Boolean) : []
        const images = form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : []

        await createCar({
          ...form,
          features,
          images,
          thumbnail_url: form.thumbnail_url || images[0] || null,
          deposit_amount: form.deposit_amount,
        })
        toast.success('Voiture ajoutée avec succès !')
        router.push('/admin/voitures')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'ajout.')
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-black text-[#0A0A0A]">Ajouter un véhicule</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom complet *" required>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="Dacia Sandero Stepway 2024"
              className="input-field" />
          </Field>
          <Field label="Marque *">
            <input value={form.brand} onChange={(e) => set('brand', e.target.value)}
              placeholder="Dacia" className="input-field" />
          </Field>
          <Field label="Modèle *">
            <input value={form.model} onChange={(e) => set('model', e.target.value)}
              placeholder="Sandero Stepway" className="input-field" />
          </Field>
          <Field label="Année *">
            <input type="number" value={form.year} onChange={(e) => set('year', +e.target.value)}
              min={2010} max={2030} className="input-field" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Catégorie">
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
              {(Object.keys(CATEGORY_LABELS) as CarCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </Field>
          <Field label="Transmission">
            <select value={form.transmission} onChange={(e) => set('transmission', e.target.value)} className="input-field">
              <option value="automatic">Automatique</option>
              <option value="manual">Manuelle</option>
            </select>
          </Field>
          <Field label="Carburant">
            <select value={form.fuel_type} onChange={(e) => set('fuel_type', e.target.value)} className="input-field">
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="hybride">Hybride</option>
              <option value="electrique">Électrique</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Places">
            <input type="number" value={form.seats} onChange={(e) => set('seats', +e.target.value)}
              min={2} max={9} className="input-field" />
          </Field>
          <Field label="Prix/jour (DA) *">
            <input type="number" value={form.price_per_day} onChange={(e) => set('price_per_day', +e.target.value)}
              min={0} className="input-field" />
          </Field>
          <Field label="Caution (DA)">
            <input type="number" value={form.deposit_amount ?? ''}
              onChange={(e) => set('deposit_amount', e.target.value ? +e.target.value : null)}
              placeholder="Optionnel" className="input-field" />
          </Field>
        </div>

        <Field label="Équipements" hint="Séparés par des virgules : climatisation, bluetooth, gps">
          <input value={form.features} onChange={(e) => set('features', e.target.value)}
            placeholder="climatisation, bluetooth, gps, camera_recul"
            className="input-field" />
        </Field>

        <Field label="URLs images Cloudinary" hint="Séparées par des virgules (1ère = image principale)">
          <textarea value={form.images} onChange={(e) => set('images', e.target.value)}
            rows={3} placeholder="https://res.cloudinary.com/..." className="input-field resize-none" />
        </Field>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_active" checked={form.is_active}
            onChange={(e) => set('is_active', e.target.checked)}
            className="w-4 h-4 accent-[#E31E24]" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Afficher ce véhicule sur le site
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#E31E24] text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 text-sm"
          >
            {isPending ? 'Enregistrement...' : 'Ajouter le véhicule'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-3"
          >
            Annuler
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .input-field:focus {
          ring: 2px solid #E31E24;
          border-color: transparent;
        }
      `}</style>
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {hint && <span className="text-gray-400 font-normal ml-1 text-xs">({hint})</span>}
      </label>
      {children}
    </div>
  )
}
