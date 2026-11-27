'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { guide, quickTasks, type Section, type Shot, type Task } from './content'
import s from './guide.module.css'

type Props = { adminRoute: string; shots: string[]; shotDir: string }

/* ---------------------------------------------------------------------- */
/* Inline text: **bold** and [label](href).                               */
/* ---------------------------------------------------------------------- */

function useLinkTarget(adminRoute: string) {
  return useCallback(
    (href: string) => {
      if (href.startsWith('#')) return { href }
      if (href.startsWith('/admin')) return { href: adminRoute + href.slice('/admin'.length) }
      // A page of the public website: open it beside the CMS.
      return { href, target: '_blank', rel: 'noreferrer' }
    },
    [adminRoute],
  )
}

function Rich({ text, link }: { text: string; link: ReturnType<typeof useLinkTarget> }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\(\d\))/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
        // (1), (2)…: the matching pink number on the screenshot.
        if (/^\(\d\)$/.test(p))
          return (
            <span key={i} className={s.callout} title={`Marked ${p.slice(1, -1)} on the screenshot`}>
              {p.slice(1, -1)}
            </span>
          )
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (m) return <a key={i} className={s.inlineLink} {...link(m[2])}>{m[1]}</a>
        return <React.Fragment key={i}>{p}</React.Fragment>
      })}
    </>
  )
}

/* ---------------------------------------------------------------------- */
/* Search                                                                  */
/* ---------------------------------------------------------------------- */

const plain = (t: string) => t.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').toLowerCase()

function taskText(t: Task) {
  return plain([t.title, t.intro ?? '', t.note ?? '', ...t.steps].join(' '))
}

function sectionText(sec: Section) {
  return plain([sec.title, sec.summary, sec.where?.text ?? '', ...(sec.dos ?? []), ...(sec.donts ?? [])].join(' '))
}

/** Every word of the query must appear somewhere in the text. */
function matches(text: string, query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => text.includes(w))
}

/* ---------------------------------------------------------------------- */

