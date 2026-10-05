'use client'
import React, { useEffect, useState } from 'react'

type Sub = { id: number | string; name?: string; email?: string; eventType?: string; status?: string; createdAt?: string }

const SITE = 'http://localhost:3000'

async function count(slug: string, where = ''): Promise<number | null> {
  try {
    const r = await fetch(`/api/${slug}?limit=0&depth=0${where}`, { credentials: 'include' })
    if (!r.ok) return null
    return (await r.json()).totalDocs ?? null
  } catch {
    return null
  }
}

const card: React.CSSProperties = {
  border: '1px solid rgba(255,107,0,0.35)',
  borderRadius: 10,
  padding: '14px 16px',
  background: 'rgba(255,107,0,0.06)',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
}
const btn: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 8,
  background: '#ff6b00',
  color: '#000',
  fontWeight: 700,
  textDecoration: 'none',
  fontSize: 14,
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({})
  const [subs, setSubs] = useState<Sub[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [shows, music, testimonials, unread] = await Promise.all([
        count('upcoming-shows'),
        count('music-releases'),
        count('testimonials'),
        count('contact-submissions', '&where[status][equals]=new'),
      ])
      if (alive) setCounts({ shows, music, testimonials, unread })
      try {
        const r = await fetch('/api/contact-submissions?limit=5&sort=-createdAt&depth=0', { credentials: 'include' })
        if (r.ok && alive) setSubs((await r.json()).docs ?? [])
      } catch {}
    })()
    return () => {
      alive = false
    }
  }, [])

  const stat = (label: string, key: string, href: string) => (
    <a href={href} style={card} key={key}>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#ff6b00' }}>{counts[key] ?? '–'}</div>
      <div style={{ fontSize: 13, opacity: 0.85 }}>{label}</div>
    </a>
  )

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 4 }}>Welcome back</h2>
      <p style={{ opacity: 0.75, marginTop: 0 }}>Quick actions and a snapshot of your site.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '16px 0' }}>
        <a style={btn} href="/admin/globals/home-page">Edit Home Page</a>
        <a style={btn} href="/admin/collections/upcoming-shows/create">Add Show</a>
        <a style={btn} href="/admin/collections/music-releases/create">Add Music</a>
        <a style={btn} href={SITE + '/'} target="_blank" rel="noreferrer">View live site</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
        {stat('Upcoming shows', 'shows', '/admin/collections/upcoming-shows')}
        {stat('Music releases', 'music', '/admin/collections/music-releases')}
        {stat('Testimonials', 'testimonials', '/admin/collections/testimonials')}
        {stat('Unread submissions', 'unread', '/admin/collections/contact-submissions')}
      </div>
      <h3 style={{ margin: '24px 0 8px' }}>Recent contact submissions</h3>
      {subs.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No submissions yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {subs.map((s) => (
            <a key={s.id} style={card} href={`/admin/collections/contact-submissions/${s.id}`}>
              <strong>{s.name}</strong> <span style={{ opacity: 0.7 }}>· {s.email}</span>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {s.eventType || 'Enquiry'} · {s.status} · {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
