// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Upload File - Modern',
  description: 'Upload file kamu dan dapatkan link download-nya!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gradient-to-tr from-sky-100 via-white to-indigo-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
