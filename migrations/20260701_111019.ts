import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_footer_type" AS ENUM('0', '1', '2');
    CREATE TYPE "public"."enum_footer_simple_social_media_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
    CREATE TYPE "public"."enum_footer_simple_type" AS ENUM('0', '1', '2');
    
    ALTER TABLE "footer_simple_social_media" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_footer_simple_social_media_icon" USING "icon"::"public"."enum_footer_simple_social_media_icon";
    
    -- Primero convertimos el tipo de dato pasando por text (ya que es numeric originalmente)
    ALTER TABLE "footer_simple" ALTER COLUMN "type" SET DATA TYPE "public"."enum_footer_simple_type" USING "type"::text::"public"."enum_footer_simple_type";
    
    -- Ahora que la columna ya es del tipo ENUM, le aplicamos el default correcto
    ALTER TABLE "footer_simple" ALTER COLUMN "type" SET DEFAULT '0'::"public"."enum_footer_simple_type";
    
    ALTER TABLE "footer" ADD COLUMN "type" "enum_footer_type" DEFAULT '0';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Primero quitamos el DEFAULT para evitar conflictos al cambiar el tipo
    ALTER TABLE "footer_simple" ALTER COLUMN "type" DROP DEFAULT;
    
    ALTER TABLE "footer_simple_social_media" ALTER COLUMN "icon" SET DATA TYPE varchar;
    ALTER TABLE "footer_simple" ALTER COLUMN "type" SET DATA TYPE numeric;
    ALTER TABLE "footer" DROP COLUMN "type";
    
    DROP TYPE "public"."enum_footer_type";
    DROP TYPE "public"."enum_footer_simple_social_media_icon";
    DROP TYPE "public"."enum_footer_simple_type";
  `)
}
