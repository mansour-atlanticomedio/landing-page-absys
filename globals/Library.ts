import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const Library : GlobalConfig = {
    slug: 'library',
    access: adminOnlyGlobal,
    label: 'Biblioteca',
    fields: [
        {
            name: 'hero',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        }
    ]
}