import { CollectionConfig } from "payload";
import { adminOnly } from "@/lib/access";

export const Input: CollectionConfig = {
    slug: 'input',
    access: adminOnly,
    labels: {
        singular: 'Entrada de texto',
        plural: 'Entrada de texto'
    },
    fields: [
        {
            name: 'title',
            label: 'Titulo',
            type: 'text'
        },
        {
            name: 'placeholder',
            label: 'Texto de ejemplo',
            type: 'text'
        }
    ]
}