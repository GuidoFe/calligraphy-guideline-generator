import './sass/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Guidesheet Generator',
  description: 'Generator for calligraphy guides',
  icons: [
    {rel: 'icon', url: '/favicon.svg'}
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://analytics.umami.is/script.js" data-website-id="1d8fb17f-45a0-4cde-807b-e1dc74657846"></script>
      </head>
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
