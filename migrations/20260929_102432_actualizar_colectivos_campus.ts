import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload autogenera el cast directo enum→enum (ver PR/CLAUDE.md), pero eso revienta si hay filas
// con un valor que ya no existe en el enum nuevo (p. ej. la dev DB tenía un lector con
// colectivo='PAS'). Se remapean los valores antiguos a su equivalente antes del cast: PDI→PROFE,
// PAS→ADULT (ambos renombrados sin cambiar de institución), EXT→INVIT (mismo concepto, "externo")
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DATA TYPE text;
  ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DEFAULT 'ALUMN'::text;
  UPDATE "logincampus_service" SET "colectivo" = CASE "colectivo"
    WHEN 'PDI' THEN 'PROFE'
    WHEN 'PAS' THEN 'ADULT'
    WHEN 'EXT' THEN 'INVIT'
    ELSE "colectivo"
  END;
  DROP TYPE "public"."enum_logincampus_service_colectivo";
  CREATE TYPE "public"."enum_logincampus_service_colectivo" AS ENUM('ALUMN', 'PROFE', 'ADULT', 'INVIT', 'ANONI');
  ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DEFAULT 'ALUMN'::"public"."enum_logincampus_service_colectivo";
  ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DATA TYPE "public"."enum_logincampus_service_colectivo" USING "colectivo"::"public"."enum_logincampus_service_colectivo";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DATA TYPE text;
  ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DEFAULT 'ALUMN'::text;
  UPDATE "logincampus_service" SET "colectivo" = CASE "colectivo"
    WHEN 'PROFE' THEN 'PDI'
    WHEN 'ADULT' THEN 'PAS'
    WHEN 'INVIT' THEN 'EXT'
    WHEN 'ANONI' THEN 'ALUMN'
    ELSE "colectivo"
  END;
  DROP TYPE "public"."enum_logincampus_service_colectivo";
  CREATE TYPE "public"."enum_logincampus_service_colectivo" AS ENUM('ALUMN', 'PDI', 'PAS', 'EXT');
  ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DEFAULT 'ALUMN'::"public"."enum_logincampus_service_colectivo";
  ALTER TABLE "logincampus_service" ALTER COLUMN "colectivo" SET DATA TYPE "public"."enum_logincampus_service_colectivo" USING "colectivo"::"public"."enum_logincampus_service_colectivo";`)
}
