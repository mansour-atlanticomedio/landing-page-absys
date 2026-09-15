// seeds/heroCarrusel.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const imageScopus = await payload.create({
  collection: 'media',
  data: { alt: 'imagen fondo' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/screen-inicio-hero.png'),
})

const imageSalaEstudio = await payload.create({
  collection: 'media',
  data: { alt: 'imagen fondo' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

// Placeholder hasta que se suba el asset real (Gemini_Generated_Image_pjh4c4pjh4c4pjh4.jpg)
// generado desde el admin, que no existe en este entorno de desarrollo.
const imageTaller = await payload.create({
  collection: 'media',
  data: { alt: 'imagen taller universitaria' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const carruselData = {
  items: [
    {
      title: 'Nueva suscripción a Scopus y Web of Science',
      description:
        'La biblioteca amplía su acceso a bases de datos científicas para toda la comunidad universitaria, disponible ya desde el catálogo online',
      image: imageScopus.id,
    },
    {
      title: 'Nueva sala de estudio en grupo',
      description:
        'Disponible desde el próximo mes en la segunda planta, pensada para trabajos en equipo y con reserva desde tu cuenta de biblioteca',
      image: imageSalaEstudio.id,
    },
    {
      title: 'Talleres gratuitos de gestión bibliográfica',
      description:
        'Aprende a usar Zotero y Mendeley para organizar tus referencias, con sesiones abiertas a todo el alumnado este trimestre',
      image: imageTaller.id,
    },
  ],
}

try {
  const carruselDoc = await payload.create({
    collection: 'hero_carrusel',
    data: carruselData,
  })

  await payload.updateGlobal({
    slug: 'home',
    data: {
      hero_carrusel: carruselDoc.id,
    },
  })
} catch (err: any) {
  console.log('Error en hero_carrusel: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
