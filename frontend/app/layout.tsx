import type { Metadata, Viewport } from 'next'
import { Manrope, Unbounded } from 'next/font/google'
import { ConsentProvider } from '@/components/site/consent-provider'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-unbounded',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'SimanDev — сайты и лендинги под ключ, которые продают',
  description:
    'SimanDev — команда разработки. Премиальный дизайн, анимации и разработка сайтов, лендингов и веб-приложений под ключ. От брифа до запуска на домене в короткие сроки.',
  keywords: [
    'разработка сайтов',
    'лендинг под ключ',
    'веб-приложение',
    'создание сайтов',
    'дизайн сайта',
    'SimanDev',
  ],
  authors: [{ name: 'SimanDev' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'SimanDev',
    title: 'SimanDev — сайты и лендинги под ключ, которые продают',
    description:
      'Премиальный дизайн, анимации и разработка сайтов и лендингов под ключ. От брифа до запуска в короткие сроки.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SimanDev — сайты и лендинги под ключ',
    description:
      'Премиальный дизайн, анимации и разработка сайтов и лендингов под ключ.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  // Matches the --background token (oklch(0.16 0.015 275)) from globals.css.
  themeColor: '#1a1830',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`dark ${manrope.variable} ${unbounded.variable}`}>
      <body className="bg-background font-sans antialiased">
        <ConsentProvider>{children}</ConsentProvider>
      </body>
    </html>
  )
}
