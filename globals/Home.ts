import type { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: 'home',
  label: "Inicio",
  fields: [
    {
      name: 'hero',
      label: 'Seccion Principal',
      type: 'relationship',
      relationTo: 'hero',
      hasMany: false,
    },
    {
      name: 'layout',
      labels: {
        singular: 'bloque',
        plural: 'bloques'
      },
      label: 'Bloques',
      type: 'blocks',
      blocks: [
        {
          slug: 'stats_block',
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
          slug: 'speakers_block',
          labels: {
            singular: 'Ponentes',
            plural: 'Ponentes'
          },
          fields: [
            {
              name: 'speakers_relation',
              type: 'relationship',
              relationTo: 'speakers',
              hasMany: true,
            },
          ],
        },
        {
          slug: 'about_block',
          labels: {
            singular: 'Sobre Nosotros',
            plural: 'Sobre Nosotros'
          },
          fields: [
            {
              name: 'about_relation',
              type: 'relationship',
              relationTo: 'about',
              hasMany: true,
            },
          ],
        },
        {
          slug: 'features_block',
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
          slug: 'news_block',
          labels: {
            singular: 'Noticias',
            plural: 'Noticias',
          },
          fields: [
            {
              name: 'news_relation',
              type: 'relationship',
              relationTo: 'news',
              hasMany: true,
            },
          ]
        },
        {
          slug: 'blogs_block',
          labels: {
            singular: 'Blogs',
            plural: 'Blogs',
          },
          fields: [
            {
              name: 'blogs_relation',
              type: 'relationship',
              relationTo: 'blogs',
              hasMany: true,
            },
          ]
        },
        {
          slug: 'timeline_block',
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
          slug: 'partners_block',
          labels: {
            singular: 'Patrocinador',
            plural: 'Patrocinadores',
          },
          fields: [
            {
              name: 'partners_relation',
              type: 'relationship',
              relationTo: 'partners',
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
          slug: 'cta_block',
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
          slug: 'faq_block',
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