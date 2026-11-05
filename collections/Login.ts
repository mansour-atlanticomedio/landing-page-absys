import { CollectionConfig } from "payload";
import { sectionAccessPublic } from "@/lib/access";

export const Login: CollectionConfig = {
    slug: 'login_page',
    admin: {
        group: 'Configuración del sitio',
        description: 'Imagen de la pantalla de inicio de sesión.'
    },
    labels: {
        plural: 'Pantalla de inicio de sesión',
        singular: 'Pantalla de inicio de sesión'
    },
    access: sectionAccessPublic('paginas'),
    fields: [
        {
            name: 'imageLogin',
            type: 'upload',
            relationTo: 'media'
        }
    ]
}

export const LOGIN_SLUG = 'login_page';