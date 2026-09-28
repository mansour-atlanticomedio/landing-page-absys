import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_logincampus_service_colectivo" AS ENUM('ALUMN', 'PDI', 'PAS', 'EXT');
  CREATE TABLE "logincampus_service_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "logincampus_service" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"absys_id" varchar,
  	"dni" varchar,
  	"nombre" varchar,
  	"apellidos" varchar,
  	"numero_carnet" varchar,
  	"colectivo" "enum_logincampus_service_colectivo" DEFAULT 'ALUMN' NOT NULL,
  	"max_prestamos" numeric,
  	"dias_prestamo" numeric,
  	"is_offline_data" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "logincampus_service_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "logincampus_service_id" integer;
  ALTER TABLE "logincampus_service_sessions" ADD CONSTRAINT "logincampus_service_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."logincampus_service"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "logincampus_service_sessions_order_idx" ON "logincampus_service_sessions" USING btree ("_order");
  CREATE INDEX "logincampus_service_sessions_parent_id_idx" ON "logincampus_service_sessions" USING btree ("_parent_id");
  CREATE INDEX "logincampus_service_absys_id_idx" ON "logincampus_service" USING btree ("absys_id");
  CREATE UNIQUE INDEX "logincampus_service_dni_idx" ON "logincampus_service" USING btree ("dni");
  CREATE UNIQUE INDEX "logincampus_service_numero_carnet_idx" ON "logincampus_service" USING btree ("numero_carnet");
  CREATE INDEX "logincampus_service_updated_at_idx" ON "logincampus_service" USING btree ("updated_at");
  CREATE INDEX "logincampus_service_created_at_idx" ON "logincampus_service" USING btree ("created_at");
  CREATE UNIQUE INDEX "logincampus_service_email_idx" ON "logincampus_service" USING btree ("email");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_logincampus_service_fk" FOREIGN KEY ("logincampus_service_id") REFERENCES "public"."logincampus_service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_logincampus_service_fk" FOREIGN KEY ("logincampus_service_id") REFERENCES "public"."logincampus_service"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_logincampus_service_id_idx" ON "payload_locked_documents_rels" USING btree ("logincampus_service_id");
  CREATE INDEX "payload_preferences_rels_logincampus_service_id_idx" ON "payload_preferences_rels" USING btree ("logincampus_service_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logincampus_service_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "logincampus_service" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "logincampus_service_sessions" CASCADE;
  DROP TABLE "logincampus_service" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_logincampus_service_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_logincampus_service_fk";
  
  DROP INDEX "payload_locked_documents_rels_logincampus_service_id_idx";
  DROP INDEX "payload_preferences_rels_logincampus_service_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "logincampus_service_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "logincampus_service_id";
  DROP TYPE "public"."enum_logincampus_service_colectivo";`)
}
