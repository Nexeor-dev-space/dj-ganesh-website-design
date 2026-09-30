import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
  ],
}

export default Users
