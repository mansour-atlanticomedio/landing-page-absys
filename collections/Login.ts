import { CollectionConfig } from "payload";
import { publicReadAdminWrite } from "@/lib/access";

export const Login: CollectionConfig = {
    slug: 'login_page',
    labels: {
        plural: 'Inicio de Sesion',
        singular: 'Inicio de Sesion'
    },
    access: publicReadAdminWrite,
    fields: [
        {
            name: 'imageLogin',
            type: 'upload',
            relationTo: 'media'
        }
    ]
}

export const LOGIN_SLUG = 'login_page';