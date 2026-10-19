import path from 'path'

type MediaOptions = {
  file: string
  alt: string
  req?: any
}

const ASSETS_DIR = path.resolve(process.cwd(), 'seeds/assets')

// Acepta un nombre dentro de seeds/assets o una ruta (relativa o absoluta)
const resolveFile = (file: string) =>
  file.includes('/') || path.isAbsolute(file) ? path.resolve(process.cwd(), file) : path.join(ASSETS_DIR, file)

export async function findOrCreateMedia(payload: any, { file, alt, req }: MediaOptions): Promise<any> {
  const filePath = resolveFile(file)
  const filename = path.basename(filePath)
  const { name, ext } = path.parse(filename)
  const reqArg = req ? { req } : {}

  const exact = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    pagination: false,
    ...reqArg,
  })
  if (exact.docs[0]) return exact.docs[0]

  // Payload añade un sufijo -N cuando el nombre ya existe
  const suffixed = await payload.find({
    collection: 'media',
    where: { filename: { like: `${name}-` } },
    limit: 50,
    depth: 0,
    ...reqArg,
  })
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`^${escape(name)}-(\\d+)${escape(ext)}$`)
  const match = suffixed.docs
    .filter((d: any) => pattern.test(d.filename ?? ''))
    .sort((a: any, b: any) => Number(a.filename.match(pattern)[1]) - Number(b.filename.match(pattern)[1]))[0]
  if (match) return match

  return payload.create({
    collection: 'media',
    data: { alt },
    filePath,
    ...reqArg,
  })
}
