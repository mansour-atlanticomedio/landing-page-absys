import { CollectionConfig } from "payload";

export const Login: CollectionConfig = {
    slug: 'login_page',
    labels: {
        plural: 'Inicio de Sesion',
        singular: 'Inicio de Sesion'
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'imageLogin',
            type: 'upload',
            relationTo: 'media'
        }
    ]
}

export const LOGIN_SLUG = 'login_page';