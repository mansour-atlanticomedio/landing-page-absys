import { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { sectionGlobal } from "@/lib/access";

export const Investigation : GlobalConfig = {
    slug: 'investigation',
    admin: {
        group: 'Páginas',
        description: 'Página de investigación: cabecera, accesos rápidos y tarjetas.'
    },
    access: sectionGlobal('paginas'),
    label: "Investigación",
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
          label: 'Contenido',
          fields: [
    {
      name: 'accesos_rapidos',
      label: 'Accesos rápidos',
      type: 'relationship',
      relationTo: 'features',
      hasMany: false,
    },
    {
      name: 'tarjetas',
      label: 'Tarjetas de contenido',
      type: 'relationship',
      relationTo: 'electronic_resources_access',
      hasMany: false,
    },
    {
      name: 'cta',
      label: 'Solicitar apoyo (CTA)',
      type: 'relationship',
      relationTo: 'cta',
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