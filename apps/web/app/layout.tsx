import type { Metadata, Viewport } from 'next'
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
  title: {
    default: 'mpng — Free AI Image & Video Editor Online',
    template: '%s | mpng',
  },
  description:
    'mpng by Anobyte — free AI-powered image and video editor. Background removal, photo editing, picture editing, blur background, color background, upscale images, video trimming — all in the browser. No installs. Powered by remove.bg AI.',
  keywords: [
    'background removal', 'remove background', 'AI image editor', 'photo editor online',
    'picture editor', 'edit image online', 'edit photo online', 'edit picture online',
    'video editor online', 'video editing', 'image upscaler', 'blur background',
    'color background', 'PNG editor', 'MP4 editor', 'free photo editor',
    'mpng', 'anointedthedeveloper', 'Anointed the Developer',
    'Anobyte', 'anobyte', 'browser image editor', 'no install editor',
    'remove.bg', 'AI background remover', 'object removal', 'image blend',
  ],
  authors: [
    { name: 'Anointed the Developer', url: 'https://github.com/anointedthedeveloper' },
    { name: 'Anobyte', url: 'https://github.com/anointedthedeveloper' },
  ],
  creator: 'anointedthedeveloper',
  publisher: 'Anobyte',
  category: 'Photo & Video',
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'mpng by Anobyte',
    title: 'mpng — Free AI Image & Video Editor Online',
    description: 'Remove backgrounds, edit photos, trim videos, upscale images — all free in your browser. Powered by Anobyte.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'mpng AI media editor by Anobyte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mpng — Free AI Image & Video Editor Online',
    description: 'Remove backgrounds, edit photos, trim videos, upscale images — all free in your browser. By Anobyte.',
    images: ['/og-image.png'],
    creator: '@anointedthedev',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: BASE_URL },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#060816] text-white antialiased">
        <PageLoader />
        <ServiceWorkerRegistrar />
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}
