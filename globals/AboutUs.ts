import { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const AboutUs : GlobalConfig = {
    slug: 'about_us',
    admin: {
        group: 'Páginas',
        description: 'Imágenes de la sección Conócenos (quiénes somos, horarios y normativa).'
    },
    access: adminOnlyGlobal,
    label: "Conocenos",
    fields: [
        {
            name: "quienes_somos",
            label: 'Quienes Somos',
            type: "array",
            fields: [
                {
                    name: 'images',
                    type: 'upload',
                    relationTo: "media"
                }
            ]
        },
        {
            name: "horarios",
            label: "Horarios",
            type: "array",
            fields: [
                {
                    name: 'images',
                    type: 'upload',
                    relationTo: "media"
                }
            ]
        },
        {
            name: "normativa",
            label: "Normativa",
            type: "array",
            fields: [
                {
                    name: 'images',
                    type: 'upload',
                    relationTo: "media"
                }
            ]
        },
    ]
}