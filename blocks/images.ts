import type { Block } from 'payload'
import { BASE_PATH } from '@/lib/auth/redirects'

export const BLOCK_IMAGE_FILES: Record<string, string> = {
    stats_block: 'stats_block.png',
    speakers_block: 'speakers_block.png',
    about_block: 'about_block.png',
    cta_block: 'cta_block.png',
    faq_block: 'faq_block.png',
    features_block: 'features_block.png',
    cards_features_block: 'features_block-1.png',
    input_block: 'input_block.png',
    news_block: 'news_block.png',
    partners_block: 'partners_block.png',
    timeline_block: 'timeline_block.png',
}

export const withBlockImage = (block: Block): Block => {
    const file = BLOCK_IMAGE_FILES[block.slug]
    if (!file) return block
    const label = block.labels?.singular
    return {
        ...block,
        imageURL: `${BASE_PATH}/admin-blocks/${file}`,
        imageAltText: typeof label === 'string' ? label : block.slug,
    }
}
