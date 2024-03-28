'use client'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import '@/styles/tailwind.css'
import React from 'react'
import { EdgeStoreProvider } from './lib/edgestore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html
          lang="en"
          className={clsx(
              'h-full scroll-smooth bg-white antialiased',
              inter.variable,
              lexend.variable,
          )}
      >
      <body className="flex h-full flex-col">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <EdgeStoreProvider>
              {children}
            </EdgeStoreProvider>
          </LocalizationProvider>
          </main>
          <Footer/>
        </div>
      </body>
      </html>
  )
}