import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_hero_variant" ADD VALUE IF NOT EXISTS 'carousel';
  ALTER TYPE "public"."enum__pages_v_version_hero_variant" ADD VALUE IF NOT EXISTS 'carousel';
  ALTER TABLE "pages" ADD COLUMN "hero_carousel_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_carousel_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_carousel_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carousel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_carousel_id_hero_carrusel_id_fk" FOREIGN KEY ("version_hero_carousel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_carousel_idx" ON "pages" USING btree ("hero_carousel_id");
  CREATE INDEX "_pages_v_version_version_hero_carousel_idx" ON "_pages_v" USING btree ("version_hero_carousel_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_carousel_id_hero_carrusel_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_carousel_id_hero_carrusel_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DEFAULT 'simple'::text;
  DROP TYPE "public"."enum_pages_hero_variant";
  CREATE TYPE "public"."enum_pages_hero_variant" AS ENUM('simple', 'split', 'banner');
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DEFAULT 'simple'::"public"."enum_pages_hero_variant";
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DATA TYPE "public"."enum_pages_hero_variant" USING "hero_variant"::"public"."enum_pages_hero_variant";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DEFAULT 'simple'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_variant";
  CREATE TYPE "public"."enum__pages_v_version_hero_variant" AS ENUM('simple', 'split', 'banner');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DEFAULT 'simple'::"public"."enum__pages_v_version_hero_variant";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DATA TYPE "public"."enum__pages_v_version_hero_variant" USING "version_hero_variant"::"public"."enum__pages_v_version_hero_variant";
  DROP INDEX "pages_hero_carousel_idx";
  DROP INDEX "_pages_v_version_version_hero_carousel_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_carousel_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_carousel_id";`)
}
