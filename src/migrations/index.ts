import * as migration_20260930_105147_baseline_pre_cms from './20260930_105147_baseline_pre_cms';
import * as migration_20260930_105220_add_cms_editability from './20260930_105220_add_cms_editability';
import * as migration_20261008_055719_add_strand_descriptions from './20261008_055719_add_strand_descriptions';
import * as migration_20261008_061224_add_music_spotify_url from './20261008_061224_add_music_spotify_url';
import * as migration_20261029_101115_cms_nonstop_reel_hero_venues from './20261029_101115_cms_nonstop_reel_hero_venues';
import * as migration_20261030_050345_privacy_policy from './20261030_050345_privacy_policy';

export const migrations = [
  {
    up: migration_20260930_105147_baseline_pre_cms.up,
    down: migration_20260930_105147_baseline_pre_cms.down,
    name: '20260930_105147_baseline_pre_cms',
  },
  {
    up: migration_20260930_105220_add_cms_editability.up,
    down: migration_20260930_105220_add_cms_editability.down,
    name: '20260930_105220_add_cms_editability',
  },
  {
    up: migration_20261008_055719_add_strand_descriptions.up,
    down: migration_20261008_055719_add_strand_descriptions.down,
    name: '20261008_055719_add_strand_descriptions',
  },
  {
    up: migration_20261008_061224_add_music_spotify_url.up,
    down: migration_20261008_061224_add_music_spotify_url.down,
    name: '20261008_061224_add_music_spotify_url',
  },
  {
    up: migration_20261029_101115_cms_nonstop_reel_hero_venues.up,
    down: migration_20261029_101115_cms_nonstop_reel_hero_venues.down,
    name: '20261029_101115_cms_nonstop_reel_hero_venues',
  },
  {
    up: migration_20261030_050345_privacy_policy.up,
    down: migration_20261030_050345_privacy_policy.down,
    name: '20261030_050345_privacy_policy'
  },
];