export function GuideClient({ adminRoute, shots, shotDir }: Props) {
  const link = useLinkTarget(adminRoute)
  const [query, setQuery] = useState('')
  const [zoom, setZoom] = useState<Shot | null>(null)
  const [active, setActive] = useState<string>('')
  const available = useMemo(() => new Set(shots), [shots])

  // Filter by the search box. A section matches if its own text matches
  // (then all its tasks show), otherwise only its matching tasks show.
  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return guide
    return guide
      .map((g) => ({
        ...g,
        sections: g.sections
          .map((sec) => {
            if (matches(sectionText(sec), q)) return sec
            const tasks = sec.tasks.filter((t) => matches(taskText(t), q))
            return tasks.length ? { ...sec, tasks, dos: undefined, donts: undefined } : null
          })
          .filter((sec): sec is Section => sec !== null),
      }))
      .filter((g) => g.sections.length)
  }, [query])

  const resultCount = filtered.reduce((n, g) => n + g.sections.length, 0)

  // Arriving from a screen's Help button (#section): scroll to it once the
  // page has rendered, since the admin frame mounts after the first paint.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id.split('--')[0])
    }, 150)
    return () => window.clearTimeout(t)
  }, [])

  // Highlight the contents entry of the section on screen.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-guide-section]'))
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive((visible[0].target as HTMLElement).id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [filtered])

  // Close the enlarged screenshot with Escape.
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const figure = (shot?: Shot) =>
    shot && available.has(shot.id) ? (
      <figure className={s.figure}>
        <button type="button" className={s.shotButton} onClick={() => setZoom(shot)} aria-label={`Enlarge: ${shot.alt}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot inside the admin */}
          <img src={`${shotDir}/${shot.id}.jpg`} alt={shot.alt} loading="lazy" className={s.shot} />
          <span className={s.zoomHint}>Click to enlarge</span>
        </button>
        {shot.caption ? <figcaption className={s.caption}>{shot.caption}</figcaption> : null}
      </figure>
    ) : null

  return (
    <div className={s.page}>
      {/* Header ------------------------------------------------------------ */}
      <header className={s.header}>
        <p className={s.eyebrow}>Admin Guide</p>
        <h1 className={s.title}>How to update your website</h1>
        <p className={s.lede}>
          Simple, step-by-step help for every part of the CMS. No technical knowledge needed. Look for the{' '}
          <strong>Help</strong> button on any screen to jump straight to the right instructions.
        </p>
        <label className={s.search}>
          <span className={s.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the guide, e.g. video, show, password…"
            aria-label="Search the guide"
            className={s.searchInput}
          />
        </label>
        {query.trim() ? (
          <p className={s.resultCount} role="status">
            {resultCount === 0
              ? 'Nothing found. Try a different word, such as “photo”, “show” or “email”.'
              : `${resultCount} ${resultCount === 1 ? 'section' : 'sections'} found`}
          </p>
        ) : null}
      </header>

      {/* Quick tasks ------------------------------------------------------- */}
      {!query.trim() ? (
        <section className={s.quick} aria-labelledby="quick-title">
          <h2 id="quick-title" className={s.quickTitle}>
            What do you want to do?
          </h2>
          <div className={s.quickGrid}>
            {quickTasks.map((q) => (
              <a key={q.href} href={q.href} className={s.quickCard}>
                <span className={s.quickIcon} aria-hidden>
                  {q.icon}
                </span>
                <span>{q.label}</span>
                <span className={s.quickArrow} aria-hidden>
                  →
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className={s.layout}>
        {/* Contents -------------------------------------------------------- */}
        <nav className={s.toc} aria-label="Guide contents">
          <p className={s.tocHeading}>Contents</p>
          {filtered.map((g) => (
            <div key={g.title} className={s.tocGroup}>
              <p className={s.tocGroupTitle}>{g.title}</p>
              <ul className={s.tocList}>
                {g.sections.map((sec) => (
                  <li key={sec.id}>
                    <a href={`#${sec.id}`} className={`${s.tocLink} ${active === sec.id ? s.tocLinkActive : ''}`}>
                      <span aria-hidden>{sec.icon}</span> {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sections -------------------------------------------------------- */}
        <div className={s.content}>
          {filtered.map((g) => (
            <div key={g.title} className={s.group}>
              <h2 className={s.groupTitle}>{g.title}</h2>
              {g.sections.map((sec) => (
                <section key={sec.id} id={sec.id} data-guide-section className={s.section} aria-labelledby={`${sec.id}-title`}>
                  <div className={s.sectionHead}>
                    <h3 id={`${sec.id}-title`} className={s.sectionTitle}>
                      <span className={s.sectionIcon} aria-hidden>
                        {sec.icon}
                      </span>
                      {sec.title}
                    </h3>
                    {sec.open ? (
                      <a className={s.openButton} {...link(sec.open.href)}>
                        {sec.open.label} →
                      </a>
                    ) : null}
                  </div>
                  <p className={s.summary}>
                    <Rich text={sec.summary} link={link} />
                  </p>

                  {sec.where ? (
                    <div className={s.where}>
                      <div className={s.whereText}>
                        <p className={s.whereLabel}>📍 Where this appears on the website</p>
                        <p>
                          <Rich text={sec.where.text} link={link} />
                        </p>
                        {sec.where.href ? (
                          <a className={s.inlineLink} {...link(sec.where.href)}>
                            View it on the website ↗
                          </a>
                        ) : null}
                      </div>
                      {sec.where.shot && available.has(sec.where.shot.id) ? (
                        <div className={s.whereShot}>{figure(sec.where.shot)}</div>
                      ) : null}
                    </div>
                  ) : null}

                  {sec.tasks.map((t) => (
                    <article key={t.id} id={`${sec.id}--${t.id}`} className={s.task}>
                      <h4 className={s.taskTitle}>{t.title}</h4>
                      {t.intro ? (
                        <p className={s.taskIntro}>
                          <Rich text={t.intro} link={link} />
                        </p>
                      ) : null}
                      <div className={t.shot && available.has(t.shot.id) ? s.taskBody : undefined}>
                        <ol className={s.steps}>
                          {t.steps.map((step, i) => (
                            <li key={i} className={s.step}>
                              <span className={s.stepNumber} aria-hidden>
                                {i + 1}
                              </span>
                              <span>
                                <Rich text={step} link={link} />
                              </span>
                            </li>
                          ))}
                        </ol>
                        {figure(t.shot)}
                      </div>
                      {t.note ? (
                        <p className={s.note}>
                          <span aria-hidden>💡 </span>
                          <Rich text={t.note} link={link} />
                        </p>
                      ) : null}
                    </article>
                  ))}

                  {sec.dos?.length || sec.donts?.length ? (
                    <div className={s.rules}>
                      {sec.dos?.length ? (
                        <div className={`${s.ruleBox} ${s.ruleDo}`}>
                          <p className={s.ruleTitle}>✅ Do</p>
                          <ul>
                            {sec.dos.map((d, i) => (
                              <li key={i}>
                                <Rich text={d} link={link} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {sec.donts?.length ? (
                        <div className={`${s.ruleBox} ${s.ruleDont}`}>
                          <p className={s.ruleTitle}>⛔ Don&rsquo;t</p>
                          <ul>
                            {sec.donts.map((d, i) => (
                              <li key={i}>
                                <Rich text={d} link={link} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <a href="#top-of-guide" className={s.backToTop} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                    ↑ Back to top
                  </a>
                </section>
              ))}
            </div>
          ))}

          <p className={s.footerNote}>
            Still stuck? Contact your website developer and tell them which screen you were on and what you clicked. A
            screenshot helps.
          </p>
        </div>
      </div>

      {/* Enlarged screenshot ------------------------------------------------- */}
      {zoom ? (
        <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={() => setZoom(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot inside the admin */}
          <img src={`${shotDir}/${zoom.id}.jpg`} alt={zoom.alt} className={s.lightboxImage} />
          <button type="button" className={s.lightboxClose} onClick={() => setZoom(null)}>
            Close ✕
          </button>
        </div>
      ) : null}
    </div>
  )
}
