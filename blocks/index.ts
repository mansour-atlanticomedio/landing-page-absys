import type { Block } from 'payload'
import { conocenosBlocks } from './conocenos'
import { layoutBlocks } from './layout'
import { LocationBlock } from './conocenos/LocationBlock'
import { withBlockImage } from './images'

export { conocenosBlocks, layoutBlocks }

export const pageBlocks: Block[] = [...conocenosBlocks, LocationBlock].map(withBlockImage)
