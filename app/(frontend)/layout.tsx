import React from 'react'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getClient } from '@/lib/payload'
import { resolveNavbar, resolveFooterLinks } from '@/lib/links'
import { getSession } from '@/lib/auth/session'
import '../styles.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  description: 'Bienvenido a la biblioteca de la universidad atlantico medio',
  title: 'Biblioteca UNAM',
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const payload = await getClient()
  const layoutPage = (await payload.findGlobal({
    slug: 'layout' as never,
    draft: false,
    depth: 2,
  })) as any

  const enlaces = layoutPage?.enlaces_externos
  const rawHeader = layoutPage?.header
  const rawFooter = layoutPage?.footer

  // Los enlaces (interno/ancla/registro/externo) se resuelven aquí para que los componentes solo pinten
  const headerData = rawHeader && { ...rawHeader, navbar: resolveNavbar(rawHeader.navbar, enlaces) }
  const footerData = rawFooter && { ...rawFooter, ...resolveFooterLinks(rawFooter, enlaces) }

  const session = await getSession()
  const account = session ? { email: session.email, nombre: session.nombre } : null

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background">
        <Toaster />
        {headerData && <Header {...headerData} account={account} />}
        <main>{children}</main>
        {footerData && <Footer {...footerData} />}
      </body>
    </html>
  )
}