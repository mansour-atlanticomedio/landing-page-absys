import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const SECTIONS = ['paginas', 'bloques', 'navegacion', 'medios']
const FLAGS = ['read', 'write', 'delete']
const COLUMNS = SECTIONS.flatMap((s) => FLAGS.map((f) => `permissions_${s}_${f}`))

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "users" ${COLUMNS.map((c) => `ADD COLUMN "${c}" boolean`).join(', ')};`))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "users" ${COLUMNS.map((c) => `DROP COLUMN "${c}"`).join(', ')};`))
}
