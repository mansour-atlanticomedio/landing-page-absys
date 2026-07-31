import * as migration_20260731_114550_baseline from './20260731_114550_baseline';

export const migrations = [
  {
    up: migration_20260731_114550_baseline.up,
    down: migration_20260731_114550_baseline.down,
    name: '20260731_114550_baseline'
  },
];
