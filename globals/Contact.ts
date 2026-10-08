import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const Contact: GlobalConfig = {
    slug: 'contact',
    access: adminOnlyGlobal,
    label: "Contacto",
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        }
    ]
}