import { CollectionConfig } from "payload"

export const Email: CollectionConfig = {
    slug: 'sendEmail',
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
        {
            name: 'email',
            label: 'Email',
            type: 'email'
        },
        {
            name: 'about',
            label: 'Asunto',
            type: 'text'
        },
        {
            name: 'message',
            label: 'Mensaje',
            type: 'richText'
        },
    ],
    hooks: {
        afterChange: [
            async ({ req: { payload }, doc }) => {
                await payload.sendEmail({
                    to: 'mansourlol440@gmail.com',
                    subject: `Nuevo mensaje: ${doc.about}`,
                    html: `
            <h1>Nuevo Mensaje</h1>
            <h1>Email: ${doc.email}</h1>
            <p><strong>Nombre:</strong> ${doc.name}</p>
            <p><strong>Mensaje:</strong> ${doc.message}</p>
          `,
                })
            },
        ],
    },
}