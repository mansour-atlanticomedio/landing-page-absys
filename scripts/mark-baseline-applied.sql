-- Prepara una BD existente (creada históricamente por push) para funcionar con
-- prodMigrations:
--   1. Elimina la fila 'dev' (batch -1): su presencia hace que Payload muestre un
--      prompt interactivo y se cuelgue al migrar en producción.
--   2. Registra la migración baseline como ya aplicada para que prodMigrations no
--      intente re-ejecutar CREATE TABLE sobre tablas que ya existen.
-- Idempotente: seguro de ejecutar varias veces.

DELETE FROM "payload_migrations" WHERE "name" = 'dev';

INSERT INTO "payload_migrations" ("name", "batch")
SELECT '20260731_114550_baseline', 2
WHERE NOT EXISTS (
    SELECT 1 FROM "payload_migrations" WHERE "name" = '20260731_114550_baseline'
);
