import type { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { sectionGlobal, hideFromNonAdmins } from "@/lib/access";

export const Home: GlobalConfig = {
  slug: 'home',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Obsoleto: el inicio ahora se edita en Páginas > Inicio.',
        components: {
            elements: {
                Description: {
                    path: '/components/admin/PageEditTips',
                    clientProps: {
                        description: 'Obsoleto: el inicio ahora se edita en Páginas > Inicio.',
                        tips: 'Esta es la portada de la web. Cada pestaña edita una zona; guarda antes de salir y comprueba el resultado en la web.',
                    },
                },
            },
        }
    },
  access: sectionGlobal('paginas'),
  label: "Inicio",
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