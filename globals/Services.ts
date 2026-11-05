import { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { sectionGlobal, hideFromNonAdmins } from "@/lib/access";

export const Services : GlobalConfig = {
    slug: "services",
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Obsoleto: Servicios ahora se edita en Páginas > Servicios.'
    },
    access: sectionGlobal('paginas'),
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
      label: 'Sección principal',
      admin: { description: 'Cabecera con imagen, título y subtítulo de la página.' },
      type: 'relationship',
      relationTo: 'hero',
      hasMany: false,
    },
    {
      name: 'hero_carrusel',
      label: 'Carrusel principal',
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