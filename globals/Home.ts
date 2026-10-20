import type { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { adminOnlyGlobal } from "@/lib/access";

export const Home: GlobalConfig = {
  slug: 'home',
    admin: {
        group: 'Páginas',
        description: 'Página de inicio: cabecera, carrusel y bloques de contenido.',
        components: {
            elements: {
                Description: {
                    path: '/components/admin/PageEditTips',
                    clientProps: {
                        description: 'Página de inicio: cabecera, carrusel y bloques de contenido.',
                        tips: 'Esta es la portada de la web. Cada pestaña edita una zona; guarda antes de salir y comprueba el resultado en la web.',
                    },
                },
            },
        }
    },
  access: adminOnlyGlobal,
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