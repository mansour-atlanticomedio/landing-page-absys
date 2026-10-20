import { APIError, type CollectionBeforeDeleteHook } from 'payload'
import { sql } from '@payloadcms/db-postgres/drizzle'

const toLabel = (table: string) => table.replace(/_rels$/, '').replace(/_/g, ' ')

export const blockDeleteIfMediaInUse: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const db = (req.payload.db as any).drizzle
  if (!db) return

  const fks = await db.execute(sql`
    select c.conrelid::regclass::text as tbl, a.attname as col
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
    where c.confrelid = 'media'::regclass and c.contype = 'f'
  `)

  const used = new Set<string>()
  for (const { tbl, col } of fks.rows as { tbl: string; col: string }[]) {
    const name = tbl.replace(/"/g, '')
    if (name.startsWith('_') || name.startsWith('payload_')) continue
    const found = await db.execute(
      sql`select 1 from ${sql.identifier(name)} where ${sql.identifier(col)} = ${id} limit 1`,
    )
    if (found.rows.length > 0) used.add(toLabel(name))
  }

  if (used.size > 0) {
    throw new APIError(
      `Esta imagen se está usando en: ${[...used].join(', ')}. Cámbiala o quítala allí antes de eliminarla.`,
      400,
      undefined,
      true,
    )
  }
}
