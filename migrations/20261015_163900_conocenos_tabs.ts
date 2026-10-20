import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE IF NOT EXISTS 'Users';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE IF NOT EXISTS 'FileText';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE IF NOT EXISTS 'Library';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE IF NOT EXISTS 'Monitor';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE IF NOT EXISTS 'AlertTriangle';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE IF NOT EXISTS 'Users';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE IF NOT EXISTS 'FileText';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE IF NOT EXISTS 'Library';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE IF NOT EXISTS 'Monitor';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE IF NOT EXISTS 'AlertTriangle';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE IF NOT EXISTS 'Users';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE IF NOT EXISTS 'FileText';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE IF NOT EXISTS 'Library';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE IF NOT EXISTS 'Monitor';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE IF NOT EXISTS 'AlertTriangle';
  ALTER TYPE "public"."enum_electronic_resources_access_accesos_icon" ADD VALUE IF NOT EXISTS 'Users';
  ALTER TYPE "public"."enum_electronic_resources_access_accesos_icon" ADD VALUE IF NOT EXISTS 'FileText';
  ALTER TYPE "public"."enum_electronic_resources_access_accesos_icon" ADD VALUE IF NOT EXISTS 'Library';
  ALTER TYPE "public"."enum_electronic_resources_access_accesos_icon" ADD VALUE IF NOT EXISTS 'Monitor';
  ALTER TYPE "public"."enum_electronic_resources_access_accesos_icon" ADD VALUE IF NOT EXISTS 'AlertTriangle';`)

  await db.execute(sql`
   CREATE TYPE "public"."enum_about_us_normativa_tarjetas_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');

  CREATE TABLE "about_us_normativa_tarjetas_puntos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );

  CREATE TABLE "about_us_normativa_tarjetas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_us_normativa_tarjetas_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"badge" varchar,
  	"description" varchar,
  	"nota_titulo" varchar,
  	"nota_texto" varchar
  );

  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_hero_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_imagen_dirigidos_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_ayudas_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_dirigidos_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "horarios_hero_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "horarios_info_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_edificio_nombre" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_edificio_subtitulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_horario_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_horario_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "horarios_ubicacion_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_direccion_linea1" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_direccion_linea2" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_contacto_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_telefono" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_email" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_boton_contactar" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_boton_como_llegar" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_mapa_url" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_mapa_embed_url" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_ayuda_cta_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "normativa_hero_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "normativa_responsabilidad_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "normativa_responsabilidad_texto" varchar;
  ALTER TABLE "about_us" ADD COLUMN "normativa_pdf_texto_boton" varchar;
  ALTER TABLE "about_us" ADD COLUMN "normativa_pdf_id" integer;

  ALTER TABLE "about_us_normativa_tarjetas_puntos" ADD CONSTRAINT "about_us_normativa_tarjetas_puntos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us_normativa_tarjetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_normativa_tarjetas" ADD CONSTRAINT "about_us_normativa_tarjetas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_hero_id_hero_id_fk" FOREIGN KEY ("quienes_somos_hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_imagen_dirigidos_id_media_id_fk" FOREIGN KEY ("quienes_somos_imagen_dirigidos_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_ayudas_id_features_id_fk" FOREIGN KEY ("quienes_somos_ayudas_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_dirigidos_id_features_id_fk" FOREIGN KEY ("quienes_somos_dirigidos_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_horarios_hero_id_hero_id_fk" FOREIGN KEY ("horarios_hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_horarios_horario_id_schedule_id_fk" FOREIGN KEY ("horarios_horario_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_horarios_ayuda_cta_id_cta_id_fk" FOREIGN KEY ("horarios_ayuda_cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_normativa_hero_id_hero_id_fk" FOREIGN KEY ("normativa_hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_normativa_pdf_id_media_id_fk" FOREIGN KEY ("normativa_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "about_us_normativa_tarjetas_puntos_order_idx" ON "about_us_normativa_tarjetas_puntos" USING btree ("_order");
  CREATE INDEX "about_us_normativa_tarjetas_puntos_parent_id_idx" ON "about_us_normativa_tarjetas_puntos" USING btree ("_parent_id");
  CREATE INDEX "about_us_normativa_tarjetas_order_idx" ON "about_us_normativa_tarjetas" USING btree ("_order");
  CREATE INDEX "about_us_normativa_tarjetas_parent_id_idx" ON "about_us_normativa_tarjetas" USING btree ("_parent_id");
  CREATE INDEX "about_us_quienes_somos_quienes_somos_hero_idx" ON "about_us" USING btree ("quienes_somos_hero_id");
  CREATE INDEX "about_us_quienes_somos_quienes_somos_imagen_dirigidos_idx" ON "about_us" USING btree ("quienes_somos_imagen_dirigidos_id");
  CREATE INDEX "about_us_quienes_somos_quienes_somos_ayudas_idx" ON "about_us" USING btree ("quienes_somos_ayudas_id");
  CREATE INDEX "about_us_quienes_somos_quienes_somos_dirigidos_idx" ON "about_us" USING btree ("quienes_somos_dirigidos_id");
  CREATE INDEX "about_us_horarios_horarios_hero_idx" ON "about_us" USING btree ("horarios_hero_id");
  CREATE INDEX "about_us_horarios_horarios_horario_idx" ON "about_us" USING btree ("horarios_horario_id");
  CREATE INDEX "about_us_horarios_horarios_ayuda_cta_idx" ON "about_us" USING btree ("horarios_ayuda_cta_id");
  CREATE INDEX "about_us_normativa_normativa_hero_idx" ON "about_us" USING btree ("normativa_hero_id");
  CREATE INDEX "about_us_normativa_normativa_pdf_idx" ON "about_us" USING btree ("normativa_pdf_id");`)

  await db.execute(sql`
   INSERT INTO "about_us" ("id", "updated_at", "created_at")
  SELECT 1, now(), now() WHERE NOT EXISTS (SELECT 1 FROM "about_us");

  UPDATE "about_us" SET
    "quienes_somos_hero_id" = q."hero_id",
    "quienes_somos_imagen_dirigidos_id" = q."imagen_dirigidos_id",
    "quienes_somos_ayudas_id" = q."ayudas_id",
    "quienes_somos_dirigidos_id" = q."dirigidos_id"
  FROM (SELECT * FROM "quienes_somos" ORDER BY "id" LIMIT 1) q;

  UPDATE "about_us" SET
    "horarios_hero_id" = h."hero_id",
    "horarios_edificio_nombre" = h."edificio_nombre",
    "horarios_edificio_subtitulo" = h."edificio_subtitulo",
    "horarios_horario_id" = h."horario_id",
    "horarios_direccion_linea1" = h."direccion_linea1",
    "horarios_direccion_linea2" = h."direccion_linea2",
    "horarios_telefono" = h."telefono",
    "horarios_email" = h."email",
    "horarios_mapa_url" = h."mapa_url",
    "horarios_mapa_embed_url" = h."mapa_embed_url",
    "horarios_ayuda_cta_id" = h."ayuda_cta_id"
  FROM (SELECT * FROM "horarios_contacto" ORDER BY "id" LIMIT 1) h;

  UPDATE "about_us" SET
    "horarios_info_titulo" = COALESCE("horarios_info_titulo", 'Información General'),
    "horarios_horario_titulo" = COALESCE("horarios_horario_titulo", 'Horario de atención'),
    "horarios_ubicacion_titulo" = COALESCE("horarios_ubicacion_titulo", 'Ubicación'),
    "horarios_contacto_titulo" = COALESCE("horarios_contacto_titulo", 'Contacto Directo'),
    "horarios_boton_contactar" = COALESCE("horarios_boton_contactar", 'Contactar con la Biblioteca'),
    "horarios_boton_como_llegar" = COALESCE("horarios_boton_como_llegar", 'Cómo llegar'),
    "normativa_responsabilidad_titulo" = COALESCE("normativa_responsabilidad_titulo", 'Responsabilidad sobre los materiales'),
    "normativa_responsabilidad_texto" = COALESCE("normativa_responsabilidad_texto", 'Las personas usuarias son responsables de la conservación de los fondos y equipamientos de la Biblioteca. El deterioro, mutilación o pérdida de las obras prestadas obligará a su reposición o, en caso de estar agotadas, al pago de su valor estimado o a la entrega de una obra de similares características.'),
    "normativa_pdf_texto_boton" = COALESCE("normativa_pdf_texto_boton", 'Descargar normativa completa (PDF)');

  INSERT INTO "hero" ("background_image_id", "title", "subtitle")
  SELECT COALESCE(
      (SELECT "images_id" FROM "about_us_normativa" WHERE "images_id" IS NOT NULL ORDER BY "_order" LIMIT 1),
      (SELECT "background_image_id" FROM "hero" WHERE "id" = (SELECT "horarios_hero_id" FROM "about_us" LIMIT 1))
    ),
    'Normativa y condiciones de uso',
    'La Biblioteca Universitaria proporciona espacios, colecciones y servicios para apoyar el aprendizaje, la docencia y la investigación. El uso responsable de estos recursos garantiza un entorno óptimo para toda la comunidad académica.'
  WHERE (SELECT "normativa_hero_id" FROM "about_us" LIMIT 1) IS NULL
    AND COALESCE(
      (SELECT "images_id" FROM "about_us_normativa" WHERE "images_id" IS NOT NULL ORDER BY "_order" LIMIT 1),
      (SELECT "background_image_id" FROM "hero" WHERE "id" = (SELECT "horarios_hero_id" FROM "about_us" LIMIT 1))
    ) IS NOT NULL;

  UPDATE "about_us" SET "normativa_hero_id" = (
    SELECT "id" FROM "hero" WHERE "title" = 'Normativa y condiciones de uso' ORDER BY "id" DESC LIMIT 1
  ) WHERE "normativa_hero_id" IS NULL;

  INSERT INTO "about_us_normativa_tarjetas" ("_order", "_parent_id", "id", "icon", "title", "badge", "description", "nota_titulo", "nota_texto")
  SELECT 1, a."id", 'normativa-tarjeta-1', 'Users', 'Personas usuarias', NULL,
    'Tienen acceso a los servicios de la Biblioteca todos los miembros de la comunidad universitaria (estudiantes, PDI, PTGAS). Otras personas pueden acceder en condiciones específicas según los convenios vigentes, requiriendo acreditación mediante la tarjeta universitaria o documento equivalente.', NULL, NULL
  FROM "about_us" a WHERE NOT EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas");

  INSERT INTO "about_us_normativa_tarjetas" ("_order", "_parent_id", "id", "icon", "title", "badge", "description", "nota_titulo", "nota_texto")
  SELECT 2, a."id", 'normativa-tarjeta-2', 'FileText', 'Préstamos y renovaciones', 'Próximamente',
    'Información detallada sobre plazos, límites de ejemplares y procesos de renovación estará disponible en esta sección en la próxima actualización de la normativa.', NULL, NULL
  FROM "about_us" a WHERE NOT EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas" WHERE "id" = 'normativa-tarjeta-2');

  INSERT INTO "about_us_normativa_tarjetas" ("_order", "_parent_id", "id", "icon", "title", "badge", "description", "nota_titulo", "nota_texto")
  SELECT 3, a."id", 'normativa-tarjeta-3', 'Library', 'Espacios y recursos', NULL, NULL, NULL, NULL
  FROM "about_us" a WHERE NOT EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas" WHERE "id" = 'normativa-tarjeta-3');

  INSERT INTO "about_us_normativa_tarjetas" ("_order", "_parent_id", "id", "icon", "title", "badge", "description", "nota_titulo", "nota_texto")
  SELECT 4, a."id", 'normativa-tarjeta-4', 'Monitor', 'Recursos electrónicos', NULL,
    'El acceso a las bases de datos, revistas y libros electrónicos suscritos está sujeto a las licencias de uso firmadas con los proveedores.',
    'Restricciones importantes:',
    'Se prohíbe la descarga masiva de contenidos y el uso de los recursos para fines comerciales o ajenos a las actividades académicas de la institución.'
  FROM "about_us" a WHERE NOT EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas" WHERE "id" = 'normativa-tarjeta-4');

  INSERT INTO "about_us_normativa_tarjetas_puntos" ("_order", "_parent_id", "id", "texto")
  SELECT v."ord", 'normativa-tarjeta-3', 'normativa-punto-' || v."ord", v."texto"
  FROM (VALUES
    (1, 'Mantener un ambiente de estudio silencioso en las salas de lectura generales.'),
    (2, 'Respetar las normas de uso de las salas de trabajo en grupo (reserva previa necesaria).'),
    (3, 'No consumir alimentos o bebidas (excepto agua en envases con cierre) en las zonas de estudio.'),
    (4, 'Hacer un uso adecuado de los equipos informáticos y de reproducción.')
  ) AS v("ord", "texto")
  WHERE EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas" WHERE "id" = 'normativa-tarjeta-3')
    AND NOT EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas_puntos");`)

  await db.execute(sql`
   DROP TABLE "about_us_quienes_somos" CASCADE;
  DROP TABLE "about_us_horarios" CASCADE;
  DROP TABLE "about_us_normativa" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_us_quienes_somos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"images_id" integer
  );

  CREATE TABLE "about_us_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"images_id" integer
  );

  CREATE TABLE "about_us_normativa" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"images_id" integer
  );

  ALTER TABLE "about_us_quienes_somos" ADD CONSTRAINT "about_us_quienes_somos_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_quienes_somos" ADD CONSTRAINT "about_us_quienes_somos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_horarios" ADD CONSTRAINT "about_us_horarios_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_horarios" ADD CONSTRAINT "about_us_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_normativa" ADD CONSTRAINT "about_us_normativa_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_normativa" ADD CONSTRAINT "about_us_normativa_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_us_quienes_somos_order_idx" ON "about_us_quienes_somos" USING btree ("_order");
  CREATE INDEX "about_us_quienes_somos_parent_id_idx" ON "about_us_quienes_somos" USING btree ("_parent_id");
  CREATE INDEX "about_us_quienes_somos_images_idx" ON "about_us_quienes_somos" USING btree ("images_id");
  CREATE INDEX "about_us_horarios_order_idx" ON "about_us_horarios" USING btree ("_order");
  CREATE INDEX "about_us_horarios_parent_id_idx" ON "about_us_horarios" USING btree ("_parent_id");
  CREATE INDEX "about_us_horarios_images_idx" ON "about_us_horarios" USING btree ("images_id");
  CREATE INDEX "about_us_normativa_order_idx" ON "about_us_normativa" USING btree ("_order");
  CREATE INDEX "about_us_normativa_parent_id_idx" ON "about_us_normativa" USING btree ("_parent_id");
  CREATE INDEX "about_us_normativa_images_idx" ON "about_us_normativa" USING btree ("images_id");

  DROP TABLE "about_us_normativa_tarjetas_puntos" CASCADE;
  DROP TABLE "about_us_normativa_tarjetas" CASCADE;
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_hero_id_hero_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_imagen_dirigidos_id_media_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_ayudas_id_features_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_dirigidos_id_features_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_horarios_hero_id_hero_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_horarios_horario_id_schedule_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_horarios_ayuda_cta_id_cta_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_normativa_hero_id_hero_id_fk";
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_normativa_pdf_id_media_id_fk";
  DROP INDEX "about_us_quienes_somos_quienes_somos_hero_idx";
  DROP INDEX "about_us_quienes_somos_quienes_somos_imagen_dirigidos_idx";
  DROP INDEX "about_us_quienes_somos_quienes_somos_ayudas_idx";
  DROP INDEX "about_us_quienes_somos_quienes_somos_dirigidos_idx";
  DROP INDEX "about_us_horarios_horarios_hero_idx";
  DROP INDEX "about_us_horarios_horarios_horario_idx";
  DROP INDEX "about_us_horarios_horarios_ayuda_cta_idx";
  DROP INDEX "about_us_normativa_normativa_hero_idx";
  DROP INDEX "about_us_normativa_normativa_pdf_idx";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_hero_id";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_imagen_dirigidos_id";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_ayudas_id";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_dirigidos_id";
  ALTER TABLE "about_us" DROP COLUMN "horarios_hero_id";
  ALTER TABLE "about_us" DROP COLUMN "horarios_info_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_edificio_nombre";
  ALTER TABLE "about_us" DROP COLUMN "horarios_edificio_subtitulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_horario_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_horario_id";
  ALTER TABLE "about_us" DROP COLUMN "horarios_ubicacion_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_direccion_linea1";
  ALTER TABLE "about_us" DROP COLUMN "horarios_direccion_linea2";
  ALTER TABLE "about_us" DROP COLUMN "horarios_contacto_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_telefono";
  ALTER TABLE "about_us" DROP COLUMN "horarios_email";
  ALTER TABLE "about_us" DROP COLUMN "horarios_boton_contactar";
  ALTER TABLE "about_us" DROP COLUMN "horarios_boton_como_llegar";
  ALTER TABLE "about_us" DROP COLUMN "horarios_mapa_url";
  ALTER TABLE "about_us" DROP COLUMN "horarios_mapa_embed_url";
  ALTER TABLE "about_us" DROP COLUMN "horarios_ayuda_cta_id";
  ALTER TABLE "about_us" DROP COLUMN "normativa_hero_id";
  ALTER TABLE "about_us" DROP COLUMN "normativa_responsabilidad_titulo";
  ALTER TABLE "about_us" DROP COLUMN "normativa_responsabilidad_texto";
  ALTER TABLE "about_us" DROP COLUMN "normativa_pdf_texto_boton";
  ALTER TABLE "about_us" DROP COLUMN "normativa_pdf_id";
  DROP TYPE "public"."enum_about_us_normativa_tarjetas_icon";`)
}
