import type { CollectionConfig } from "payload";

export const OpenLibraryService: CollectionConfig = {
    slug: 'openlibrary_service',
    admin: {
        hidden: true
    },
    access: {
        create: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text'
        },
    ],
    endpoints: [
        {
            path: '/search',
            method: 'get',
            handler: async (req) => {
                

                return Response.json("");
            },
        },
        {
            path: '/:name',
            method: 'get',
            handler: async (req) => {
                const nameParam = req.routeParams?.name || '';
                const name = decodeURIComponent(nameParam.toString());

                return Response.json("");
            }
        },
        {
            path: '/',
            method: 'get',
            handler: async (req) => {

                console.log("Mostrando todos los libros");

                return Response.json("");
            }
        }
    ]
};