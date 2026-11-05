import React from 'react'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getClient } from '@/lib/payload'
import { resolveNavbar, resolveFooterLinks, resolveEnlace } from '@/lib/links'
import { getSession } from '@/lib/auth/session'
import { resolveCookieTexts } from '@/lib/cookie-texts'
import BackToTop from "@/components/BackToTop";
import CookieConsent from '@/components/cookies/CookieConsent'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

import '../styles.css'
import { montserrat } from '@/lib/fonts'

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

  const cookiesGlobal = (await payload.findGlobal({ slug: 'cookies' as never, draft: false, depth: 0 }).catch(() => null)) as any
  const cookieTexts = resolveCookieTexts(cookiesGlobal)

  const enlaces = layoutPage?.enlaces_externos
  const rawHeader = layoutPage?.header
  const rawFooter = layoutPage?.footer

  // Los enlaces (interno/ancla/registro/externo) se resuelven aquí para que los componentes solo pinten
  const headerData = rawHeader && {
    ...rawHeader,
    navbar: resolveNavbar(rawHeader.navbar, enlaces),
    logoLink: resolveEnlace(rawHeader.logo_link, enlaces),
  }
  const footerData = rawFooter && { ...rawFooter, ...resolveFooterLinks(rawFooter, enlaces) }

  const cookiePolicy = resolveEnlace(cookiesGlobal?.policy_link, enlaces)
  if (!cookiePolicy.href && footerData?.privacy_cookies) {
    const fallback = footerData.privacy_cookies as string
    const external = /^https?:\/\//i.test(fallback)
    Object.assign(cookiePolicy, { href: fallback, external, newTab: external })
  }

  const publishedPages = await payload
    .find({ collection: 'pages' as never, where: { _status: { equals: 'published' } }, limit: 200, depth: 0, pagination: false, select: { title: true, slug: true } } as any)
    .catch(() => ({ docs: [] as any[] }))
  const pageTitles: Record<string, string> = Object.fromEntries((publishedPages.docs as any[]).map((d) => [d.slug, d.title]))

  const session = await getSession()
  const account = session ? { email: session.email, nombre: session.nombre } : null

  return (
    <html lang="es" className={montserrat.variable}>
      <body className="min-h-screen flex flex-col bg-background">
        <Toaster />
        {headerData && <Header {...headerData} account={account} />}
        {headerData && <Breadcrumbs navbar={headerData.navbar} pageTitles={pageTitles} />}
        <main>{children}</main>
        {footerData && <Footer {...footerData} />}
        <BackToTop />
        <CookieConsent policy={cookiePolicy} texts={cookieTexts} />
      </body>
    </html>
  )
}