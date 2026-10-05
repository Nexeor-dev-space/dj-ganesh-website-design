# WIRING SPEC — DJ Ganesh CMS editability

Contract for the wiring agents. For every frontend constant it names the CMS home (collection/global + field path) and the fallback. Schema is FROZEN — do not add/rename fields; if a mapping looks wrong, keep the code fallback and flag it.

Rules for all wirings:
- Every mapping keeps the existing hardcoded value as a FALLBACK. If the CMS value is empty/undefined, render the code constant so output stays byte-identical.
- Globals: `home-page`, `site-settings`, `contact-booking`, `about`, `music-page`, `navigation`. Collections: `contact-submissions`, `legacy-milestones`, `experiences-services`, `gallery`, `testimonials`, `music-releases`, `performance-history`, `upcoming-shows`.
- Client components must NOT fetch; lift to a server component and pass props.
- Upload fields return a Media doc (or id) — resolve `.url` / `.alt`, fall back to the code src/alt string.

---

## Homepage (`/`) — global `home-page`

### Hero — `components/hero/HeroBackground.tsx`
- `/videos/dj-ganesh.mp4` (hardcoded `src`) → `home-page.hero.heroVideo` (Media, video/*). Fallback: `/videos/dj-ganesh.mp4`.
- video poster (none in code) → `home-page.hero.heroVideoPoster` (Media). Fallback: none.
- Existing hero copy fields (`heroHeading`, `heroSubheading`, `heroImage`, `heroCtaText`, `heroCtaUrl`) already present — wire if the hero uses them; otherwise leave.

### Statement plate — `data/statement.ts`
- `statementLabel` → `home-page.statementPlate.label`. Fallback `"The Statement"`.
- `statement.lines[]` → `home-page.statementPlate.lines[].line`. Fallback code array.
- `statement.spoken` → `home-page.statementPlate.spoken`. Fallback `false`.
- `statement.name` → `home-page.statementPlate.name`. Fallback `"DJ Ganesh"`.
- `statement.note` → `home-page.statementPlate.note`. Fallback code string.

### Stages marquee — `lib/stages.ts`
- `stagesSectionLabel` → `home-page.stages.label`. Fallback `"Stages"`.
- `stagesHeading[]` → `home-page.stages.heading[].line`. Fallback `["The","Rooms"]`.
- `stagesLede` → `home-page.stages.lede`.
- `stagesCtaLabel` → `home-page.stages.ctaLabel`. Fallback `"Book DJ Ganesh"`.
- `stagesCtaHref` → `home-page.stages.ctaHref`. Fallback `"#booking"`.
- `stageRows` (array of rows of `{name, featured}`) → `home-page.stages.stages[] {name, featured}`. NOTE: CMS is a FLAT list; the code splits into 3 marquee rows. Wiring keeps the row-splitting in code (presentational) and only sources the names/featured flags. Fallback: `stageRows` flattened.

### Trusted By — `data/trusted.ts`
- `trustedLabel` → `home-page.trustedBy.label`. Fallback `"Trusted By"`.
- `trustedNames[]` → `home-page.trustedBy.names[].name`. Fallback code array.

### Homepage gallery strip — `data/gallery.ts`
- `gallerySectionLabel` → `home-page.galleryStrip.label`. Fallback `"Gallery"`.
- `galleryItems[] {src, alt, href}` → `home-page.galleryStrip.items[] {image(Media→url), alt, href}`. Fallback code array (src/alt/href).

### Follow section — `data/follow.ts`
- `followHeading` → `home-page.follow.heading`. Fallback `"Follow"`.
- `followLinks[] {label, caption, href, icon, external}` → `home-page.follow.links[]` (same field names). Fallback code array.

### Experience section — `data/experience.ts` (labels only; offerings = collection)
- `experienceSectionLabel` → `home-page.experienceSection.label`. Fallback `"What I Do"`.
- `experienceHeading[]` → `home-page.experienceSection.heading[].line`. Fallback `["The","Experience"]`.
- `experienceCtaHref` → `home-page.experienceSection.ctaHref`. Fallback `"#booking"`.
- `offerings[] {id,title,summary,points[],cta}` → collection `experiences-services` (`title`, `shortDescription`≈summary, `features[].feature`≈points, `ctaText`≈cta, `order`). Fallback `offerings`.

### Statistics — existing `home-page.statistics.stats`
- Added `suffix` field → maps to `lib/about.ts careerStats[].suffix` where reused, or homepage stat suffixes. Fallback: split value string.

### Global Reach / globe — `lib/tour.ts`
- `tourCities[] {name,lat,lng,hub,labelDx,labelDy}` → `home-page.globalReach.locations[] {city(=name), lat, lng, hub, labelDx, labelDy}`. Fallback `tourCities`. (country field exists in CMS; code has none — leave blank.)
- `tourShows`, `tourRoute`, `findCity`, `findShow`, `tourName`, `countriesToured` → tour dates map to collection `upcoming-shows`; route/finders/derived stay in code (logic). `countriesToured` → could use a stat; keep code fallback.

### Featured shows/music — existing `home-page.featuredShows` / `home-page.featuredMusic` relationships → collections `upcoming-shows` / `music-releases`.

---

## Music page (`/music`) — global `music-page`

- `musicPageTitle` (`data/music-page.ts`) → `music-page.pageTitle`. Fallback `"Music"`.
- `musicPageStatement` → `music-page.statement`. Fallback statement.lines joined.
- `musicPageLabels.intro/archive/continue` → `music-page.labels.intro/archive/continue`. Fallbacks `"The Archive"/"All Music"/"Continue Listening"`.
- `musicSectionLabel` (`data/tracks.ts`) → `music-page.homeSection.sectionLabel`. Fallback `"Latest Drops"`.
- `musicHeading` → `music-page.homeSection.heading`. Fallback `"The Music"`.
- `allReleasesUrl` → `music-page.homeSection.allReleasesUrl`. Fallback YouTube URL.
- `tracks[]` (`data/tracks.ts`) → collection `music-releases` (title, tag, artist, audio, youtubeId, thumbnail, artwork). Fallback `tracks`. `musicPageStrands` → `about.soundStrands` (shared). `youtubeThumbnail()` stays in code (helper).

---

## About page (`/about`) — global `about`

- `aboutPageLabels.intro/story/identity/experience` (`data/about-page.ts`) → `about.labels.intro/story/identity/experience`.
- `aboutSectionLabel` (`lib/about.ts`) → `about.labels.sectionLabel`. Fallback `"My Story"`.
- `aboutHeading[]` → `about.story.heading[].line`. Fallback `["The","BollyAfro","Pioneer"]`.
- `aboutStatement` / `aboutStory[]` / `aboutParagraphs[]` → `about.story.statement` and `about.story.paragraphs[].paragraph`. (Code has both `aboutStory` in lib and `aboutParagraphs` in data — map paragraphs to the same array; keep whichever the page renders as fallback.)
- `careerStart` → `about.story.careerStart`. Fallback `"1998"`.
- `soundStrands[]` (`lib/about.ts`) → `about.soundStrands[].strand`. Fallback `["Bollywood","Afrobeats","House"]`.
- `aboutFrames.stage/portrait/decks {src,alt}` → `about.frames.stage/portrait/decks` (Media→url, alt). Fallback code srcs/alts.
- `aboutPortrait {src,alt}` (`lib/about.ts`) → `about.portrait` (Media). Fallback `/images/about.jpg`.
- `careerStats[] {value,suffix,label}` → `about.careerStats.stats[] {value,suffix,label}`. Fallback code array.
- `experiencePreview` (`["origin","taj","world-tour"]` mapped over milestones) → `about.experiencePreview.milestones` (relationship → `legacy-milestones`). Select by NEW `legacy-milestones.slug` = origin/taj/world-tour. Fallback: code id lookup.
- `experienceHref` → `about.experiencePreview.experienceHref`. Fallback `"/performance-history"`.
- `bookingHref` (`data/about-page.ts`) → `about.experiencePreview.bookingHref`. Fallback `"/contact"`.
- `aboutOutro {question,cta}` → `about.outro.question/cta`. Fallback code.
- `aboutCta {label,href}` (`lib/about.ts`) → `about.cta.label/href`. Fallback `"Book a private event"`/`"#booking"`.

---

## Legacy / Archive — collection `legacy-milestones`

- `milestones[] {id,year,title,lede,more}` (`lib/legacy.ts`) → collection `legacy-milestones`: `year`, `title`, `lede`→`description`, `more`→NEW `more` field. Fallback code array.
- NEW `legacy-milestones.slug` → set to the code `id` (origin, taj, ambani, karan-johar, a-list, world-tour) so About/homepage can select specific entries. Seed agent must populate `slug`.
- `legacySectionLabel` (`lib/legacy.ts`) → `home-page.legacySection.label`. Fallback `"Legacy"`.
- `legacyHeading[]` → `home-page.legacySection.heading[].line`. Fallback `["The","Archive"]`.
- `archiveCount`, `archiveSpan` → DERIVED, stay in code.

---

## Contact page (`/contact`) — global `contact-booking` + collection `contact-submissions`

- `contactMeta.eyebrow` (`data/contact.ts`) → `contact-booking.contactMeta.eyebrow`. Fallback `"Contact / Booking"`.
- `contactMeta.heading[]` → `contact-booking.contactMeta.heading[].line`. Fallback `["Let's make","something loud."]`.
- `contactMeta.lede` → `contact-booking.contactMeta.lede`. Fallback code string.
- `enquiryMeta.heading/lede/submitLabel` → `contact-booking.enquiry.heading/lede/submitLabel`. Fallbacks `"Booking Enquiry"` / code lede / `"Send booking request"`.
- `bookingInfo.heading/copy` → `contact-booking.bookingInfoBlock.heading/copy`. Fallbacks `"Planning an event?"` / code copy.
- `finalCta.heading[]/lede/label/href` → `contact-booking.finalCta.heading[].line` / `.lede` / `.label` / `.href`. Fallbacks `["Have an event","in mind?"]` / `"Let's talk."` / `"Make an enquiry"` / `"#booking-enquiry"`.
- (`contact-booking.bookingCtaText/Url` still cover the primary booking CTA.)
- `eventTypes[]` (`data/contact.ts`) → drives the enquiry form dropdown; stays in code (also `contact-submissions.eventType` is free text storing the chosen value).
- `contactDesks`, `connectLinks` → `connectLinks` = `footerSocialLinks` (see footer); desks derive from `contact-booking.bookingEmail`/`enquiryEmail`. Use those globals; fallback code.
- **Enquiry form submit** → POST to collection `contact-submissions` (create is public). Fields: `name`, `email`, `phone`, `eventType`, `message`; `status` defaults `new`. `lib/enquiry.ts` validation STAYS IN CODE (logic).

### Booking / WhatsApp — `data/booking.ts`
- `whatsappNumber` → `contact-booking.whatsapp.whatsappNumber`. Fallback env/`whatsappPlaceholderNumber`.
- `whatsappLabel` → `contact-booking.whatsapp.whatsappLabel`. Fallback `"Quick Booking"`.
- `whatsappMessage` → `contact-booking.whatsapp.whatsappMessage`. Fallback code string. (`whatsappHref` derived in code.)
- `bookingSectionLabel` (`data/booking.ts`) → `home-page.bookingSection.label`. Fallback `"Booking"`.
- `bookingHeading[]` → `home-page.bookingSection.heading[].line`. Fallback `["Let's","Make It","A Night."]`.
- `bookingLede` → `home-page.bookingSection.lede`. Fallback `"Want DJ Ganesh at your event?"`.
- `bookingScope[]` → `home-page.bookingSection.scope[].item`. Fallback code array.
- `bookingLinks[] {label,value,href,external}` → `home-page.bookingSection.links[] {label,value,href,external,icon}`. Fallback code array.
- `bookingCta {label,href}` → still maps to `contact-booking.bookingCtaText/Url` (primary CTA). `bookingEmail`, `whatsappHref` derived in code.

### Closing call band — `data/call.ts`
- `call.heading[]` → `contact-booking.callBand.heading[].line`. Fallback `["Ready to","Book?"]`.
- `call.lede` → `contact-booking.callBand.lede`.
- `call.ctaLabel` → `contact-booking.callBand.ctaLabel`. Fallback `"Book DJ Ganesh"`.
- `call.agencies[]` → `contact-booking.callBand.agencies[].name`. Fallback code array. (Existing `contact-booking.agency` group = the single primary agency; callBand.agencies = the 3-name band.)

---

## Footer — global `site-settings.footer`

- `footerColumns[] {label,links[] {label,href,external}}` (`data/footer.ts`) → `site-settings.footer.columns[] {title(=label), links[] {label,href,external}}`. Fallback code array.
- `footerSocialLinks[]` → reuse `contact-booking.socialLinks` / `site-settings.socialLinks` (existing). Icon mapping stays in code. Fallback code array.
- `footerStatement` → `site-settings.footer.statement`. Fallback `"Follow the sound"`.
- `footerCopyright` → `site-settings.footer.copyright`. Fallback code string.
- `footerContactEmail` → `site-settings.footer.contactEmail`. Fallback `info@djganeshbombay.com`.

---

## Navigation & site config

- `navLinks` (`lib/site.ts`) → global `navigation.items[] {label, url, isExternal, order, visible}`. Fallback `navLinks`.
- `bookingHref` (`lib/site.ts`) → `contact-booking.bookingCtaUrl` or `site-settings`; fallback `/contact`.
- `socialLinks` (`lib/site.ts`) → `site-settings.socialLinks`. Fallback code.
- `siteConfig {name,title,description,locale}` → `site-settings.siteName` + `site-settings.seo.defaultSeoTitle/defaultSeoDescription`. `locale` STAYS IN CODE. Fallback `siteConfig`.

---

## Testimonials — collection `testimonials`
- `testimonials[] {id,quote,author,location}` (`lib/testimonials.ts`) → collection `testimonials` (`testimonial`≈quote, `name`≈author, `location`; `eventType` extra). Fallback code array.
- `testimonialsSectionLabel` (`lib/testimonials.ts`) → `home-page.testimonialsSection.label`. Fallback `"Testimonials"`.
- `testimonialsHeading[]` → `home-page.testimonialsSection.heading[].line`. Fallback `["The","Reaction"]`.

---

## Stays in code (correct — logic/assets/derived, no CMS home needed)
- `lib/world-mask.ts`, `lib/wall.ts` — rendering assets/geometry.
- `lib/music.ts`, `lib/media.ts` — helpers.
- `lib/enquiry.ts` — form validation logic.
- `lib/tour.ts` `findCity`/`findShow`/`tourRoute`/derived — logic.
- `data/tracks.ts` `youtubeThumbnail()` — helper.
- `lib/legacy.ts` `archiveCount`/`archiveSpan`, `lib/about.ts` computed — derived.
- `data/contact.ts` `eventTypes[]` (form dropdown options) and `lib/enquiry.ts` validation — logic, stay in code.
- `siteConfig.locale` — stays in code.

NOTE (addendum): the previously code-only section copy is now fully mapped — contact meta/enquiry/bookingInfo/finalCta → `contact-booking`; homepage booking section → `home-page.bookingSection`; legacy & testimonials chrome → `home-page.legacySection`/`testimonialsSection`; milestone `more` → `legacy-milestones.more`. All retain code fallbacks.
