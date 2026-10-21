import { APIError, ValidationError, type CollectionConfig } from 'payload'
import { sectionAccess } from '@/lib/access'
import { pageBlocks } from '@/blocks'
import { BASE_PATH } from '@/lib/auth/redirects'
import {
    isLockedPageSlug,
    lockedDeleteError,
    lockedUnpublishError,
    normalizePageSlug,
    resolveSlugOnSave,
    validatePageSlug,
} from '@/lib/pages'

const previewUrl = (slug?: string | null) =>
    slug ? `${BASE_PATH}/auth/preview?slug=${encodeURIComponent(slug)}` : BASE_PATH

export const Pages: CollectionConfig = {
    slug: 'pages',
    labels: { singular: 'Página', plural: 'Páginas' },
    admin: {
        group: 'Páginas',
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
        description: 'Páginas de contenido de la web: cabecera y bloques de contenido.',
        preview: (doc) => previewUrl((doc as any)?.slug),
        livePreview: {
            url: ({ data }) => previewUrl((data as any)?.slug),
        },
    },
    access: { ...sectionAccess('paginas'), readVersions: sectionAccess('paginas').read },
    hooks: {
        beforeChange: [
            ({ data, originalDoc, req }) => {
                if (!originalDoc) return data
                const query = (req as any)?.query
                const error = lockedUnpublishError({
                    slug: (originalDoc as any).slug,
                    previousStatus: (originalDoc as any)._status,
                    nextStatus: (data as any)?._status,
                    isDraftSave: query?.draft === 'true' || query?.draft === true || (req as any)?.context?.draftSave === true,
                })
                if (error) throw new APIError(error, 400, undefined, true)
                return data
            },
        ],
        beforeDelete: [
            async ({ id, req }) => {
                const doc: any = await req.payload.findByID({
                    collection: 'pages',
                    id,
                    depth: 0,
                    draft: false,
                    overrideAccess: true,
                    req,
                })
                const error = lockedDeleteError(doc?.slug)
                if (error) throw new APIError(error, 400, undefined, true)
            },
        ],
    },
    versions: {
        drafts: { autosave: { interval: 800 } },
        maxPerDoc: 20,
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Ruta',
            type: 'text',
            required: true,
            unique: true,
            index: true,
            admin: {
                position: 'sidebar',
                description: 'Ruta de la página sin barra inicial, p. ej. "conocenos/equipo". Solo minúsculas, números y guiones.',
            },
            access: {
                update: ({ doc }) => !isLockedPageSlug((doc as any)?.slug),
            },
            hooks: {
                beforeValidate: [
                    ({ value, data, siblingData }) => {
                        const status = (data as any)?._status ?? (siblingData as any)?._status
                        const { slug, error } = resolveSlugOnSave(value, status)
                        if (error) {
                            throw new ValidationError({ errors: [{ path: 'slug', message: error }] })
                        }
                        return slug
                    },
                ],
            },
            validate: (value: unknown) => validatePageSlug(normalizePageSlug(value)),
        },
        {
            name: 'meta_description',
            label: 'Descripción para buscadores',
            type: 'textarea',
            admin: {
                position: 'sidebar',
                description: 'Texto breve que se muestra en los resultados de búsqueda.',
            },
        },
        {
            name: 'hero',
            label: 'Sección principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false,
        },
        {
            name: 'hero_variant',
            label: 'Estilo de cabecera',
            type: 'select',
            defaultValue: 'simple',
            required: true,
            options: [
                { label: 'Cabecera simple', value: 'simple' },
                { label: 'Cabecera dividida (texto + imagen)', value: 'split' },
            ],
            admin: {
                components: {
                    Field: {
                        path: '/components/admin/fields/VisualSelectField',
                        clientProps: {
                            preview: 'heroVariant',
                            contentFields: { title: 'title' },
                            options: [
                                { value: 'simple', title: 'Simple', description: 'Título y subtítulo sobre fondo blanco' },
                                { value: 'split', title: 'Dividida', description: 'Texto a la izquierda e imagen a la derecha' },
                            ],
                        },
                    },
                },
            },
        },
        {
            name: 'layout',
            label: 'Contenido',
            labels: { singular: 'Bloque', plural: 'Bloques' },
            type: 'blocks',
            blocks: pageBlocks,
            admin: { description: 'Añade, ordena y elimina los bloques de contenido de esta página.', initCollapsed: true },
        },
    ],
}
