import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const payload = await getClient()
  const layoutPage = (await payload.findGlobal({
    slug: 'layout' as never,
    draft: false,
    depth: 2,
  })) as any

  const headerData = layoutPage?.header
  const footerData = layoutPage?.footer

  return (
    <>
      {headerData && <Header {...headerData} />}
      <main>{children}</main>
      {footerData && <Footer {...footerData} />}
    </>
  )
}