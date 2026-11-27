/**
 * The words and pictures of the Admin Guide (/admin/guide).
 *
 * Written for DJ Ganesh and his team: plain English, one action per step,
 * button names exactly as they appear on screen (in **bold**).
 *
 * Each section's `id` is the slug of the CMS screen it explains, so the
 * "Help" button on that screen (HelpLink.tsx) jumps straight to it.
 *
 * Screenshots live in public/admin-guide/ and are made by
 * `npm run guide:screenshots` (scripts/admin-guide/capture.ts). A shot named
 * here that has not been captured yet is simply left out of the page.
 *
 * Inline formatting: **bold** and [link text](/path).
 */

export type Shot = { id: string; alt: string; caption?: string }

export type Task = {
  /** Anchor: /admin/guide#<section id>--<task id> */
  id: string
  title: string
  intro?: string
  steps: string[]
  shot?: Shot
  /** A friendly reminder shown under the steps. */
  note?: string
}

export type Section = {
  id: string
  title: string
  icon: string
  /** One line: what this screen is for. */
  summary: string
  /** Where these changes show up on the public website. */
  where?: { text: string; href?: string; shot?: Shot }
  /** The CMS screen this section explains. */
  open?: { label: string; href: string }
  tasks: Task[]
  dos?: string[]
  donts?: string[]
}

export type Group = { title: string; sections: Section[] }

const shot = (id: string, alt: string, caption?: string): Shot => ({ id, alt, caption })

/* ------------------------------------------------------------------------ */
/* Quick tasks: the jobs people come here for most often.                   */
/* ------------------------------------------------------------------------ */

export const quickTasks: { label: string; icon: string; href: string }[] = [
  { label: 'Add an upcoming show', icon: '📅', href: '#upcoming-shows--add' },
  { label: 'Add a new track', icon: '🎵', href: '#music-releases--add' },
  { label: 'Change the homepage video', icon: '🎬', href: '#home-page--hero-video' },
  { label: 'Reply to a booking enquiry', icon: '📩', href: '#contact-submissions--reply' },
  { label: 'Add a testimonial', icon: '💬', href: '#testimonials--add' },
  { label: 'Upload photos, video or audio', icon: '🖼️', href: '#media--upload' },
  { label: 'Hide something without deleting it', icon: '🙈', href: '#basics--hide' },
  { label: 'Change social media links', icon: '🔗', href: '#site-settings--social' },
  { label: 'Change the booking email or WhatsApp', icon: '☎️', href: '#contact-booking--email' },
  { label: 'Give someone CMS access', icon: '👤', href: '#users--add' },
]

/* ------------------------------------------------------------------------ */
/* The guide, in the same groups as the CMS menu.                           */
/* ------------------------------------------------------------------------ */

