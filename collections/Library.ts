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
            path: '/search',
            method: 'get',
            handler: async (req) => {
                const url = new URL(req.url || '');
                const titulo = url.searchParams.get('titulo')?.toLowerCase() || '';
                const autor = url.searchParams.get('autor')?.toLowerCase() || '';
                const isbn = url.searchParams.get('isbn')?.toLowerCase() || '';
                const editorial = url.searchParams.get('editorial')?.toLowerCase() || '';
                const anio = url.searchParams.get('anio')?.toLowerCase() || '';
                const materia = url.searchParams.get('materia')?.toLowerCase() || '';
                const name = url.searchParams.get('name')?.toLowerCase() || '';

                const filteredBooks = books.filter((book) => {
                    if (name && !book.titulo.toLowerCase().includes(name) && !book.autor.toLowerCase().includes(name)) {
                        return false;
                    }
                    if (titulo && !book.titulo.toLowerCase().includes(titulo)) {
                        return false;
                    }
                    if (autor && !book.autor.toLowerCase().includes(autor)) {
                        return false;
                    }
                    if (isbn && !book.isbn.toLowerCase().includes(isbn)) {
                        return false;
                    }
                    if (editorial && !book.editorial.toLowerCase().includes(editorial)) {
                        return false;
                    }
                    if (anio && !book.anioPublicacion.toLowerCase().includes(anio)) {
                        return false;
                    }
                    if (materia && !book.materia.some((m) => m.toLowerCase().includes(materia))) {
                        return false;
                    }
                    return true;
                });

                return Response.json(filteredBooks);
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