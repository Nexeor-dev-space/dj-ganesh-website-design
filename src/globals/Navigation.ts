import type { GlobalConfig } from 'payload'

const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    description: 'Manage website navigation items and their order.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'items',
      label: 'Navigation Items',
      type: 'array',
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text', required: true },
        {
          name: 'isExternal',
          label: 'External Link',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Open in a new tab.' },
        },
        { name: 'order', label: 'Display Order', type: 'number' },
        {
          name: 'visible',
          label: 'Visible',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}

export default Navigation
