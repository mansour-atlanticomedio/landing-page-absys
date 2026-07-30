import React from 'react'
import { Toaster } from 'sonner'
import '../styles.css'

export const metadata = {
  title: 'Biblioteca UNAM',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background">
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  )
}