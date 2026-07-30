import * as migration_20260722_163858 from './20260722_163858';
import * as migration_20260722_170544 from './20260722_170544';
import * as migration_20260722_171654 from './20260722_171654';
import * as migration_20260730_103701 from './20260730_103701';

export const migrations = [
  {
    up: migration_20260722_163858.up,
    down: migration_20260722_163858.down,
    name: '20260722_163858',
  },
  {
    up: migration_20260722_170544.up,
    down: migration_20260722_170544.down,
    name: '20260722_170544',
  },
  {
    up: migration_20260722_171654.up,
    down: migration_20260722_171654.down,
    name: '20260722_171654',
  },
  {
    up: migration_20260730_103701.up,
    down: migration_20260730_103701.down,
    name: '20260730_103701'
  },
];
