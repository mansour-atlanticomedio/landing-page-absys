import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "solicitud_compra" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "solicitud_compra" ADD CONSTRAINT "solicitud_compra_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "solicitud_compra_hero_idx" ON "solicitud_compra" USING btree ("hero_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "solicitud_compra" CASCADE;`)
}
