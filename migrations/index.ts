import * as migration_20260526_182425 from './20260526_182425';
import * as migration_20260527_170856 from './20260527_170856';
import * as migration_20260527_171143 from './20260527_171143';
import * as migration_20260527_172052 from './20260527_172052';
import * as migration_20260528_092114 from './20260528_092114';

export const migrations = [
  {
    up: migration_20260526_182425.up,
    down: migration_20260526_182425.down,
    name: '20260526_182425',
  },
  {
    up: migration_20260527_170856.up,
    down: migration_20260527_170856.down,
    name: '20260527_170856',
  },
  {
    up: migration_20260527_171143.up,
    down: migration_20260527_171143.down,
    name: '20260527_171143',
  },
  {
    up: migration_20260527_172052.up,
    down: migration_20260527_172052.down,
    name: '20260527_172052',
  },
  {
    up: migration_20260528_092114.up,
    down: migration_20260528_092114.down,
    name: '20260528_092114'
  },
];
