import React from 'react'
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
      <body className='max-w-7xl min-h-screen flex flex-col bg-background' >
        <Header/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
