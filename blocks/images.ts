import type { Block } from 'payload'
import { BASE_PATH } from '@/lib/auth/redirects'

export const BLOCK_IMAGE_FILES: Record<string, string> = {}

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
