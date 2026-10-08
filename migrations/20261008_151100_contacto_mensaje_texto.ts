import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Postgres no admite subconsultas en USING de ALTER COLUMN TYPE, así que se pasa por una columna
// temporal. El richText antiguo era un árbol Lexical (o un string plano en jsonb): se conserva el
// texto. Cada hijo de root es un párrafo (se unen con \n) y los nodos linebreak de dentro de un
// párrafo producen \n entre sus textos, en orden de documento
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "send_email" ADD COLUMN IF NOT EXISTS "rol" varchar;
  ALTER TABLE "send_email" ADD COLUMN IF NOT EXISTS "message_texto" varchar;
  UPDATE "send_email" SET "message_texto" = CASE
    WHEN "message" IS NULL THEN NULL
    WHEN jsonb_typeof("message") = 'string' THEN "message" #>> '{}'
    WHEN jsonb_typeof("message" #> '{root,children}') = 'array' THEN (
      SELECT NULLIF(string_agg(p.parrafo, E'\n' ORDER BY p.ord), '')
      FROM (
        SELECT c.ord, (
          SELECT coalesce(string_agg(
            CASE WHEN n.node ->> 'type' = 'linebreak' THEN E'\n' ELSE n.node ->> 'text' END,
            '' ORDER BY n.pos
          ), '')
          FROM jsonb_path_query(c.child, 'strict $.** ? (@.type == "linebreak" || @.text != null)')
            WITH ORDINALITY AS n(node, pos)
        ) AS parrafo
        FROM jsonb_array_elements("message" #> '{root,children}') WITH ORDINALITY AS c(child, ord)
      ) p
    )
    ELSE "message"::text
  END;
  ALTER TABLE "send_email" DROP COLUMN "message";
  ALTER TABLE "send_email" RENAME COLUMN "message_texto" TO "message";`)
}

// LOSSY: el texto vuelve como string JSON plano, no como árbol Lexical (el editor richText antiguo no
// lo abriría bien), y se pierde la columna "rol" con sus datos. No se reconstruye el formato original
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "send_email" ALTER COLUMN "message" SET DATA TYPE jsonb USING to_jsonb("message");
  ALTER TABLE "send_email" DROP COLUMN "rol";`)
}
