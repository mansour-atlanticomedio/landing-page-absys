import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ADD COLUMN "subtitle_rt" jsonb;
  UPDATE "hero" SET "subtitle_rt" = jsonb_build_object(
    'root', jsonb_build_object(
      'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
      'children', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr', 'textFormat', 0,
            'children', CASE WHEN l.line = '' THEN '[]'::jsonb ELSE jsonb_build_array(
              jsonb_build_object('type', 'text', 'text', l.line, 'detail', 0, 'format', 0, 'mode', 'normal', 'style', '', 'version', 1)
            ) END
          ) ORDER BY l.ord
        )
        FROM unnest(regexp_split_to_array(replace("hero"."subtitle", E'\r', ''), E'\n')) WITH ORDINALITY AS l(line, ord)
      )
    )
  )
  WHERE "subtitle" IS NOT NULL AND btrim("subtitle") <> '';
  ALTER TABLE "hero" DROP COLUMN "subtitle";
  ALTER TABLE "hero" RENAME COLUMN "subtitle_rt" TO "subtitle";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ADD COLUMN "subtitle_txt" varchar;
  UPDATE "hero" SET "subtitle_txt" = (
    SELECT string_agg(
      coalesce((SELECT string_agg(c->>'text', '') FROM jsonb_array_elements(p->'children') AS c), ''),
      E'\n'
    )
    FROM jsonb_array_elements("hero"."subtitle"->'root'->'children') AS p
  )
  WHERE "subtitle" IS NOT NULL;
  ALTER TABLE "hero" DROP COLUMN "subtitle";
  ALTER TABLE "hero" RENAME COLUMN "subtitle_txt" TO "subtitle";`)
}
