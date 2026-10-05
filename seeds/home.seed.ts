// seeds/home.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import type { HeroCarrusel, Input, News, Media } from '@/payload-types'

const payload = await getPayload({ config })

// --- HERO CARRUSEL ---
const imageCarusel_1 = await payload.create({
  collection: 'media',
  data: { alt: 'imagen fondo' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/screen-inicio-hero.png'),
})

const imageCarusel_2 = await payload.create({
  collection: 'media',
  data: { alt: 'imagen fondo' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const imageCarusel_3 = await payload.create({
  collection: 'media',
  data: { alt: 'imagen fondo' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/Gemini_Generated_Image_pjh4c4pjh4c4pjh4.jpg'),
})

const carusselData = {
  items: [
    {
      title: 'Nueva suscripción a Scopus y Web of Science',
      description:
        'La biblioteca amplía su acceso a bases de datos científicas para toda la comunidad universitaria, disponible ya desde el catálogo online',
      image: imageCarusel_1.id,
    },
    {
      title:
        'Nueva sala de estudio en grupo',
      description:
        'Disponible desde el próximo mes en la segunda planta, pensada para trabajos en equipo y con reserva desde tu cuenta de biblioteca',
      image: imageCarusel_2.id,
    },
    {
      title:
        'Talleres gratuitos de gestión bibliográfica',
      description:
        'Aprende a usar Zotero y Mendeley para organizar tus referencias, con sesiones abiertas a todo el alumnado este trimestre',
      image: imageCarusel_3.id,
    },
  ],
}

let carruselDoc : any
try {
    carruselDoc = await payload.create({
    collection: 'hero_carrusel',
    data: carusselData,
  })
} catch (error) {
    
}

// --- INPUT BLOCK ---
let inputText: any
try {
  inputText = await payload.create({
    collection: 'input',
    data: {
      title: 'Búsqueda',
      placeholder: 'Don Quijote ...',
    },
  })
} catch (error) {
  console.error('Error input block: ', error)
}

// --- DESTACADOS (un solo doc de news, con 4 items en newsItems) ---
const imageNews: Media[] = []
for (let i = 1; i <= 4; i++) {
  const media = await payload.create({
    collection: 'media',
    data: { alt: 'imagen fondo' },
    filePath: path.resolve(process.cwd(), `seeds/assets/inicio-destacados-${i}.png`),
  })
  imageNews.push(media)
}

const destacadosDoc = await payload.create({
  collection: 'news',
  data: {
    title: 'Destacados',
    visible_cards: 4,
    style: '3',
    newsItems: [
      { title: 'Catálogo Institucional', description: ' ', tag: null, link: "/biblioteca/recursos/catalogo", image: imageNews[0].id },
      { title: 'Repositorio Académico', description: ' ', tag: null, link: "", image: imageNews[1].id },
      { title: 'Apoyo a la investigación', description: ' ', tag: null, link: "/biblioteca/investigacion", image: imageNews[2].id },
      { title: 'Servicios Bibliotecarios', description: ' ', tag: null, link: "/biblioteca/servicios", image: imageNews[3].id },
    ],
  },
})

// --- TE RECOMENDAMOS (otro doc de news, con 3 items en newsItems) ---
const imageRecomendamos: Media[] = []
for (let i = 1; i <= 3; i++) {
  const media = await payload.create({
    collection: 'media',
    data: { alt: 'imagen recomendamos' },
    filePath: path.resolve(process.cwd(), `seeds/assets/inicio-recomendamos-${i}.png`),
  })
  imageRecomendamos.push(media)
}

const recomendamosDoc = await payload.create({
  collection: 'news',
  data: {
    title: 'Te recomendamos',
    visible_cards: 3,
    style: '0',
    newsItems: [
      { title: 'eLibro: libros electrónicos', description: 'Una plataforma de libros electrónicos que abre la puerta a miles de contenidos para aprender, investigar y disfrutar de la lectura en cualquier momento', tag: null, link: null, image: imageRecomendamos[0].id },
      { title: 'Busca información científica', description: 'Explora y profundiza en tus conocimientos con recursos que te permiten buscar información científica de forma rápida y fiable', tag: null, link: null, image: imageRecomendamos[1].id },
      { title: 'Cita correctamente y evita el plagio', description: 'Utilizar fuentes de forma ética no solo respalda tus ideas, sino que también demuestra tu compromiso con la integridad académica', tag: null, link: null, image: imageRecomendamos[2].id },
    ],
  },
})

// --- LAYOUT HOME ---
try {
 await payload.updateGlobal({
  slug: 'home',
  data: {
    hero: null,
    hero_carrusel: carruselDoc.id,
    layout: [
      {
        blockType: 'input_block',
        input_relation: inputText.id,
      },
      {
        blockType: 'news_block',
        news_relation: [destacadosDoc.id],
      },
      {
        blockType: 'news_block',
        news_relation: [recomendamosDoc.id],
      },
    ],
  },
})
} catch (err: any) {
  console.log('Error en updateGlobal layout home: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)