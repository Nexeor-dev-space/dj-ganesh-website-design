'use client'
import { useConfig } from '@payloadcms/ui'
import React from 'react'

/**
 * The "Help" button beside the save buttons (and above each list). Opens the
 * Admin Guide on this screen's section in a new tab, so unsaved work in this
 * tab is left alone. `section` is set per screen by withGuideLink.ts.
 */
export default function HelpLink({ section }: { section?: string }) {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()

  return (
    <a
      href={`${admin}/guide${section ? `#${section}` : ''}`}
      target="_blank"
      rel="noreferrer"
      title="Open step-by-step help for this screen in a new tab"
      className="admin-guide-help"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.4,
        color: '#fff',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(57, 255, 20, 0.45)',
        borderRadius: 8,
        background: 'rgba(57, 255, 20, 0.08)',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          width: 18,
          height: 18,
          fontSize: 12,
          fontWeight: 800,
          color: '#000',
          background: '#39ff14',
          borderRadius: '50%',
        }}
      >
        ?
      </span>
      Help
    </a>
  )
}
