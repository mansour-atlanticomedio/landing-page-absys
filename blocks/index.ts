import type { Block } from 'payload'
import { conocenosBlocks } from './conocenos'
import { layoutBlocks } from './layout'
import { LocationBlock } from './conocenos/LocationBlock'
import { FaqSectionBlock } from './conocenos/FaqSectionBlock'
import { inlineBlocks } from './inline'
import { ServiceCardsBlock } from './paginas/ServiceCardsBlock'
import { FormationContentBlock } from './paginas/FormationContentBlock'
import { InvestigationContentBlock } from './paginas/InvestigationContentBlock'
import { ElectronicResourcesBlock } from './paginas/ElectronicResourcesBlock'
import { withBlockImage } from './images'

export { conocenosBlocks, layoutBlocks }

export const pageBlocks: Block[] = [...conocenosBlocks, LocationBlock, FaqSectionBlock, ...inlineBlocks, ServiceCardsBlock, FormationContentBlock, InvestigationContentBlock, ElectronicResourcesBlock].map(withBlockImage)
