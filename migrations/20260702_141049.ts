import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Eliminamos el tipo si se quedó colgado del intento fallido anterior, y lo recreamos limpio
    DROP TYPE IF EXISTS "public"."enum_header_type";
    CREATE TYPE "public"."enum_header_type" AS ENUM('0', '1', '2');

    -- 2. Eliminamos el valor por defecto numérico antiguo
    ALTER TABLE "header" ALTER COLUMN "type" DROP DEFAULT;

    -- 3. Cambiamos el tipo de dato pasando por 'text'
    ALTER TABLE "header" ALTER COLUMN "type" SET DATA TYPE "public"."enum_header_type" USING "type"::text::"public"."enum_header_type";

    -- 4. Aplicamos el nuevo valor por defecto del ENUM
    ALTER TABLE "header" ALTER COLUMN "type" SET DEFAULT '0'::"public"."enum_header_type";

    -- 5. Añadimos las columnas usando IF NOT EXISTS por si Payload en dev mode ya las hubiera creado
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "phone" varchar;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "email" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header" ALTER COLUMN "type" DROP DEFAULT;
    ALTER TABLE "header" ALTER COLUMN "type" SET DATA TYPE numeric USING "type"::text::numeric;
    ALTER TABLE "header" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "email";
    DROP TYPE IF EXISTS "public"."enum_header_type";
  `)
}