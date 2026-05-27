import Stadistics from './Stadistics'
import About from './About'
import CTA from './CTA'
import Features from './Features'
import Speakers from './Speakers'
import Timeline from './Timeline'
import FAQ from './FAQ'
import News from './News'
import Blogs from './Blogs'
import Partners from './Partners'

const componentsMap: Record<string, React.ElementType> = {
  'stats_block': ({ stats_relation }) => {
    const data = stats_relation?.[0]

    if (!data) return null
    console.log(data)

    return <Stadistics {...data} />
  },
  'about_block': ({ about_relation }) => {
    const data = about_relation?.[0]

    if (!data) return null

    return <About {...data} />
  },
  'features_block': ({ features_relation }) => {
    const data = features_relation?.[0]

    if (!data) return null
    return <Features {...data} />
  },
  'news_block': ({ news_relation }) => {
    const data = news_relation?.[0]

    if (!data) return null
    return <News {...data} />
  },
  'blogs_block': ({ blogs_relation }) => {
    const data = blogs_relation?.[0]

    if (!data) return null
    return <Blogs {...data} />
  },
  'cta_block': ({ cta_relation }) => {
    const data = cta_relation?.[0]

    if (!data) return null
    return <CTA {...data} />
  },
  'speakers_block': ({ speakers_relation }) => {
    const data = speakers_relation?.[0]

    if (!data) return null
    return <Speakers {...data} />
  },
  'timeline_block': ({ timeline_relation }) => {
    const data = timeline_relation?.[0]

    if (!data) return null
    return <Timeline  {...data} />
  },
  'partners_block': ({ partners_relation }) => {
    const data = partners_relation?.[0]

    if (!data) return null
    return <Partners  {...data} />
  },
  'faq_block': ({ faq_relation }) => {
    const data = faq_relation?.[0]

    if (!data) return null
    return <FAQ  {...data} />
  },
}

interface BlockProps {
  blockType: string
  blockName?: string
  id?: string
  [key: string]: any
}

interface RenderBlocksProps {
  blocks: BlockProps[]
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType, id } = block

        const Component = componentsMap[blockType]

        if (!Component) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Bloque creado en Payload pero no registrado en el frontend: "${blockType}"`)
          }
          return null
        }

        const key = id || `${blockType}-${index}`

        return (
          <section key={key} data-block-type={blockType}>
            <Component {...block} />
          </section>
        )
      })}
    </>
  )
}