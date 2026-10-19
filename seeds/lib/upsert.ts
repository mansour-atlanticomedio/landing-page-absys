type UpsertOptions = {
  collection: string
  data: any
  where?: Record<string, any>
}

// Busca por una clave natural (por defecto `title`) y actualiza si existe; si no, crea. Evita duplicados al repetir el seed
export async function upsertDoc(payload: any, { collection, data, where }: UpsertOptions): Promise<any> {
  const filter = where ?? { title: { equals: data.title } }
  const found = await payload.find({
    collection,
    where: filter,
    limit: 1,
    depth: 0,
    pagination: false,
    sort: 'createdAt',
  })
  if (found.docs[0]) {
    return payload.update({ collection, id: found.docs[0].id, data, depth: 0 })
  }
  return payload.create({ collection, data, depth: 0 })
}
