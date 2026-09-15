import * as migration_20260731_114550_baseline from './20260731_114550_baseline';
import * as migration_20260915_162539_session_2026_09_14_content_globals from './20260915_162539_session_2026_09_14_content_globals';

export const migrations = [
  {
    up: migration_20260731_114550_baseline.up,
    down: migration_20260731_114550_baseline.down,
    name: '20260731_114550_baseline',
  },
  {
    up: migration_20260915_162539_session_2026_09_14_content_globals.up,
    down: migration_20260915_162539_session_2026_09_14_content_globals.down,
    name: '20260915_162539_session_2026_09_14_content_globals'
  },
];
