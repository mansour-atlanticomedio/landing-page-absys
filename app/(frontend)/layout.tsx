import React from 'react'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import FooterSimple from '@/components/layout/FooterSimple'
import './styles.css'

export const metadata = {
  description: 'Bienvenido a la biblioteca de la universidad atlantico medio',
  title: 'Biblioteca UNAM',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className='min-h-screen flex flex-col bg-background' >
        <Toaster/>
        <Header/>
        <main>{children}</main>
        <FooterSimple/>
      </body>
    </html>
  )
}
