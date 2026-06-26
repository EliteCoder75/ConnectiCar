import type { Metadata } from 'next'
import { Raleway, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport = {
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'ConnectiCAR — Location de Voitures à Béjaïa & Alger',
  description:
    'Louez votre voiture en Algérie avec ConnectiCAR. Véhicules récents, boîte automatique, livraison aéroport. Béjaïa et Alger.',
  keywords: 'location voiture Béjaïa, location voiture Algérie, ConnectiCAR, تأجير سيارات بجاية',
  openGraph: {
    title: 'ConnectiCAR — Location de Voitures',
    description: 'Votre mobilité, notre priorité. Béjaïa & Alger.',
    locale: 'fr_DZ',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${raleway.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#F7F6F4] font-[family-name:var(--font-inter)]">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
