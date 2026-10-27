import type { GlobalConfig } from 'payload'

/**
 * The /about page.
 *
 * A dedicated global (rather than extending SiteSettings) keeps the substantial
 * about-page content self-contained and editable in one place, and keeps
 * SiteSettings focused on site-wide config. Mirrors data/about-page.ts and
 * lib/about.ts. All values have code fallbacks.
 */
const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  admin: { group: 'Site Content', description: 'Content for the /about page. Live page: http://localhost:3000/about' },
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'labels',
      label: 'Section Labels',
      fields: [
        { name: 'intro', label: 'Intro Label', type: 'text' },
        // No longer shown: the Story section's heading already says it.
        { name: 'story', label: 'Story Label', type: 'text', admin: { hidden: true } },
        { name: 'identity', label: 'Identity / Sound Label', type: 'text' },
        { name: 'experience', label: 'Experience Label', type: 'text' },
        { name: 'sectionLabel', label: 'My Story Section Label', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'story',
      label: 'Story',
      fields: [
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          admin: { description: 'e.g. "The" / "BollyAfro" / "Pioneer".' },
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'statement', label: 'Opening Statement', type: 'textarea' },
        {
          name: 'paragraphs',
          label: 'Story Paragraphs',
          type: 'array',
          fields: [{ name: 'paragraph', label: 'Paragraph', type: 'textarea', required: true }],
        },
        { name: 'careerStart', label: 'Career Start Year', type: 'text' },
      ],
    },
    {
      name: 'soundStrands',
      label: 'Sound Strands',
      type: 'array',
      admin: { description: 'The strands of the sound, e.g. Bollywood / Afrobeats / House. On the home page, hovering a strand swaps the story paragraph for its description.' },
      fields: [
        { name: 'strand', label: 'Strand', type: 'text', required: true },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          admin: { description: 'Shown in place of the story paragraph while this strand is hovered on the home page.' },
        },
      ],
    },
    {
      type: 'group',
      name: 'frames',
      label: 'Frames (Images)',
      fields: [
        { name: 'stage', label: 'Stage Image', type: 'upload', relationTo: 'media' },
        { name: 'portrait', label: 'Portrait Image', type: 'upload', relationTo: 'media' },
        { name: 'decks', label: 'Decks Image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'portrait', label: 'Closing Portrait Image', type: 'upload', relationTo: 'media' },
    {
      type: 'group',
      name: 'careerStats',
      label: 'Career Statistics',
      fields: [
        {
          name: 'stats',
          label: 'Stat Items',
          type: 'array',
          fields: [
            { name: 'value', label: 'Value', type: 'text', required: true },
            { name: 'suffix', label: 'Suffix (e.g. +, K)', type: 'text' },
            { name: 'label', label: 'Label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'experiencePreview',
      label: 'Experience Preview',
      admin: { description: 'Selects Legacy Milestones to preview on the about page.' },
      fields: [
        {
          name: 'milestones',
          label: 'Milestones',
          type: 'relationship',
          relationTo: 'legacy-milestones',
          hasMany: true,
          admin: { description: 'Choose the 3 milestones to preview (e.g. origin, taj, world-tour).' },
        },
        { name: 'experienceHref', label: 'Experience Link', type: 'text' },
        { name: 'bookingHref', label: 'Booking Link', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'outro',
      label: 'Outro',
      fields: [
        { name: 'question', label: 'Question', type: 'text' },
        { name: 'cta', label: 'CTA Label', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'cta',
      label: 'Story CTA',
      fields: [
        { name: 'label', label: 'CTA Label', type: 'text' },
        { name: 'href', label: 'CTA Link', type: 'text' },
      ],
    },
  ],
}

export default About
