// seeds/header.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Header, Footer, Media } from '@/payload-types'

const payload = await getPayload({ config })

const headerData = {
    "type": '0' as Header['type'],
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
                    
                    "to": "http://172.23.2.44:4000/dspace",
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

const logo = await payload.create({
    collection: 'media',
    data: { alt: 'imagen fondo' },
    filePath: './seeds/assets/unam-color-full.png',
})

type SocialIcon = NonNullable<Footer['social_medias']>[number]['icon']

const footerData = {
    "type": '1' as Footer['type'],
    "logo": logo.id,
    "social_medias": [
        {
            "icon": "FaFacebook" as SocialIcon,
            "link": "https://www.atlanticomedio.es/biblioteca"
        },
        {
            "icon": "FaTwitter" as SocialIcon,
            "link": "https://www.atlanticomedio.es/biblioteca"
        },
        {
            "icon": "FaYoutube" as SocialIcon,
            "link": "https://www.atlanticomedio.es/biblioteca"
        }
    ],
    "seccion_info": [
        {
            "title": "Servicio de biblioteca",
            "information": [
                {
                    "icon": null,
                    "label": "Carretera de Quílmes, 37 · 35017 Tafira Baja · Las Palmas de Gran Canaria",
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
    const headerDoc = await payload.create({
        collection: 'header',
        data: headerData,
    })
    
    const footerDoc = await payload.create({
        collection: 'footer',
        data: footerData,
    })
    
    await payload.updateGlobal({
        slug: 'layout',
        data: {
            header: headerDoc.id,
            footer: footerDoc.id,
        },
    })
} catch (err: any) {
    console.log("Error: ", JSON.stringify(err.data?.errors ?? err, null, 2))
}
