import type { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { sectionGlobal } from "@/lib/access";

export const Repositories: GlobalConfig = {
    slug: 'repository',
    admin: {
        group: 'Páginas',
        description: 'Página de repositorios: cabecera y bloques de contenido.'
    },
    access: sectionGlobal('paginas'),
    label: 'Repositorios',
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
        {
            name: 'layout',
            label: 'Bloque',
            labels: {
                singular: 'bloque',
                plural: 'bloques'
            },
            type: 'blocks',
            blocks: layoutBlocks,
        },
    ]
}