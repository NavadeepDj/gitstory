import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter_Tight, Space_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/context/providers'

// Configure fonts using Next.js font optimization
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

const interTight = Inter_Tight({
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
})

// Viewport configuration for proper mobile rendering
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gitstory.sitestash.org'),
  title: {
    default: 'GitStory — Your Code in Cinema | Developer Year in Review',
    template: '%s | GitStory',
  },
  description: 'Every commit tells a story. Transform your GitHub journey into a cinematic masterpiece with stunning visuals, personalized insights, and sharable snapshots. Discover your coding rhythm, celebrate your impact, and share your developer story with the world.',
  keywords: ['GitHub Wrapped', 'developer year review', 'code visualization', 'GitHub stats', 'programming journey', 'commit history', 'developer portfolio', 'github wrapped', 'coding stats', 'developer story'],
  authors: [{ name: 'GitStory Team' }],
  creator: 'GitStory',
  publisher: 'GitStory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'GitStory — Your Code in Cinema',
    description: 'Every commit tells a story. Transform your GitHub journey into a cinematic masterpiece.',
    url: 'https://gitstory.sitestash.org',
    siteName: 'GitStory',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitStory — Your Code in Cinema',
    description: 'Every commit tells a story. Transform your GitHub journey into a cinematic masterpiece.',
    creator: '@gitstory',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://gitstory.sitestash.org',
  },
  category: 'technology',
}

// Structured data for rich search results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GitStory',
  description: 'Transform your GitHub journey into a cinematic masterpiece with stunning visuals and personalized insights.',
  url: 'https://gitstory.sitestash.org',
  logo: 'https://gitstory.sitestash.org/logo.svg',
  image: 'https://gitstory.sitestash.org/logo.svg',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'GitStory',
    logo: 'https://gitstory.sitestash.org/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${interTight.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Favicons and Icons */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}