export const guide: Group[] = [
  {
    title: 'Getting started',
    sections: [
      {
        id: 'getting-started',
        title: 'Welcome to your CMS',
        icon: '👋',
        summary:
          'The CMS (Content Management System) is where you change the words, photos, videos, music and shows on the DJ Ganesh website. Nothing here needs any technical knowledge.',
        tasks: [
          {
            id: 'login',
            title: 'Log in',
            steps: [
              'Open your web browser and go to the website address with **/admin** added on the end. Bookmark the page so it is easy to find next time.',
              'Type your **Email** and **Password**.',
              'Click **Login**.',
            ],
            shot: shot('login', 'The CMS login screen with the email and password boxes and the Login button highlighted'),
            note: 'Forgotten your password? Click **Forgot password?** on the login screen. If no email arrives, ask another admin to set a new one for you (see [Users](#users)).',
          },
          {
            id: 'dashboard',
            title: 'Your home screen (the Dashboard)',
            intro: 'After logging in you land on the Dashboard. It is a shortcut board:',
            steps: [
              'The green buttons at the top (1) do the most common jobs in one click: **Edit Home Page**, **Add Show**, **Add Music** and **View live site**.',
              'The boxes underneath (2) show how many shows, tracks and testimonials are on the site, and how many booking enquiries you have not read yet. Click a box to open that list.',
              'Below that are the five newest booking enquiries, and then a card for every part of the CMS.',
            ],
            shot: shot('dashboard', 'The Dashboard with the quick-action buttons and the summary boxes highlighted'),
          },
          {
            id: 'menu',
            title: 'Finding your way around',
            steps: [
              'Click the **menu icon** (☰) in the top-left corner to open the side menu.',
              '**Admin Guide** at the very top brings you back to this guide at any time.',
              '**Site Content** holds the website pages: Home, About, Music and Privacy Policy.',
              '**Collections** holds lists of things: shows, music, gallery albums, milestones, testimonials and services.',
              '**Media** is the library of every photo, video and audio file. **Submissions** is your booking enquiry inbox. **Settings** holds site-wide things like the logo, menu, social links, contact details and who can log in.',
            ],
            shot: shot('sidebar', 'The side menu open, showing the Admin Guide link and the menu groups'),
          },
          {
            id: 'help',
            title: 'Getting help on any screen',
            steps: [
              'Every screen in the CMS has a **Help** button next to the save buttons.',
              'Click it and this guide opens in a new tab, on the instructions for that exact screen. Your unsaved work stays safe in the other tab.',
            ],
            shot: shot('help-link', 'The Help button next to the save buttons on an edit screen'),
          },
        ],
      },
      {
        id: 'basics',
        title: 'Everyday basics',
        icon: '🧰',
        summary:
          'The same few buttons work everywhere in the CMS. Learn them once here and every other section will feel familiar.',
        tasks: [
          {
            id: 'save-publish',
            title: 'Saving and publishing: what goes live and when',
            intro: 'There are two kinds of screen, and they save slightly differently:',
            steps: [
              '**Pages** (Home Page, About Page, Music Page, Privacy Policy and everything under Settings) have one green **Save** button. Clicking it puts your change on the website straight away.',
              '**Lists** (Upcoming Shows, Music, Testimonials and the rest) have two buttons. **Save Draft** keeps your work in the CMS only, so you can come back and finish it later. **Publish changes** (1) puts it on the website.',
              'After saving, open the website (or press **F5** to refresh it) and your change is there. There is nothing else to do.',
            ],
            shot: shot('shows-create', 'A new show being filled in, with the Save Draft and Publish changes buttons highlighted'),
            note: 'Most lists also have a **Published** tick box. An item only appears on the website when the tick box is ticked **and** you have clicked **Publish changes**.',
          },
          {
            id: 'add',
            title: 'Add something new',
            steps: [
              'Open the list from the side menu, for example **Upcoming Shows**.',
              'Click **Create New** (1) at the top of the list.',
              'Fill in the boxes. Boxes marked with a small green star (*) must be filled in; the others are optional.',
              'Click **Publish changes** (or **Save** on a page).',
            ],
            shot: shot('shows-list', 'The Upcoming Shows list with the Create New button highlighted'),
          },
          {
            id: 'edit',
            title: 'Change something that already exists',
            steps: [
              'Open the list from the side menu.',
              'Click the item\'s name in the list to open it.',
              'Change what you need.',
              'Click **Publish changes** (or **Save** on a page).',
            ],
          },
          {
            id: 'hide',
            title: 'Hide something without deleting it',
            intro: 'The safest way to take something off the website is to hide it. You can bring it back at any time.',
            steps: [
              'Open the item.',
              'Untick the **Published** tick box (1). It is near the bottom of the form.',
              'Click **Publish changes**. The item disappears from the website but stays in the CMS.',
            ],
            shot: shot('published-toggle', 'The Published tick box at the bottom of a music release'),
            note: 'Upcoming Shows have no Published tick box. To hide a show, change its **Show Status** to **Past** or **Cancelled**.',
          },
          {
            id: 'delete',
            title: 'Delete something for good',
            steps: [
              'Open the item.',
              'Click the **three dots** (⋮) (1) next to the publish buttons.',
              'Click **Delete**, then confirm.',
            ],
            shot: shot('doc-menu', 'The three-dots menu opened, showing Duplicate and Delete'),
            note: 'Deleting cannot be undone. If you might want it again, hide it instead (see above). **Duplicate** in the same menu makes a copy, which is a quick way to start a new show or track from an old one.',
          },
          {
            id: 'order',
            title: 'Change the order things appear in',
            steps: [
              'Most items have a **Display Order** box. Type a number in it.',
              'Lower numbers appear first: **1** comes before **2**, which comes before **10**.',
              'Leave gaps (10, 20, 30…) so you can slot something in between later without renumbering everything.',
            ],
          },
          {
            id: 'rows',
            title: 'Lists inside a page (rows)',
            intro: 'Some boxes hold a list of rows, such as social links, heading lines or photos.',
            steps: [
              'Click **Add …** under the list (1) to add a new row.',
              'Drag a row by the **dotted handle** on its left to move it up or down.',
              'Click the **three dots** on the right of a row to remove, duplicate or move it.',
              'Click a row\'s title to fold it open or closed.',
            ],
            shot: shot('rows', 'A list of rows with the Add button and row controls highlighted'),
          },
          {
            id: 'pick-file',
            title: 'Adding a photo, video or audio file to a box',
            steps: [
              '**Choose from existing** (1) picks a file that is already in the Media library.',
              '**Create New** uploads a new file from your computer. You can also drag a file straight onto the box.',
              'To swap a file, click the **×** next to it, then pick another one.',
            ],
            shot: shot('upload-field', 'An image box with Create New and Choose from existing highlighted'),
            note: 'Each box only lists the right kind of file: photo boxes show photos, video boxes show videos and the audio box shows audio. If you cannot find a file, it may be the wrong type for that box.',
          },
          {
            id: 'empty',
            title: 'What happens if I leave a box empty?',
            steps: [
              'Almost every box on the website pages has built-in words or pictures behind it.',
              'If you leave a box empty, the website keeps showing the built-in version. Nothing breaks.',
              'So you only need to fill in the things you want to change.',
            ],
          },
          {
            id: 'history',
            title: 'Undo a change (version history)',
            steps: [
              'Lists such as Upcoming Shows, Music and Testimonials keep a history of every save.',
              'Open the item and click **Versions** at the top of the screen.',
              'Open an older version and click **Restore this version**.',
            ],
            note: 'Pages (Home, About, etc.) do not keep a history, so take care before saving big changes to them.',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    title: 'Site Content (website pages)',
    sections: [
      {
        id: 'home-page',
        title: 'Home Page',
        icon: '🏠',
        summary:
          'Every section of the homepage, from the big video at the top to the booking band at the bottom, in the same order as the website.',
        where: { text: 'The homepage of the website.', href: '/', shot: shot('site-home', 'The top of the homepage with the video, the name and the two buttons') },
        open: { label: 'Open Home Page', href: '/admin/globals/home-page' },
        tasks: [
          {
            id: 'hero',
            title: 'Change the words and buttons at the top',
            steps: [
              'Open **Home Page**.',
              'In **Hero Section**, change the **Heading** (1) (the big name), **Line Above the Name**, and the words and links of the two buttons.',
              'Click **Save** (2).',
            ],
            shot: shot('home-hero', 'The Hero Section of the Home Page with the Save button highlighted'),
          },
          {
            id: 'hero-video',
            title: 'Change the homepage video',
            steps: [
              'Open **Home Page** and scroll to **Background Video** in the Hero Section (1).',
              'Click the **×** next to the current video to remove it.',
              'Click **Choose from existing** to pick a video from the Media library, or **Create New** to upload one from your computer.',
              'Optional but recommended: set a **Video Poster** (2). This is a still photo shown while the video loads, and on phones that do not play videos automatically (such as iPhones in Low Power Mode). Use a frame from the video.',
              'Click **Save**.',
            ],
            shot: shot('home-hero-video', 'The Background Video and Video Poster boxes on the Home Page'),
            note: 'The video plays silently on a loop, so music in it will not be heard. Keep it short (10–30 seconds), MP4 format, and under about 20 MB so it starts quickly on phones.',
          },
          {
            id: 'sections',
            title: 'What each part of the Home Page form controls',
            intro: 'Scroll down the Home Page form; the parts are in the same order as the website:',
            steps: [
              '**Hero Section**: the video, name and two buttons at the very top.',
              '**Artist Introduction (My Story)**: the "My Story" text. Its heading, the sound strands and the numbers next to it are on the **About Page** screen.',
              '**Shows (Global Reach)**: the spinning globe. **Tour Locations** are the city pins (each needs a latitude and longitude; search "[city] coordinates" on Google to find them).',
              '**Featured Shows**: pick which Upcoming Shows appear on the globe. Leave it empty to show every upcoming show.',
              '**Featured Music**: pick which tracks play in the homepage record player. Leave it empty to play every published track.',
              '**Stages Marquee**, **Trusted By**, **Shared Stages**, **Private Clientele**: the moving lists of venues, brands, artists and private clients.',
              '**Nonstop Sets**: the long-form mixes with YouTube links.',
              '**Gallery Strip**: the show reel video, the list of major live shows and the photos.',
              '**Booking Section**, **Legacy Section Chrome**, **Testimonials Section**, **Experience Section Labels**: the headings of those homepage sections. Their contents (milestones, quotes, services) are edited in the matching list under **Collections**.',
              '**SEO & Link Previews**: how the homepage looks in Google and when the link is shared on WhatsApp or social media.',
            ],
          },
        ],
        dos: [
          'Change one section at a time, click **Save**, then check the website.',
          'Use the **Video Poster** box whenever you change the video.',
        ],
        donts: [
          'Don\'t paste very long text into headings; they are designed for a few words.',
          'Don\'t upload a long or huge video (over ~20 MB) for the top of the page; it will load slowly on phones.',
        ],
      },
      {
        id: 'about',
        title: 'About Page',
        icon: '🙋',
        summary: 'The About page: the story, the photos, the sound strands and the career numbers.',
        where: {
          text: 'The About page. The heading, sound strands and career numbers also appear in the "My Story" part of the homepage.',
          href: '/about',
          shot: shot('site-about', 'The top of the About page'),
        },
        open: { label: 'Open About Page', href: '/admin/globals/about' },
        tasks: [
          {
            id: 'story',
            title: 'Change the story text',
            steps: [
              'Open **About Page**.',
              'In **Story**, edit the **Story Paragraphs**. Each paragraph is its own row; click the **Add** button under the list to add another.',
              '**Heading Lines** is the three-line heading on the homepage "My Story" block (the middle line is shown in green).',
              'Click **Save**.',
            ],
            shot: shot('about-form', 'The About Page form'),
          },
          {
            id: 'stats',
            title: 'Change the career numbers (e.g. "20+ years")',
            steps: [
              'Scroll to **Career Statistics** → **Stat Items**.',
              'Each row has a **Value** (the number), a **Suffix** (such as **+** or **K**) and a **Label**.',
              'Click **Save**. These numbers update on both the About page and the homepage.',
            ],
          },
          {
            id: 'photos',
            title: 'Change the photos',
            steps: [
              '**Frames (Images)** holds the stage, portrait and decks photos near the top of the About page.',
              '**Closing Portrait Image** is the photo at the end of the page.',
              'The photo section under the story comes from the **Gallery** album called **Journey**. See [Gallery](#gallery).',
            ],
          },
        ],
      },
      {
        id: 'music-page',
        title: 'Music Page',
        icon: '🎧',
        summary:
          'The headings and button words on the Music page. The tracks themselves are added in [Music / Releases](#music-releases).',
        where: { text: 'The Music page, and the button words on the homepage record player.', href: '/music', shot: shot('site-music', 'The Music page with the record player') },
        open: { label: 'Open Music Page', href: '/admin/globals/music-page' },
        tasks: [
          {
            id: 'edit',
            title: 'Change the Music page words',
            steps: [
              'Open **Music Page**.',
              '**Page Title** is the big heading. **Section Labels** are the small headings and the closing buttons.',
              '**Music Player Buttons** are the words on the record player (on both the homepage and the Music page).',
              '**Homepage Music Section Copy** holds the homepage music heading and the **Spotify URL** used by the "Listen on Spotify" buttons.',
              'Click **Save**.',
            ],
            shot: shot('music-page-form', 'The Music Page form'),
          },
        ],
      },
      {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        icon: '🔒',
        summary: 'The Privacy Policy page, linked from the footer and the booking form.',
        where: { text: 'The Privacy Policy page.', href: '/privacy' },
        open: { label: 'Open Privacy Policy', href: '/admin/globals/privacy-policy' },
        tasks: [
          {
            id: 'edit',
            title: 'Update the Privacy Policy',
            steps: [
              'Open **Privacy Policy**.',
              'Update **Last Updated** to today\'s date (for example **27 November 2026**).',
              'Edit the **Intro**, or the **Heading** and **Text** of each section. Click the **Add** button under the sections for a new one.',
              'Click **Save**.',
            ],
          },
        ],
        donts: ['Don\'t remove sections without checking with whoever handles your legal or data protection questions.'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    title: 'Collections (lists)',
    sections: [
      {
        id: 'upcoming-shows',
        title: 'Upcoming Shows',
        icon: '📅',
        summary: 'Your gig list. Upcoming shows appear as pins and cards on the homepage globe.',
        where: { text: 'The "Global Reach" globe on the homepage.', href: '/#global-reach', shot: shot('site-shows', 'The Global Reach globe on the homepage') },
        open: { label: 'Open Upcoming Shows', href: '/admin/collections/upcoming-shows' },
        tasks: [
          {
            id: 'add',
            title: 'Add a show',
            steps: [
              'Open **Upcoming Shows** and click **Create New**.',
              'Fill in **Show Title**, **Date**, **City** and **Country** (these four are required). **Time** and **Venue** are optional.',
              'Optional: add an **Event Poster / Image** and a **Ticket URL** (the full link, starting with https://).',
              'Leave **Show Status** on **Upcoming**.',
              'Click **Publish changes**.',
            ],
            shot: shot('shows-create', 'A new show being filled in'),
            note: 'If **Home Page → Featured Shows** has shows picked in it, only those appear on the globe. Add your new show there too, or empty that box to show every upcoming show.',
          },
          {
            id: 'past',
            title: 'After the show, or if it is cancelled',
            steps: [
              'Open the show.',
              'Change **Show Status** to **Past** or **Cancelled**.',
              'Click **Publish changes**. Only shows marked **Upcoming** appear on the website.',
            ],
          },
        ],
        dos: ['Always use the full link for tickets, starting with **https://**.', 'Use **Display Order** to put the soonest show first (1, 2, 3…).'],
      },
      {
        id: 'music-releases',
        title: 'Music / Releases',
        icon: '🎵',
        summary: 'Every track: its artwork, audio, YouTube link and description.',
        where: { text: 'The record player on the homepage and the Music page.', href: '/music', shot: shot('site-music', 'The Music page with the record player') },
        open: { label: 'Open Music / Releases', href: '/admin/collections/music-releases' },
        tasks: [
          {
            id: 'add',
            title: 'Add a new track',
            steps: [
              'Open **Music / Releases** and click **Create New**.',
              'Type the **Track / Release Title** and pick a **Category / Genre**.',
              'Add the **Artwork** (a square image works best).',
              'Add the **Audio File** (1): an MP3, WAV or M4A from the Media library, or upload a new one.',
              'Optional: paste the **YouTube URL** and write a short **Description**.',
              'Tick **Published** (2) and click **Publish changes**.',
            ],
            shot: shot('music-create', 'A new track with the Audio File box and Published tick box highlighted'),
            note: 'If **Home Page → Featured Music** has tracks picked in it, only those play on the homepage. Add your new track there too. (The **Featured** tick box on the track itself is not used by the website at the moment.)',
          },
          {
            id: 'audio',
            title: 'Replace a track\'s audio',
            steps: [
              'Open the track.',
              'Click the **×** next to the current **Audio File**, then **Create New** to upload the new one.',
              'Click **Publish changes**.',
            ],
            note: '**Audio URL (legacy)** is only used when no Audio File is picked. You can ignore it for new tracks.',
          },
        ],
        dos: ['Use MP3 for the quickest loading.'],
        donts: ['Don\'t upload audio files larger than 120 MB; they will be refused.'],
      },
      {
        id: 'gallery',
        title: 'Gallery',
        icon: '🖼️',
        summary: 'Photo albums. The album called **Journey** is the photo section on the About page.',
        where: { text: 'The photo section under the story on the About page. (The homepage photos are in Home Page → Gallery Strip.)', href: '/about' },
        open: { label: 'Open Gallery', href: '/admin/collections/gallery' },
        tasks: [
          {
            id: 'journey',
            title: 'Add or change photos on the About page',
            steps: [
              'Open **Gallery** and click the album whose **Album / Category** is **Journey**.',
              'Under **Images**, click the **Add** button under the list for a new photo, or change an existing row.',
              'Each photo can have a **Caption**, the line under it (for example "Club 77 · London").',
              'Make sure **Published** is ticked, then click **Publish changes**.',
            ],
            shot: shot('gallery-list', 'The Gallery list'),
          },
        ],
        donts: ['Don\'t change the word **Journey** in the Album / Category box, or the photos will disappear from the About page.'],
      },
      {
        id: 'legacy-milestones',
        title: 'Legacy / Milestones',
        icon: '🏆',
        summary: 'The key moments of DJ Ganesh\'s career, shown as a timeline.',
        where: { text: 'The Legacy timeline on the homepage and the About page.', href: '/#legacy' },
        open: { label: 'Open Legacy / Milestones', href: '/admin/collections/legacy-milestones' },
        tasks: [
          {
            id: 'add',
            title: 'Add a milestone',
            steps: [
              'Open **Legacy / Milestones** and click **Create New**.',
              'Fill in the **Year** and **Title**, plus a short **Description**. **More / Detail Text** is shown when someone opens the milestone.',
              'Add an **Image** if you have one, set a **Display Order**, tick **Published** and click **Publish changes**.',
            ],
          },
        ],
        donts: ['Don\'t change the **Slug / Key** of an existing milestone; the website uses it to find that milestone.'],
      },
      {
        id: 'testimonials',
        title: 'Testimonials',
        icon: '💬',
        summary: 'Quotes from clients and guests.',
        where: { text: 'The "Wall of Love" on the homepage.', href: '/#testimonials', shot: shot('site-testimonials', 'The testimonials wall on the homepage') },
        open: { label: 'Open Testimonials', href: '/admin/collections/testimonials' },
        tasks: [
          {
            id: 'add',
            title: 'Add a testimonial',
            steps: [
              'Open **Testimonials** and click **Create New**.',
              'Type the person\'s **Name** and their words in **Testimonial**.',
              'Optional: the **Event / Type** (e.g. "Royal Wedding") and **Location**.',
              'Tick **Published** (1) and click **Publish changes**.',
            ],
            shot: shot('testimonial-create', 'A new testimonial with the Published tick box highlighted'),
          },
        ],
        dos: ['Ask the person before publishing their name and words.'],
      },
      {
        id: 'experiences-services',
        title: 'Experiences / Services',
        icon: '✨',
        summary: 'What DJ Ganesh offers, e.g. Royal Weddings or Club Residencies, shown as cards.',
        where: { text: 'The Experience cards on the About page.', href: '/about' },
        open: { label: 'Open Experiences / Services', href: '/admin/collections/experiences-services' },
        tasks: [
          {
            id: 'add',
            title: 'Add or change a service',
            steps: [
              'Open **Experiences / Services** and click **Create New** (or click an existing one).',
              'Fill in the **Title** and **Short Description**, and add an **Image**.',
              '**Features / Highlights**: click the **Add** button for each bullet point.',
              '**Venue Photos** are optional small photos on the card, each with a venue name.',
              '**CTA Button Text** is the card\'s button. Leave **CTA URL** empty to send people to the booking form.',
              'Tick **Published** and click **Publish changes**.',
            ],
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    title: 'Media',
    sections: [
      {
        id: 'media',
        title: 'Media library',
        icon: '📁',
        summary: 'Every photo, video and audio file used on the website lives here.',
        open: { label: 'Open Media', href: '/admin/collections/media' },
        tasks: [
          {
            id: 'upload',
            title: 'Upload a photo, video or audio file',
            steps: [
              'Open **Media** and click **Create New**.',
              'Drag your file onto the box (1), or click **Select a file** to choose it from your computer.',
              'Type the **Alt Text** (2): a short description of the picture, e.g. "DJ Ganesh on stage at Club 77". It helps blind visitors and Google. (For audio files you can leave it empty.)',
              'Click **Save**. The file is now ready to pick anywhere in the CMS.',
            ],
            shot: shot('media-create', 'The Media upload screen with the drop area and Alt Text box highlighted'),
            note: 'You can also upload straight from any photo, video or audio box using **Create New**; it goes into this library too.',
          },
          {
            id: 'find',
            title: 'Find a file',
            steps: [
              'Open **Media** and type part of the file name in the **Search** box.',
              'Click a file to see it, change its Alt Text, or replace it.',
            ],
            shot: shot('media-list', 'The Media library list'),
          },
          {
            id: 'sizes',
            title: 'Which files can I upload?',
            steps: [
              '**Photos**: JPG, PNG or WebP. Landscape photos around 1920 pixels wide work best. The CMS makes smaller copies automatically.',
              '**Videos**: MP4 is best. Keep website videos short; for the homepage, under about 20 MB.',
              '**Audio**: MP3, WAV or M4A.',
              '**Maximum size**: 120 MB for any single file.',
              '**Share images** (for WhatsApp and social media previews): 1200 × 630 pixels.',
            ],
          },
        ],
        dos: ['Give files clear names before uploading, e.g. **club-77-london-2026.jpg**, so they are easy to find later.'],
        donts: [
          'Don\'t delete a file from Media while it is still used on the website; the photo or video will disappear from that page.',
          'Don\'t upload files larger than 120 MB; they will be refused.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    title: 'Submissions (your inbox)',
    sections: [
      {
        id: 'contact-submissions',
        title: 'Contact Submissions (booking enquiries)',
        icon: '📩',
        summary: 'Every booking enquiry sent from the website\'s contact form lands here.',
        where: { text: 'Sent from the booking form on the Contact page.', href: '/contact#booking', shot: shot('site-contact', 'The booking form on the Contact page') },
        open: { label: 'Open Contact Submissions', href: '/admin/collections/contact-submissions' },
        tasks: [
          {
            id: 'read',
            title: 'Read a new enquiry',
            steps: [
              'Open **Contact Submissions**. The newest enquiries are listed with the person\'s name, email, event type and date.',
              'Click a name to see the full enquiry and message.',
            ],
            shot: shot('submissions-list', 'The Contact Submissions list showing a sample enquiry'),
          },
          {
            id: 'reply',
            title: 'Reply, and keep track of who you have answered',
            steps: [
              'Open the enquiry and copy the person\'s **Email** (or phone number).',
              'Reply from your normal email or phone. (The CMS does not send replies itself.)',
              'Back in the CMS, change **Status** (1) from **New** to **Read** or **Responded**.',
              'Click **Save**. The Dashboard counts only **New** enquiries as unread.',
            ],
            shot: shot('submission-detail', 'A sample enquiry with the Status box highlighted'),
          },
        ],
        dos: ['Mark each enquiry as **Responded** once answered, so the team knows it is handled.'],
        donts: ['Don\'t share or download enquiries outside the team; they contain people\'s personal details.'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    title: 'Settings',
    sections: [
      {
        id: 'site-settings',
        title: 'Site Settings',
        icon: '⚙️',
        summary: 'Things that appear on every page: the logo, brand name, social links, contact details and footer.',
        where: { text: 'The header and footer of every page.', href: '/#footer', shot: shot('site-footer', 'The website footer') },
        open: { label: 'Open Site Settings', href: '/admin/globals/site-settings' },
        tasks: [
          {
            id: 'logo',
            title: 'Change the logo',
            steps: [
              'Open **Site Settings**.',
              'In **Header Logo**, click the **×** to remove the current logo, then pick or upload the new one. A wide PNG with a transparent background works best.',
              'Click **Save**.',
            ],
          },
          {
            id: 'social',
            title: 'Change social media links',
            steps: [
              'Open **Site Settings** and scroll to **Social Media Links**.',
              'Change a link\'s **URL**, or click the **Add** button under the list (1) and pick the **Platform**.',
              'Links must be complete, starting with **https://**.',
              'Click **Save**. These links appear in the footer and the menu on every page.',
            ],
            shot: shot('rows', 'The Social Media Links list in Site Settings'),
            note: 'The Contact page has its own social links list, in [Contact / Booking Settings](#contact-booking).',
          },
          {
            id: 'footer',
            title: 'Change the footer',
            steps: [
              'In **Footer**, each **Footer Column** has a title and a list of links.',
              'For each link, type the **Label** (the words shown) and **Link** (e.g. **/music** for a page on this site, or a full https:// address). Tick **External** for links to other websites.',
              'Change the **Copyright** line if needed, then click **Save**.',
            ],
          },
        ],
      },
      {
        id: 'navigation',
        title: 'Navigation (the menu)',
        icon: '🧭',
        summary: 'The links in the website\'s full-screen menu.',
        open: { label: 'Open Navigation', href: '/admin/globals/navigation' },
        tasks: [
          {
            id: 'edit',
            title: 'Add, hide or reorder a menu link',
            steps: [
              'Open **Navigation**.',
              'Under **Navigation Items**, each row is one menu link: the **Label** (words shown) and **URL** (e.g. **/about**).',
              'To hide a link, untick **Visible**. To change the order, change **Display Order** or drag the rows.',
              'Tick **External Link** only for links to other websites (they open in a new tab).',
              'Click **Save**.',
            ],
            shot: shot('navigation-form', 'The Navigation screen with the menu links'),
          },
        ],
        donts: ['Don\'t remove the links to the main pages (Home, About, Music, Contact) unless you mean to.'],
      },
      {
        id: 'contact-booking',
        title: 'Contact / Booking Settings',
        icon: '☎️',
        summary: 'Booking emails, the WhatsApp button, the header "Book" button and all the words on the Contact page.',
        where: { text: 'The Contact page, the header Book button and the WhatsApp button.', href: '/contact', shot: shot('site-contact', 'The Contact page') },
        open: { label: 'Open Contact / Booking Settings', href: '/admin/globals/contact-booking' },
        tasks: [
          {
            id: 'email',
            title: 'Change the booking email or WhatsApp number',
            steps: [
              'Open **Contact / Booking Settings**.',
              'Change **Booking Email** or **General Enquiry Email**. These are the addresses shown on the website.',
              'For WhatsApp, open **WhatsApp Button** and type the **WhatsApp Number** as digits only, country code first, with no + or spaces (e.g. **447700900123**).',
              'Click **Save**.',
            ],
            shot: shot('contact-booking-form', 'The Contact / Booking Settings screen'),
            note: 'The email address that **receives** a copy of each website enquiry is set by your developer, not in the CMS. Ask them if it needs to change.',
          },
          {
            id: 'form',
            title: 'Change the words on the booking form',
            steps: [
              '**Contact Page Header**: the heading at the top of the Contact page.',
              '**Enquiry Form Copy**: the form heading, the **Event Types** people can choose from, the submit button and the thank-you message.',
              '**Direct Contact**: the block under the form.',
              'Click **Save**.',
            ],
          },
        ],
      },
      {
        id: 'users',
        title: 'Users (who can log in)',
        icon: '👤',
        summary: 'The people who can log in to this CMS.',
        open: { label: 'Open Users', href: '/admin/collections/users' },
        tasks: [
          {
            id: 'add',
            title: 'Give someone access',
            steps: [
              'Open **Users** and click **Create New**.',
              'Type their **Email**, a **Password** (twice) and their **Full Name**.',
              'Click **Save**, then send them the login address and password privately (not in a group chat).',
            ],
            shot: shot('users-create', 'The new user screen'),
            note: 'Every user can change everything in the CMS, so only add people you trust.',
          },
          {
            id: 'remove',
            title: 'Remove someone\'s access',
            steps: ['Open **Users**, click their email, then the **three dots** (⋮) → **Delete**.'],
          },
          {
            id: 'password',
            title: 'Change your own password',
            steps: ['Click your **round profile picture** in the top-right corner.', 'Click **Change Password**, type the new one twice and click **Save**.'],
          },
        ],
        donts: ['Don\'t share one login between several people; give each person their own.'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    title: 'Help',
    sections: [
      {
        id: 'rules',
        title: 'Do\'s and don\'ts',
        icon: '✅',
        summary: 'The short list of habits that keep the website looking its best.',
        tasks: [],
        dos: [
          'Check the website after every change: open it in a new tab and press **F5** to refresh.',
          'Hide things (untick **Published**) rather than deleting them.',
          'Write **Alt Text** for every photo: a short description of what is in it.',
          'Use full links starting with **https://** for anything outside this website.',
          'Keep headings short: a few words each.',
          'Mark booking enquiries as **Responded** once answered.',
          'Log out when using a shared computer (side menu → **Log out** at the bottom).',
        ],
        donts: [
          'Don\'t delete photos or videos from **Media** that are still used on the website.',
          'Don\'t upload files larger than **120 MB**, or long videos for the top of the homepage.',
          'Don\'t change the word **Journey** on the Gallery album, or the **Slug / Key** of a milestone.',
          'Don\'t share your password; ask for your own login instead.',
          'Don\'t edit the same thing at the same time as someone else; the last person to save wins.',
        ],
      },
      {
        id: 'troubleshooting',
        title: 'Something isn\'t working',
        icon: '🛟',
        summary: 'The most common problems and how to fix them yourself.',
        tasks: [
          {
            id: 'not-showing',
            title: 'My change isn\'t showing on the website',
            steps: [
              'Did you click **Publish changes** (lists) or **Save** (pages)? **Save Draft** does not put anything on the website.',
              'For lists: is **Published** ticked? For shows: is **Show Status** set to **Upcoming**?',
              'For shows and music on the homepage: check **Home Page → Featured Shows / Featured Music**. If anything is picked there, only those items appear.',
              'Refresh the website with **Ctrl + F5** (Windows) or **Cmd + Shift + R** (Mac). On a phone, close and reopen the page.',
              'Still not there after a minute? Ask your developer.',
            ],
          },
          {
            id: 'upload-failed',
            title: 'My upload failed',
            steps: [
              'Is the file bigger than **120 MB**? Make it smaller (for videos, export a shorter or lower-quality version).',
              'Is it the right type? Photos: JPG/PNG/WebP. Video: MP4. Audio: MP3/WAV/M4A.',
              'Large files take a while on slow internet. Wait for the upload to finish before leaving the page, then try again on a faster connection if it fails.',
            ],
          },
          {
            id: 'cant-find-file',
            title: 'I can\'t find my file when choosing from existing',
            steps: [
              'Each box only shows the right kind of file: a photo box only lists photos, a video box only lists videos, and the audio box only lists audio.',
              'Type part of the file name in the search box at the top of the list.',
            ],
          },
          {
            id: 'red-error',
            title: 'A red message appeared when I clicked Save',
            steps: [
              '**This field is required**: fill in the box marked in red (boxes with a green star * are required).',
              '**Must be a valid URL**: the link must be complete, starting with **https://**.',
              'Scroll up and down the form to find every box marked in red, fix them, then click save again.',
            ],
          },
          {
            id: 'video-phone',
            title: 'The homepage video doesn\'t play on my phone',
            steps: [
              'Some phones (for example iPhones in Low Power Mode, or with data saver on) don\'t play videos automatically. This is normal.',
              'Add a **Video Poster** on the Home Page so those visitors see a good still photo instead of a dark screen. See [Change the homepage video](#home-page--hero-video).',
            ],
          },
          {
            id: 'deleted',
            title: 'I deleted something by mistake',
            steps: [
              'Deleted items cannot be brought back from the CMS.',
              'For an item you only **changed**, open it and use **Versions** to restore an earlier save (see [Undo a change](#basics--history)).',
              'For a deleted item, contact your developer as soon as possible; they may be able to restore it from a backup.',
            ],
          },
          {
            id: 'logged-out',
            title: 'I was logged out, or someone else is editing',
            steps: [
              'The CMS logs you out after a while for safety. Log in again; copy any long text somewhere safe first if you are unsure it saved.',
              'If the CMS says someone else is editing a page, wait for them to finish, or ask them, before making changes.',
            ],
          },
        ],
      },
    ],
  },
]

/** Every section, in order. */
export const allSections: Section[] = guide.flatMap((g) => g.sections)
