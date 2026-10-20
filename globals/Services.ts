import { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { contentGlobal } from "@/lib/access";

export const Services : GlobalConfig = {
    slug: "services",
    admin: {
        group: 'Páginas',
        description: 'Página de servicios: cabecera, carrusel y bloques de contenido.'
    },
    access: contentGlobal,
    label: "Servicios",
    fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cabecera',
          fields: [
    {
      name: 'hero',
      label: 'Seccion Principal',
      admin: { description: 'Cabecera con imagen, título y subtítulo de la página.' },
      type: 'relationship',
      relationTo: 'hero',
      hasMany: false,
    },
    {
      name: 'hero_carrusel',
      label: 'Seccion de Carrusel Principal',
      type: 'relationship',
      relationTo: 'hero_carrusel',
      hasMany: false,
    },
          ],
        },
        {
          label: 'Bloques',
          fields: [
    {
      name: 'layout',
      labels: {
        singular: 'bloque',
        plural: 'bloques'
      },
      label: 'Bloques',
      type: 'blocks',
      blocks: layoutBlocks,
    },
          ],
        },
      ],
    },
  ],
}