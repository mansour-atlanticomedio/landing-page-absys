import type { CollectionConfig } from "payload";

const books = [
    {
        idTitulo: "TIT-009281",
        titulo: "Clean Code: A Handbook of Agile Software Craftsmanship",
        autor: "Robert C. Martin",
        isbn: "9780132350884",
        editorial: "Prentice Hall",
        anioPublicacion: "2008",
        materia: ["Ingeniería del software", "Programación (Ordenadores)"]
    },
    {
        idTitulo: "TIT-004123",
        titulo: "Designing Data-Intensive Applications",
        autor: "Martin Kleppmann",
        isbn: "9781449373320",
        editorial: "O'Reilly Media",
        anioPublicacion: "2017",
        materia: ["Bases de datos", "Arquitectura de software"]
    }
];

export const Library: CollectionConfig = {
    slug: 'library',
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
            path: '/catalogo/buscar',
            method: 'get',
            handler: async (req) => {
                return Response.json({
                    message: 'No hay ningún libro por aquí',
                });
            },
        },
        {
            path: '/:name',
            method: 'get',
            handler: async (req) => {
                const nameParam = req.routeParams?.name || '';
                const name = decodeURIComponent(nameParam.toString());

                console.log("Buscando por nombre:", name);

                const filteredBooks = books.filter((book) =>
                    book.titulo.toLowerCase().includes(name.toLowerCase()) ||
                    book.autor.toLowerCase().includes(name.toLowerCase())
                );

                return Response.json(filteredBooks);
            }
        },
        {
            path: '/',
            method: 'get',
            handler: async (req) => {

                console.log("Mostrando todos los libros");

                return Response.json(books);
            }
        }
    ]
};