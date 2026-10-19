import type { Block } from 'payload'
import { withBlockImage } from '../images'
import { StatsBlock } from './StatsBlock'
import { SpeakersBlock } from './SpeakersBlock'
import { AboutBlock } from './AboutBlock'
import { InputBlock } from './InputBlock'
import { FeaturesBlock } from './FeaturesBlock'
import { NewsBlock } from './NewsBlock'
import { BlogsBlock } from './BlogsBlock'
import { TimelineBlock } from './TimelineBlock'
import { PartnersBlock } from './PartnersBlock'
import { CtaBlock } from './CtaBlock'
import { FaqBlock } from './FaqBlock'

export const layoutBlocks: Block[] = [
    StatsBlock,
    SpeakersBlock,
    AboutBlock,
    InputBlock,
    FeaturesBlock,
    NewsBlock,
    BlogsBlock,
    TimelineBlock,
    PartnersBlock,
    CtaBlock,
    FaqBlock,
].map(withBlockImage)
