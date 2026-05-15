import { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: 'home',
  label: "Inicio",
  fields: [
    {
      name: 'hero',
      type: 'relationship',
      relationTo: 'hero',
      hasMany: false
    },
    {
      name: 'layout',
      label: 'Estructura',
      type: 'blocks',
      blocks: [
        {
          slug: 'statistics_home',
          labels: {
            singular: 'Estadística',
            plural: 'Estadísticas',
          },
          fields: [
            {
              name: 'stats_relation',
              type: 'relationship',
              relationTo: 'statistics',
              hasMany: true,
            },
          ]
        },
        {
          slug: 'speakers_home',
          labels: {
            singular: 'Ponentes',
            plural: 'Ponentes'
          },
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'speakers_home_relation',
              type: 'relationship',
              relationTo: 'speakers',
              hasMany: true,
            },
          ],
        },
        {
          slug: 'about_home',
          labels: {
            singular: 'Sobre Nosotros',
            plural: 'Sobre Nosotros'
          },
          fields: [
            {
              name: 'about_home_relation',
              type: 'relationship',
              relationTo: 'about',
              hasMany: true,
            },
          ],
        },
        {
          slug: 'features_home',
          labels: {
            singular: 'Caracteristicas',
            plural: 'Caracteristicas',
          },
          fields: [
            {
              name: 'features_relation',
              type: 'relationship',
              relationTo: 'features',
              hasMany: true,
            },
          ]
        },
        {
          slug: 'timeline_home',
          labels: {
            singular: 'Linea del tiempo',
            plural: 'Linea del tiempo'
          },
          fields: [
            {
              name: 'timeline_relation',
              type: 'relationship',
              relationTo: 'timeline',
              hasMany: true,
            },
          ]
        },
        {
           admin: {
            images: {
              thumbnail: '/images/blocks/cta_thumbnail.jpeg'
            }
          },
          slug: 'cta_home',
          labels: {
            singular: 'CTA',
            plural: 'CTA'
          },
          fields: [
            {
              name: 'cta_relation',
              type: 'relationship',
              relationTo: 'cta',
              hasMany: true,
            },
          ]
        },
        {
          slug: 'faq_home',
          labels: {
            singular: 'FAQ',
            plural: 'FAQ'
          },
          fields: [
            {
              name: 'faq_relation',
              type: 'relationship',
              relationTo: 'faq',
              hasMany: true,
            },
          ]
        },
      ],
    },
  ],
}