import * as migration_20260731_114550_baseline from './20260731_114550_baseline';
import * as migration_20260915_162539_session_2026_09_14_content_globals from './20260915_162539_session_2026_09_14_content_globals';
import * as migration_20260928_114829_login_campus from './20260928_114829_login_campus';
import * as migration_20260929_102432_actualizar_colectivos_campus from './20260929_102432_actualizar_colectivos_campus';
import * as migration_20260929_110457_layout_enlaces_externos from './20260929_110457_layout_enlaces_externos';
import * as migration_20261005_114927_enlaces_externos_key_select from './20261005_114927_enlaces_externos_key_select';

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
    name: '20261005_114927_enlaces_externos_key_select'
  },
];
