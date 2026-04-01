import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = 'https://mpng.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'mpng — AI-powered media editing in the browser',
    template: '%s | mpng',
  },
  description:
    'mpng is an AI-powered image and video editing platform that runs in the browser. Background removal, filters, smart cropping, and video trimming — all in one tool.',
  keywords: [
    'AI image editor',
    'background removal',
    'online video editor',
    'browser image editor',
    'AI media editing',
    'mpng',
    'Next.js editor',
    'rembg',
    'FFmpeg web',
  ],
  authors: [{ name: 'Anointed the Developer', url: 'https://github.com/anointedthedeveloper' }],
  creator: 'anointedthedeveloper',
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'mpng',
    title: 'mpng — AI-powered media editing in the browser',
    description:
      'AI-powered image and video editing platform. Background removal, filters, smart cropping, and video trimming — all in the browser.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'mpng — AI media editor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mpng — AI-powered media editing in the browser',
    description: 'Background removal, filters, smart cropping, and video trimming — all in the browser.',
    images: ['/og-image.png'],
    creator: '@anointedthedev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  )
}
