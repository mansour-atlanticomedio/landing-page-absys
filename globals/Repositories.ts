import type { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { sectionGlobal, hideFromNonAdmins } from "@/lib/access";

export const Repositories: GlobalConfig = {
    slug: 'repository',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Obsoleto: Repositorios ahora se edita en Páginas > Repositorios.'
    },
    access: sectionGlobal('paginas'),
    label: 'Repositorios',
    fields: [
        {
            name: 'hero',
            label: 'Sección principal',
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