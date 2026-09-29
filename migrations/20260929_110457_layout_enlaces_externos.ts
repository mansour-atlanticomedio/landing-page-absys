import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "layout_enlaces_externos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "layout_enlaces_externos" ADD CONSTRAINT "layout_enlaces_externos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layout"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "layout_enlaces_externos_order_idx" ON "layout_enlaces_externos" USING btree ("_order");
  CREATE INDEX "layout_enlaces_externos_parent_id_idx" ON "layout_enlaces_externos" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "layout_enlaces_externos" CASCADE;`)
}
