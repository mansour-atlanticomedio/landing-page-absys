import * as migration_20260731_114550_baseline from './20260731_114550_baseline';
import * as migration_20260915_162539_session_2026_09_14_content_globals from './20260915_162539_session_2026_09_14_content_globals';
import * as migration_20260928_114829_login_campus from './20260928_114829_login_campus';
import * as migration_20260929_102432_actualizar_colectivos_campus from './20260929_102432_actualizar_colectivos_campus';
import * as migration_20260929_110457_layout_enlaces_externos from './20260929_110457_layout_enlaces_externos';
import * as migration_20261005_114927_enlaces_externos_key_select from './20261005_114927_enlaces_externos_key_select';
import * as migration_20261006_112738_enlaces_navbar_footer from './20261006_112738_enlaces_navbar_footer';
import * as migration_20261007_164512_solicitud_compra_global from './20261007_164512_solicitud_compra_global';
import * as migration_20261008_151100_contacto_mensaje_texto from './20261008_151100_contacto_mensaje_texto';
import * as migration_20261015_163900_conocenos_tabs from './20261015_163900_conocenos_tabs';
import * as migration_20261015_163937_about_us_blocks from './20261015_163937_about_us_blocks';
import * as migration_20261015_170639_pages_collection from './20261015_170639_pages_collection';
import * as migration_20261015_172126_importar_exportar from './20261015_172126_importar_exportar';
import * as migration_20261019_143507_quitar_tipo_header_footer_simple from './20261019_143507_quitar_tipo_header_footer_simple';
import * as migration_20261027_141832_logo_cabecera from './20261027_141832_logo_cabecera';
import * as migration_20261027_144150_recursos_electronicos from './20261027_144150_recursos_electronicos';

export const migrations = [
  {
    up: migration_20260731_114550_baseline.up,
    down: migration_20260731_114550_baseline.down,
    name: '20260731_114550_baseline',
  },
  {
    up: migration_20260915_162539_session_2026_09_14_content_globals.up,
    down: migration_20260915_162539_session_2026_09_14_content_globals.down,
    name: '20260915_162539_session_2026_09_14_content_globals',
  },
  {
    up: migration_20260928_114829_login_campus.up,
    down: migration_20260928_114829_login_campus.down,
    name: '20260928_114829_login_campus',
  },
  {
    up: migration_20260929_102432_actualizar_colectivos_campus.up,
    down: migration_20260929_102432_actualizar_colectivos_campus.down,
    name: '20260929_102432_actualizar_colectivos_campus',
  },
  {
    up: migration_20260929_110457_layout_enlaces_externos.up,
    down: migration_20260929_110457_layout_enlaces_externos.down,
    name: '20260929_110457_layout_enlaces_externos',
  },
  {
    up: migration_20261005_114927_enlaces_externos_key_select.up,
    down: migration_20261005_114927_enlaces_externos_key_select.down,
    name: '20261005_114927_enlaces_externos_key_select',
  },
  {
    up: migration_20261006_112738_enlaces_navbar_footer.up,
    down: migration_20261006_112738_enlaces_navbar_footer.down,
    name: '20261006_112738_enlaces_navbar_footer',
  },
  {
    up: migration_20261007_164512_solicitud_compra_global.up,
    down: migration_20261007_164512_solicitud_compra_global.down,
    name: '20261007_164512_solicitud_compra_global',
  },
  {
    up: migration_20261008_151100_contacto_mensaje_texto.up,
    down: migration_20261008_151100_contacto_mensaje_texto.down,
    name: '20261008_151100_contacto_mensaje_texto',
  },
  {
    up: migration_20261015_163900_conocenos_tabs.up,
    down: migration_20261015_163900_conocenos_tabs.down,
    name: '20261015_163900_conocenos_tabs',
  },
  {
    up: migration_20261015_163937_about_us_blocks.up,
    down: migration_20261015_163937_about_us_blocks.down,
    name: '20261015_163937_about_us_blocks',
  },
  {
    up: migration_20261015_170639_pages_collection.up,
    down: migration_20261015_170639_pages_collection.down,
    name: '20261015_170639_pages_collection',
  },
  {
    up: migration_20261015_172126_importar_exportar.up,
    down: migration_20261015_172126_importar_exportar.down,
    name: '20261015_172126_importar_exportar',
  },
  {
    up: migration_20261019_143507_quitar_tipo_header_footer_simple.up,
    down: migration_20261019_143507_quitar_tipo_header_footer_simple.down,
    name: '20261019_143507_quitar_tipo_header_footer_simple',
  },
  {
    up: migration_20261027_141832_logo_cabecera.up,
    down: migration_20261027_141832_logo_cabecera.down,
    name: '20261027_141832_logo_cabecera',
  },
  {
    up: migration_20261027_144150_recursos_electronicos.up,
    down: migration_20261027_144150_recursos_electronicos.down,
    name: '20261027_144150_recursos_electronicos'
  },
];
