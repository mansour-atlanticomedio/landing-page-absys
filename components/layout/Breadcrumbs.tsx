'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import SmartLink from '@/components/SmartLink'
import { buildBreadcrumbs, type BreadcrumbNavSection } from '@/lib/breadcrumbs'

type Props = {
  navbar: BreadcrumbNavSection[]
  pageTitles: Record<string, string>
}

export default function Breadcrumbs({ navbar, pageTitles }: Props) {
  const pathname = usePathname()
  const crumbs = buildBreadcrumbs(pathname, navbar, pageTitles)
  if (crumbs.length < 2) return null

  return (
    <nav aria-label="Ruta de navegación" className="border-b border-border bg-[hsl(var(--muted))]">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] sm:px-6">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />}
              {last ? (
                <span aria-current="page" className="font-semibold text-primary">
                  {crumb.label}
                </span>
              ) : crumb.linkable ? (
                <SmartLink href={crumb.path} className="inline-flex items-center gap-1 transition-colors hover:text-accent hover:underline">
                  {index === 0 && <Home className="size-3.5" aria-hidden />}
                  {crumb.label}
                </SmartLink>
              ) : (
                <span>{crumb.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
