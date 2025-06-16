import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'SayItLoud - Share Your Thoughts',
    template: '%s | SayItLoud',
  },
  description:
    'Join the conversation on SayItLoud, a platform for sharing ideas, connecting with others, and discovering new perspectives. Post your thoughts, engage with a vibrant community, and explore trending topics.',
  keywords: [
    'social media',
    'community',
    'discussion',
    'thoughts',
    'ideas',
    'blogging',
    'networking',
  ],
  authors: [{ name: 'SayItLoud Team' }],
  openGraph: {
    title: 'SayItLoud - Share Your Thoughts',
    description:
      'Join the conversation on SayItLoud, a platform for sharing ideas, connecting with others, and discovering new perspectives.',
    url: 'https://sayitloud.vercel.app', // Replace with your actual domain
    siteName: 'SayItLoud',
    images: [
      {
        url: '/og-image.png', // Create and add an Open Graph image to your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SayItLoud - Share Your Thoughts',
    description:
      'Join the conversation on SayItLoud, a platform for sharing ideas, connecting with others, and discovering new perspectives.',
    images: ['/twitter-image.png'], // Create and add a Twitter image to your public folder
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
