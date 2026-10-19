import type { Block } from 'payload'
import { conocenosBlocks } from './conocenos'
import { layoutBlocks } from './layout'
import { withBlockImage } from './images'

export { conocenosBlocks, layoutBlocks }

export const pageBlocks: Block[] = [...conocenosBlocks].map(withBlockImage)
