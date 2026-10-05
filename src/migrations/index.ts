import * as migration_20260930_105147_baseline_pre_cms from './20260930_105147_baseline_pre_cms';
import * as migration_20260930_105220_add_cms_editability from './20260930_105220_add_cms_editability';

export const migrations = [
  {
    up: migration_20260930_105147_baseline_pre_cms.up,
    down: migration_20260930_105147_baseline_pre_cms.down,
    name: '20260930_105147_baseline_pre_cms',
  },
  {
    up: migration_20260930_105220_add_cms_editability.up,
    down: migration_20260930_105220_add_cms_editability.down,
    name: '20260930_105220_add_cms_editability'
  },
];
