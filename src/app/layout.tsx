import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - UF Work Group',
    default: 'Work Group',
  },
  description:
      'Work Group',
}

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
  feedback,
  comments,
}: {
  children: React.ReactNode;
  feedback: React.ReactNode;
  comments: React.ReactNode;
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
        {children}{feedback}{comments}  
      </body>
      </html>
  )
}