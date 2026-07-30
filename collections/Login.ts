import { CollectionConfig } from "payload";

export const Login: CollectionConfig = {
    slug: 'login',
    labels: {
        plural: 'Inicio de Sesion',
        singular: 'Inicio de Sesion'
    },
    fields: [
        {
            name: 'imageLogin',
            type: 'upload',
            relationTo: 'media'
        }
    ]
}

export const LOGIN_SLUG = 'login';