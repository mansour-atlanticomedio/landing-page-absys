import type { ComponentType } from 'react'
import { CardsStylePreview, CardsStyleThumb } from './CardsStylePreview'
import { FooterTypePreview, FooterTypeThumb } from './FooterTypePreview'
import { HeroVariantPreview, HeroVariantThumb } from './HeroVariantPreview'
import { ImagePositionPreview, ImagePositionThumb } from './ImagePositionPreview'
import { NewsStylePreview, NewsStyleThumb } from './NewsStylePreview'
import { ScheduleTypePreview, ScheduleTypeThumb } from './ScheduleTypePreview'
import type { PreviewProps, ThumbProps } from './shared'

export type PreviewEntry = {
  Thumb: ComponentType<ThumbProps>
  Preview: ComponentType<PreviewProps>
}

export const PREVIEWS: Record<string, PreviewEntry> = {
  newsStyle: { Thumb: NewsStyleThumb, Preview: NewsStylePreview },
  footerType: { Thumb: FooterTypeThumb, Preview: FooterTypePreview },
  heroVariant: { Thumb: HeroVariantThumb, Preview: HeroVariantPreview },
  cardsStyle: { Thumb: CardsStyleThumb, Preview: CardsStylePreview },
  scheduleType: { Thumb: ScheduleTypeThumb, Preview: ScheduleTypePreview },
  imagePosition: { Thumb: ImagePositionThumb, Preview: ImagePositionPreview },
}
