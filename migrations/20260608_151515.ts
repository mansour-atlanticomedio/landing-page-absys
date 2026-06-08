import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news_news_items" ALTER COLUMN "tag" DROP NOT NULL;
  ALTER TABLE "news_news_items" ADD COLUMN "link" varchar;
  ALTER TABLE "news" ADD COLUMN "visible_cards" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news_news_items" ALTER COLUMN "tag" SET NOT NULL;
  ALTER TABLE "news_news_items" DROP COLUMN "link";
  ALTER TABLE "news" DROP COLUMN "visible_cards";`)
}
