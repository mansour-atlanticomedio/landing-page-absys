import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "logincampus_service_dni_idx";
  DROP INDEX IF EXISTS "logincampus_service_numero_carnet_idx";
  ALTER TABLE "logincampus_service" ADD COLUMN IF NOT EXISTS "fecha_registro" timestamp(3) with time zone;
  ALTER TABLE "logincampus_service" ADD COLUMN IF NOT EXISTS "ultima_sesion" timestamp(3) with time zone;
  UPDATE "logincampus_service" SET "fecha_registro" = "created_at" WHERE "fecha_registro" IS NULL;
  UPDATE "logincampus_service" SET "ultima_sesion" = "updated_at"
    WHERE "ultima_sesion" IS NULL AND "updated_at" > "created_at";
  ALTER TABLE "logincampus_service" DROP COLUMN IF EXISTS "dni";
  ALTER TABLE "logincampus_service" DROP COLUMN IF EXISTS "numero_carnet";
  ALTER TABLE "logincampus_service" DROP COLUMN IF EXISTS "max_prestamos";
  ALTER TABLE "logincampus_service" DROP COLUMN IF EXISTS "dias_prestamo";`)
}

// Lossy: los datos de dni, carnet y préstamos eliminados no se pueden recuperar (las columnas vuelven vacías)
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logincampus_service" ADD COLUMN IF NOT EXISTS "dni" varchar;
  ALTER TABLE "logincampus_service" ADD COLUMN IF NOT EXISTS "numero_carnet" varchar;
  ALTER TABLE "logincampus_service" ADD COLUMN IF NOT EXISTS "max_prestamos" numeric;
  ALTER TABLE "logincampus_service" ADD COLUMN IF NOT EXISTS "dias_prestamo" numeric;
  CREATE UNIQUE INDEX IF NOT EXISTS "logincampus_service_dni_idx" ON "logincampus_service" USING btree ("dni");
  CREATE UNIQUE INDEX IF NOT EXISTS "logincampus_service_numero_carnet_idx" ON "logincampus_service" USING btree ("numero_carnet");
  ALTER TABLE "logincampus_service" DROP COLUMN IF EXISTS "fecha_registro";
  ALTER TABLE "logincampus_service" DROP COLUMN IF EXISTS "ultima_sesion";`)
}
