import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import PageLoader from '@/components/PageLoader'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import { ToastContainer } from '@/components/Toast'

const BASE_URL = 'https://mpng.vercel.app'

export const viewport: Viewport = {
  themeColor: '#6C63FF',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: 'mpng',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  title: {
    default: 'mpng - Free AI Image & Video Editor Online',
    template: '%s | mpng',
  },
  description:
    'mpng by Anobyte is a free AI-powered browser image editor and video editor. Edit PNGs, remove backgrounds, blur background, change background color, upscale images, trim videos, and export instantly with no install editor required.',
  keywords: [
    'background removal',
    'remove background',
    'AI image editor',
    'photo editor online',
    'picture editor',
    'edit image online',
    'edit photo online',
    'edit picture online',
    'video editor online',
    'video editing',
    'image upscaler',
    'blur background',
    'color background',
    'PNG editor',
    'PNG editor online',
    'free photo editor',
    'free image editor',
    'browser image editor',
    'browser based editor',
    'online image editor',
    'online video editor',
    'no install editor',
    'remove.bg',
    'AI background remover',
    'object removal',
    'image blend',
    'crop image online',
    'resize image online',
    'download PNG',
    'edit PNG without install',
    'edit MP4 online',
    'trim video online',
    'photo background changer',
    'transparent background maker',
    'mpng',
    'anointedthedeveloper',
    'Anointed the Developer',
    'Anobyte',
    'anobyte',
  ],
  authors: [
    { name: 'Anointed the Developer', url: 'https://github.com/anointedthedeveloper' },
    { name: 'Anobyte', url: 'https://github.com/anointedthedeveloper' },
  ],
  creator: 'anointedthedeveloper',
  publisher: 'Anobyte',
  category: 'Photo & Video',
  classification: 'Media editing software',
  other: { brand: 'Anobyte' },
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'mpng by Anobyte',
    title: 'mpng - Free AI Image & Video Editor Online',
    description:
      'Remove backgrounds, edit PNGs, trim videos, upscale images, and change backgrounds right in the browser with no install editor required.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'mpng AI media editor by Anobyte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mpng - Free AI Image & Video Editor Online',
    description:
      'Remove backgrounds, edit PNGs, trim videos, upscale images, and more in the browser. No install editor required.',
    images: ['/opengraph-image'],
    creator: '@anointedthedev',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: { canonical: BASE_URL },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-[#060816] text-white antialiased">
        <PageLoader />
        <ServiceWorkerRegistrar />
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}
