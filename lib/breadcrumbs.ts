export type BreadcrumbNavItem = { label?: string | null; href?: string | null }
export type BreadcrumbNavSection = { name?: string | null; href?: string | null; items?: BreadcrumbNavItem[] | null }

export type Crumb = { path: string; label: string; linkable: boolean }

const HIDDEN_PREFIXES = ['/login', '/auth', '/admin', '/api']

const stripQuery = (value: string) => value.split('#')[0].split('?')[0]
const stripSlash = (value: string) => value.replace(/\/+$/, '')

const prettify = (segment: string) => {
  let text = segment
  try {
    text = decodeURIComponent(segment)
  } catch {}
  text = text.replace(/[-_]+/g, ' ').trim()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function buildBreadcrumbs(
  pathname: string,
  navbar: BreadcrumbNavSection[],
  pageTitles: Record<string, string>,
  homeLabel = 'Inicio',
): Crumb[] {
  const path = stripSlash(stripQuery(pathname || '/')) || '/'
  if (path === '/' || HIDDEN_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return []

  const byHref = new Map<string, string>()
  const sectionByPrefix = new Map<string, string>()
  for (const section of navbar ?? []) {
    const sectionHref = section.href ? stripSlash(stripQuery(section.href)) : ''
    if (sectionHref && section.name) byHref.set(sectionHref, section.name)
    for (const item of section.items ?? []) {
      const itemHref = item.href ? stripSlash(stripQuery(item.href)) : ''
      if (!itemHref || !item.label) continue
      if (!byHref.has(itemHref)) byHref.set(itemHref, item.label)
      const first = itemHref.split('/').filter(Boolean)[0]
      if (first && section.name && !sectionHref && !sectionByPrefix.has(`/${first}`)) sectionByPrefix.set(`/${first}`, section.name)
    }
  }

  const crumbs: Crumb[] = [{ path: '/', label: homeLabel, linkable: true }]
  let current = ''
  for (const segment of path.split('/').filter(Boolean)) {
    current += `/${segment}`
    const pageTitle = pageTitles[current.slice(1)]
    const navLabel = byHref.get(current)
    crumbs.push({
      path: current,
      label: navLabel ?? pageTitle ?? sectionByPrefix.get(current) ?? prettify(segment),
      linkable: Boolean(navLabel || pageTitle),
    })
  }
  return crumbs
}
