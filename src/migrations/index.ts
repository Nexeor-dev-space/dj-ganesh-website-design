import * as migration_20260930_105147_baseline_pre_cms from './20260930_105147_baseline_pre_cms';
import * as migration_20260930_105220_add_cms_editability from './20260930_105220_add_cms_editability';
import * as migration_20261008_055719_add_strand_descriptions from './20261008_055719_add_strand_descriptions';
import * as migration_20261008_061224_add_music_spotify_url from './20261008_061224_add_music_spotify_url';
import * as migration_20261029_101115_cms_nonstop_reel_hero_venues from './20261029_101115_cms_nonstop_reel_hero_venues';
import * as migration_20261030_050345_privacy_policy from './20261030_050345_privacy_policy';
import * as migration_20261102_151329_add_structured_enquiry_fields from './20261102_151329_add_structured_enquiry_fields';
import * as migration_20261103_050923_cms_content_audit from './20261103_050923_cms_content_audit';
import * as migration_20261110_113039_private_clientele from './20261110_113039_private_clientele';
import * as migration_20261110_113836_gallery_live_shows from './20261110_113836_gallery_live_shows';
import * as migration_20261110_120937_international_shows from './20261110_120937_international_shows';
import * as migration_20261110_123027_shared_stages from './20261110_123027_shared_stages';
import * as migration_20261112_053605_shared_stages_photos from './20261112_053605_shared_stages_photos';
import * as migration_20261112_054149_cms_short_labels from './20261112_054149_cms_short_labels';
import * as migration_20261113_170746_media_object_storage from './20261113_170746_media_object_storage';

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
    name: '20261030_050345_privacy_policy',
  },
  {
    up: migration_20261102_151329_add_structured_enquiry_fields.up,
    down: migration_20261102_151329_add_structured_enquiry_fields.down,
    name: '20261102_151329_add_structured_enquiry_fields',
  },
  {
    up: migration_20261103_050923_cms_content_audit.up,
    down: migration_20261103_050923_cms_content_audit.down,
    name: '20261103_050923_cms_content_audit',
  },
  {
    up: migration_20261110_113039_private_clientele.up,
    down: migration_20261110_113039_private_clientele.down,
    name: '20261110_113039_private_clientele',
  },
  {
    up: migration_20261110_113836_gallery_live_shows.up,
    down: migration_20261110_113836_gallery_live_shows.down,
    name: '20261110_113836_gallery_live_shows',
  },
  {
    up: migration_20261110_120937_international_shows.up,
    down: migration_20261110_120937_international_shows.down,
    name: '20261110_120937_international_shows',
  },
  {
    up: migration_20261110_123027_shared_stages.up,
    down: migration_20261110_123027_shared_stages.down,
    name: '20261110_123027_shared_stages',
  },
  {
    up: migration_20261112_053605_shared_stages_photos.up,
    down: migration_20261112_053605_shared_stages_photos.down,
    name: '20261112_053605_shared_stages_photos',
  },
  {
    up: migration_20261112_054149_cms_short_labels.up,
    down: migration_20261112_054149_cms_short_labels.down,
    name: '20261112_054149_cms_short_labels',
  },
  {
    up: migration_20261113_170746_media_object_storage.up,
    down: migration_20261113_170746_media_object_storage.down,
    name: '20261113_170746_media_object_storage'
  },
];
