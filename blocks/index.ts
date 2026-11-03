import type { Block } from 'payload'
import { conocenosBlocks } from './conocenos'
import { layoutBlocks } from './layout'
import { LocationBlock } from './conocenos/LocationBlock'
import { FaqSectionBlock } from './conocenos/FaqSectionBlock'
import { withBlockImage } from './images'

export { conocenosBlocks, layoutBlocks }

export const pageBlocks: Block[] = [...conocenosBlocks, LocationBlock, FaqSectionBlock].map(withBlockImage)
