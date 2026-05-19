import React from 'react'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className='min-h-screen flex flex-col bg-background' >
        <Toaster/>
        <Header/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
