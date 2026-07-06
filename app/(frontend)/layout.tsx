import React from 'react'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import FooterSimple from '@/components/layout/FooterSimple'
import { getClient } from '@/lib/payload'
import './styles.css'
import Footer from '@/components/layout/Footer'

export const dynamic = 'force-dynamic';

export const metadata = {
  description: 'Bienvenido a la biblioteca de la universidad atlantico medio',
  title: 'Biblioteca UNAM',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payload = await getClient()
  const layoutPage = await payload.findGlobal({
    slug: 'layout' as never,
    draft: false,
    depth: 2
  }) as any

  const headerData = layoutPage?.header
  const footerData = layoutPage?.footer

  return (
    <html lang="en">
      <body className='min-h-screen flex flex-col bg-background' >
        <Toaster />
        {
          headerData &&
          <Header {...headerData} />
        }
        <main>{children}</main>
        {
          footerData &&
          <Footer {...footerData} />
        }
      </body>
    </html>
  )
}
