import type { Block, CollectionConfig } from 'payload'
import { cloneFields } from '@/lib/clone-fields'
import { Statistics } from '@/collections/Statistics'
import { About } from '@/collections/About'
import { Features } from '@/collections/Features'
import { Timeline } from '@/collections/Timeline'
import { Input } from '@/collections/Input'
import { CTA } from '@/collections/CTA'
import { FAQ } from '@/collections/FAQ'
import { NewsCollection } from '@/collections/News'
import { BlogsCollection } from '@/collections/Blogs'
import { Speakers } from '@/collections/Speakers'
import { PartnersCollection } from '@/collections/Partners'
import { HeroCarrusel } from '@/collections/HeroCarrusel'

const inlineBlock = (slug: string, interfaceName: string, singular: string, plural: string, source: CollectionConfig): Block => ({
    slug,
    interfaceName,
    labels: { singular, plural },
    fields: cloneFields(source.fields),
})

export const inlineBlocks: Block[] = [
    inlineBlock('hero_carousel_inline_block', 'HeroCarouselInlineBlock', 'Carrusel principal', 'Carruseles principales', HeroCarrusel),
    inlineBlock('stats_inline_block', 'StatsInlineBlock', 'Estadísticas', 'Estadísticas', Statistics),
    inlineBlock('about_inline_block', 'AboutInlineBlock', 'Información (texto)', 'Información (texto)', About),
    inlineBlock('features_inline_block', 'FeaturesInlineBlock', 'Características', 'Características', Features),
    inlineBlock('news_inline_block', 'NewsInlineBlock', 'Noticias', 'Noticias', NewsCollection),
    inlineBlock('blogs_inline_block', 'BlogsInlineBlock', 'Blogs', 'Blogs', BlogsCollection),
    inlineBlock('timeline_inline_block', 'TimelineInlineBlock', 'Línea del tiempo', 'Líneas del tiempo', Timeline),
    inlineBlock('speakers_inline_block', 'SpeakersInlineBlock', 'Ponentes', 'Ponentes', Speakers),
    inlineBlock('partners_inline_block', 'PartnersInlineBlock', 'Patrocinadores', 'Patrocinadores', PartnersCollection),
    inlineBlock('cta_inline_block', 'CtaInlineBlock', 'Llamada a la inscripción', 'Llamadas a la inscripción', CTA),
    inlineBlock('faq_inline_block', 'FaqInlineBlock', 'Preguntas frecuentes (propias)', 'Preguntas frecuentes (propias)', FAQ),
    inlineBlock('input_inline_block', 'InputInlineBlock', 'Buscador', 'Buscadores', Input),
]
