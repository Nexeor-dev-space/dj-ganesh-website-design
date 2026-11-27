'use client'
import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

/** "Admin Guide" at the top of the CMS side menu. */
export default function GuideNavLink() {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  const href = `${admin}/guide`
  const active = usePathname() === href

  return (
    <Link
      href={href}
      id="nav-admin-guide"
      className="nav__link"
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: '10px 12px',
        fontWeight: 700,
        textDecoration: 'none',
        color: active ? '#000' : '#39ff14',
        background: active ? '#39ff14' : 'rgba(57, 255, 20, 0.08)',
        border: '1px solid rgba(57, 255, 20, 0.45)',
        borderRadius: 8,
      }}
    >
      Admin Guide
    </Link>
  )
}
