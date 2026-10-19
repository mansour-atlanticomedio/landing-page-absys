import { GlobalConfig } from "payload";
import { layoutBlocks } from "@/blocks";
import { adminOnlyGlobal } from "@/lib/access";

export const Formation : GlobalConfig = {
    slug: "formation",
    admin: {
        group: 'Páginas',
        description: 'Página de formación: cabecera, textos, enlaces y guías.'
    },
    access: adminOnlyGlobal,
    label: "Formación",
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
      name: 'buscar_parrafo_1',
      label: 'Buscar y evaluar información — párrafo 1',
      type: 'textarea',
    },
    {
      name: 'buscar_parrafo_2',
      label: 'Buscar y evaluar información — párrafo 2',
      type: 'textarea',
    },
    {
      name: 'enlaces_rapidos',
      label: 'Enlaces rápidos',
      labels: {
        singular: 'Enlace',
        plural: 'Enlaces',
      },
      type: 'array',
      minRows: 0,
      maxRows: 4,
      fields: [
        {
          name: 'label',
          label: 'Texto',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          label: 'Enlace',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'citar_cta',
      label: 'Citar correctamente y evitar el plagio (CTA)',
      type: 'relationship',
      relationTo: 'cta',
      hasMany: false,
    },
    {
      name: 'guias_tutoriales',
      label: 'Guías y tutoriales',
      type: 'relationship',
      relationTo: 'electronic_resources_access',
      hasMany: false,
    },
    {
      name: 'actividades_texto',
      label: 'Actividades formativas — texto',
      type: 'textarea',
    },
    {
      name: 'actividades_estado',
      label: 'Actividades formativas — estado actual',
      type: 'text',
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