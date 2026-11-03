import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cookies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner_title" varchar DEFAULT 'Política de Cookies' NOT NULL,
  	"banner_tagline" varchar DEFAULT 'Las galletas, mejor con leche… y con tu permiso.' NOT NULL,
  	"banner_text" varchar DEFAULT 'Este sitio web de la Universidad del Atlántico Medio utiliza cookies propias y de terceros, que almacenan y recuperan información cuando navegas. Las cookies pueden tener finalidades diversas, por ejemplo, reconocerte como usuario, obtener información sobre tus hábitos de navegación, respetando tu privacidad, o personalizar la forma en que se muestra el contenido. Puedes elegir las cookies que deseas o aceptarlas todas o rechazarlas todas. Este banner se mantendrá activo hasta que elijas una de las tres opciones. Para obtener información más detallada, puedes acceder a nuestra' NOT NULL,
  	"banner_link_label" varchar DEFAULT 'Política de cookies' NOT NULL,
  	"banner_button_configure" varchar DEFAULT 'Configurar cookies' NOT NULL,
  	"banner_button_reject_all" varchar DEFAULT 'Rechazar todas' NOT NULL,
  	"banner_button_accept_all" varchar DEFAULT 'Aceptar todas' NOT NULL,
  	"preferences_title" varchar DEFAULT 'Preferencias de Cookies' NOT NULL,
  	"preferences_subtitle" varchar DEFAULT 'Universidad del Atlántico Medio' NOT NULL,
  	"preferences_text" varchar DEFAULT 'Gestiona tus preferencias de consentimiento para las diferentes categorías de cookies que utilizamos en nuestro portal. Puedes habilitar o deshabilitar cada categoría según tus preferencias, excepto las estrictamente necesarias. Para más detalles, consulta nuestra' NOT NULL,
  	"preferences_link_label" varchar DEFAULT 'Política de cookies' NOT NULL,
  	"preferences_close_label" varchar DEFAULT 'Cerrar configuración' NOT NULL,
  	"preferences_technical_title" varchar DEFAULT 'Cookies técnicas o estrictamente necesarias' NOT NULL,
  	"preferences_technical_text" varchar DEFAULT 'Son aquellas indispensables para el funcionamiento correcto de la web, la seguridad, la navegación básica y la gestión de sesiones. No se pueden desactivar en nuestros sistemas.' NOT NULL,
  	"preferences_technical_badge" varchar DEFAULT 'Siempre activas' NOT NULL,
  	"preferences_preferencias_title" varchar DEFAULT 'Cookies de preferencias o personalización' NOT NULL,
  	"preferences_preferencias_text" varchar DEFAULT 'Permiten recordar información para que accedas al servicio con determinadas características personalizadas (como el idioma, tamaño de letra, configuración regional o visualización adaptada).' NOT NULL,
  	"preferences_analiticas_title" varchar DEFAULT 'Cookies analíticas o de medición' NOT NULL,
  	"preferences_analiticas_text" varchar DEFAULT 'Nos ayudan a comprender cómo interactúan los usuarios con la web mediante la recopilación y comunicación anónima de estadísticas de uso, permitiendo medir y mejorar la calidad del servicio bibliotecario.' NOT NULL,
  	"preferences_marketing_title" varchar DEFAULT 'Cookies de publicidad o marketing' NOT NULL,
  	"preferences_marketing_text" varchar DEFAULT 'Se utilizan para gestionar espacios publicitarios e informativos de forma eficaz, creando perfiles de navegación y adaptando contenido a tus intereses en la web.' NOT NULL,
  	"preferences_counter_none" varchar DEFAULT 'Solo las técnicas, nada más.' NOT NULL,
  	"preferences_counter_some" varchar DEFAULT '{n} de 3 opcionales activas' NOT NULL,
  	"preferences_button_reject_optional" varchar DEFAULT 'Rechazar opcionales' NOT NULL,
  	"preferences_button_accept_all" varchar DEFAULT 'Aceptar todas' NOT NULL,
  	"preferences_button_save" varchar DEFAULT 'Guardar preferencias' NOT NULL,
  	"messages_accepted" varchar DEFAULT '¡Genial! Cookies aceptadas.' NOT NULL,
  	"messages_saved" varchar DEFAULT '¡Listo! Preferencias guardadas.' NOT NULL,
  	"messages_rejected" varchar DEFAULT 'Entendido: sin cookies opcionales.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cookies" CASCADE;`)
}
