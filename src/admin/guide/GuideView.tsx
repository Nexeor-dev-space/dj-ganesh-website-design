import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { redirect } from 'next/navigation'
import fs from 'node:fs'
import path from 'node:path'
import React from 'react'

import { GuideClient } from './GuideClient'

export const SHOT_DIR = '/admin-guide'

/** Screenshots that exist on disk; a shot named in content.ts but not yet captured is left out. */
function capturedShots(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), 'public', SHOT_DIR))
      .filter((f) => f.endsWith('.jpg'))
      .map((f) => f.replace(/\.jpg$/, ''))
  } catch {
    return []
  }
}

/**
 * /admin/guide: the Admin User Guide, inside the normal CMS frame (menu and
 * header), for logged-in users only.
 */
export default function GuideView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, locale, permissions, visibleEntities } = initPageResult
  const adminRoute = req.payload.config.routes.admin

  if (!req.user) redirect(`${adminRoute}/login?redirect=${encodeURIComponent(`${adminRoute}/guide`)}`)

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      <GuideClient adminRoute={adminRoute} shots={capturedShots()} shotDir={SHOT_DIR} />
    </DefaultTemplate>
  )
}
