// seeds/header.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Footer, Media } from '@/payload-types'
import { findOrCreateMedia } from './lib/media'
import { DSPACE_URL_POR_DEFECTO } from '@/lib/links'

const payload = await getPayload({ config })

const logo = await findOrCreateMedia(payload, { file: 'unam-color-full.png', alt: 'imagen fondo' })

const headerData = {
    "logo": logo.id,
    "phone": "+34 123 456 789",
    "email": "biblioteca@atlanticomedio.es",
    "navbar": [
        {
            "name": "inicio",
            "to": "/",
            "items": []
        },
        {
            "name": "conocenos",
            "to": null,
            "items": [
                {
                    "to": "/conocenos/quienes-somos",
                    "label": "Quiénes somos"
                },
                {
                    "to": "/conocenos/horarios-ubicacion-y-contacto",
                    "label": "Horarios, ubicación y contacto"
                },
                {
                    "to": "/conocenos/normativa-y-condiciones-de-uso",
                    "label": "Normativa y condiciones de uso"
                }
            ]
        },
        {
            "name": "servicios",
            "to": "/servicios",
            "items": []
        },
        {
            "name": "recursos",
            "to": null,
            "items": [
                {
                    "to": "/recursos/catalogo",
                    "label": "Catálogo"
                },
                {
                    "to": "/recursos/recursos-electronicos",
                    "label": "Recursos electrónicos"
                },
                {
                    "tipo": "registro" as const,
                    "enlace_key": "dspace" as const,
                    "label": "Repositorio institucional"
                }
            ]
        },
        {
            "name": "investigación",
            "to": "/investigacion",
            "items": []
        },
        {
            "name": "formacion",
            "to": "/formacion",
            "items": []
        }
    ],
}

type SocialIcon = NonNullable<Footer['social_medias']>[number]['icon']

const footerData = {
    "type": '1' as Footer['type'],
    "logo": logo.id,
    "social_medias": [
        {
            "icon": "FaFacebook" as SocialIcon,
            "tipo": "registro" as const,
            "enlace_key": "facebook" as const
        },
        {
            "icon": "FaTwitter" as SocialIcon,
            "tipo": "registro" as const,
            "enlace_key": "twitter" as const
        },
        {
            "icon": "FaYoutube" as SocialIcon,
            "tipo": "registro" as const,
            "enlace_key": "youtube" as const
        }
    ],
    "seccion_info": [
        {
            "title": "Servicio de biblioteca",
            "information": [
                {
                    "icon": null,
                    "label": "Carretera de Quilmes, 37 · 35017 Tafira Baja · Las Palmas de Gran Canaria",
                    "url": "https://www.atlanticomedio.es/biblioteca"
                },
                {
                    "icon": null,
                    "label": "Horario de atención: L-V 9:00-14:00 h",
                    "url": null
                },
                {
                    "icon": null,
                    "label": "+34 828 019 019",
                    "url": "https://www.atlanticomedio.es/biblioteca"
                },
                {
                    "icon": null,
                    "label": "biblioteca@atlanticomedio.es",
                    "url": "https://www.atlanticomedio.es/biblioteca"
                }
            ]
        }
    ],
    "legal_advice": "https://www.atlanticomedio.es/biblioteca",
    "privacy_policie": "https://www.atlanticomedio.es/biblioteca",
    "privacy_cookies": "https://www.atlanticomedio.es/biblioteca",
}

try {
    const layoutPrevio: any = await payload.findGlobal({ slug: 'layout', depth: 0 })
    const headerPrevio = layoutPrevio.header?.id ?? layoutPrevio.header
    const footerPrevio = layoutPrevio.footer?.id ?? layoutPrevio.footer

    const headerDoc = headerPrevio
        ? await payload.update({ collection: 'header', id: headerPrevio, data: headerData, depth: 0 })
        : await payload.create({ collection: 'header', data: headerData, depth: 0 })

    const footerDoc = footerPrevio
        ? await payload.update({ collection: 'footer', id: footerPrevio, data: footerData, depth: 0 })
        : await payload.create({ collection: 'footer', data: footerData, depth: 0 })

    // Solo se añaden las keys que aún no existan en el registro, para no pisar lo editado en el admin
    const layoutActual: any = await payload.findGlobal({ slug: 'layout', depth: 0 })
    const enlacesActuales: any[] = layoutActual.enlaces_externos ?? []
    const enlacesSeed = [
        { key: 'dspace', label: 'Repositorio institucional', url: DSPACE_URL_POR_DEFECTO },
        { key: 'facebook', label: 'Facebook', url: 'https://www.atlanticomedio.es/biblioteca' },
        { key: 'twitter', label: 'Twitter / X', url: 'https://www.atlanticomedio.es/biblioteca' },
        { key: 'youtube', label: 'YouTube', url: 'https://www.atlanticomedio.es/biblioteca' },
    ]
    const enlacesNuevos = enlacesSeed.filter((e) => !enlacesActuales.some((a) => a.key === e.key))

    await payload.updateGlobal({
        slug: 'layout',
        data: {
            header: headerDoc.id,
            footer: footerDoc.id,
            enlaces_externos: [
                ...enlacesActuales.map(({ id, ...resto }) => resto),
                ...enlacesNuevos,
            ],
        } as any,
    })
} catch (err: any) {
    console.log("Error: ", JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
