'use client'

import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/20 shadow-lg shadow-black/5'
          : 'bg-white border-0 shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ConnectiCAR — Location de voitures"
              className="h-36 w-auto object-contain object-bottom"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#voitures" className="text-sm font-medium text-gray-700 hover:text-[#E31E24] transition-colors">
              Nos Voitures
            </Link>
            <Link href="/temoignages" className="text-sm font-medium text-gray-700 hover:text-[#E31E24] transition-colors">
              Témoignages
            </Link>
            <Link href="/conditions-location" className="text-sm font-medium text-gray-700 hover:text-[#E31E24] transition-colors">
              Conditions de location
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#E31E24] transition-colors">
              Contact
            </Link>
            <a
              href="tel:+213550385419"
              className="flex items-center gap-2 bg-[#E31E24] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">+213 5 50 38 54 19</span>
              <span className="lg:hidden">Appeler</span>
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#E31E24]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-3">
          <Link
            href="/#voitures"
            className="block py-2 text-sm font-medium text-gray-700"
            onClick={() => setOpen(false)}
          >
            Nos Voitures
          </Link>
          <Link
            href="/temoignages"
            className="block py-2 text-sm font-medium text-gray-700"
            onClick={() => setOpen(false)}
          >
            Témoignages
          </Link>
          <Link
            href="/conditions-location"
            className="block py-2 text-sm font-medium text-gray-700"
            onClick={() => setOpen(false)}
          >
            Conditions de location
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-sm font-medium text-gray-700"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <a
            href="tel:+213550385419"
            className="flex items-center gap-2 bg-[#E31E24] text-white text-sm font-semibold px-4 py-3 rounded-full justify-center"
          >
            <Phone className="w-4 h-4" />
            +213 5 50 38 54 19
          </a>
        </div>
      )}
    </header>
  )
}
