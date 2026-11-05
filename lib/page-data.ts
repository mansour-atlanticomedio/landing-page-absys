import { cache } from "react"
import { lexicalToPlainText } from "@/lib/rich-text"
import { draftMode, headers } from "next/headers"
import type { Metadata } from "next"
import { getClient } from "@/lib/payload"

export type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: PageSearchParams
}

export const toSlug = (segments: string[]) =>
  segments
    .map((s) => {
      try {
        return decodeURIComponent(s)
      } catch {
        return s
      }
    })
    .join("/")
    .toLowerCase()

export const getPage = cache(async (slug: string, isDraft: boolean) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: "pages" as never,
    where: {
      slug: { equals: slug },
      ...(isDraft ? {} : { _status: { equals: "published" } }),
    },
    limit: 1,
    depth: 3,
    draft: isDraft,
  } as any)
  return ((res as any).docs?.[0] ?? null) as any
})

export const resolveIsDraft = async (searchParams: PageSearchParams) => {
  if (!(await draftMode()).isEnabled) return false
  const inIframe = (await headers()).get("sec-fetch-dest") === "iframe"
  const preview = (await searchParams).preview === "1"
  return inIframe || preview
}

export async function buildPageMetadata(slug: string, searchParams: PageSearchParams): Promise<Metadata> {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(slug, isDraft)
  if (!page) return {}
  const heroSubtitle = typeof page.hero === "object" && page.hero ? lexicalToPlainText(page.hero.subtitle) : undefined
  return {
    title: `${page.title} – Biblioteca UNAM`,
    description: page.meta_description || heroSubtitle || undefined,
    ...(isDraft ? { robots: { index: false, follow: false } } : {}),
  }
}
