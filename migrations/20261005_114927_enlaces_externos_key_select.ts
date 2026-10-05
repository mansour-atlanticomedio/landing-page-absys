import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// El campo "key" era texto libre, así que puede haber filas con un valor que no está en el
// enum nuevo (en dev había una fila con key='catalogo', creada a mano desde el admin antes de
// que este campo tuviera una lista cerrada de opciones) — el cast directo enum reventaría con
// esa fila. Se remapea el único valor libre conocido (catalogo→opac) antes del cast; cualquier
// otro valor pasa igual, así que si producción tiene otras keys libres hay que añadirlas aquí
// antes de aplicar esta migración allí (comprobar con SELECT key FROM layout_enlaces_externos)
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "layout_enlaces_externos" SET "key" = CASE "key"
    WHEN 'catalogo' THEN 'opac'
    ELSE "key"
  END;
  CREATE TYPE "public"."enum_layout_enlaces_externos_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "layout_enlaces_externos" ALTER COLUMN "key" SET DATA TYPE "public"."enum_layout_enlaces_externos_key" USING "key"::"public"."enum_layout_enlaces_externos_key";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "layout_enlaces_externos" ALTER COLUMN "key" SET DATA TYPE varchar;
  UPDATE "layout_enlaces_externos" SET "key" = CASE "key"
    WHEN 'opac' THEN 'catalogo'
    ELSE "key"
  END;
  DROP TYPE "public"."enum_layout_enlaces_externos_key";`)
}
