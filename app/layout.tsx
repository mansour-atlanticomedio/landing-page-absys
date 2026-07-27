import React from 'react'
import { Toaster } from 'sonner'
import './styles.css'

export const metadata = {
  description: 'Bienvenido a la biblioteca de la universidad atlantico medio',
  title: 'Biblioteca UNAM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background">
        <Toaster />
        {children}
      </body>
    </html>
  )
}