import { useState, useEffect, useCallback } from 'react'
import { ACCENT, STAGE, INK, MUTED_SOFT, LABEL, MQ_NAV, MQ_REDUCE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import { useMedia } from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

// Primary navigation. Each id maps to a real section anchor on the page.
const LINKS = [
  { id: 'vision', label: 'Vision' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'sugar', label: 'On sugar' },
  { id: 'stories', label: 'Stories' },
]

// Sections tracked by the scroll-spy (drives the active nav underline).
const SPY_IDS = ['top', 'problem', 'vision', 'pillars', 'sugar', 'stories', 'join', 'app']

// Height reserved so anchor jumps land below the fixed bar instead of under it.
const HEADER_OFFSET = 92

/* ------------------------------------------------------------------ hooks */

// Tracks page scroll: whether we've left the very top, and 0→1 read progress.
function useScroll() {
  const [state, setState] = useState({ scrolled: false, progress: 0 })
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const y = window.scrollY || 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight || 1
      setState({ scrolled: y > 8, progress: Math.min(1, Math.max(0, y / max)) })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return state
}

// Highlights whichever section currently sits across the viewport's mid-line.
function useActiveSection(ids) {
  const [active, setActive] = useState('')
  const key = ids.join(',')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}

/* ------------------------------------------------------------------- parts */

function Brand({ onClick }) {
  return (
    <a
      href="#top"
      onClick={onClick}
      aria-label="1% Life Club — home"
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', textDecoration: 'none', color: INK }}
    >
      <span style={{ fontWeight: 900, fontSize: '21px', letterSpacing: '-.03em' }}>1%</span>
      <span style={{ fontWeight: 600, fontSize: '12px', letterSpacing: '.16em' }}>LIFE&nbsp;CLUB</span>
    </a>
  )
}

function NavLink({ item, active, onNavigate }) {
  const [hover, setHover] = useState(false)
  const on = active || hover
  return (
    <a
      href={`#${item.id}`}
      aria-current={active ? 'page' : undefined}
      onClick={(e) => { e.preventDefault(); onNavigate(item.id) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        position: 'relative',
        fontSize: '14px',
        fontWeight: 500,
        color: on ? INK : LABEL,
        textDecoration: 'none',
        padding: '6px 2px',
        transition: 'color .25s',
      }}
    >
      {item.label}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '2px',
          right: '2px',
          bottom: '-3px',
          height: '2px',
          borderRadius: '2px',
          background: INK,
          transformOrigin: 'left',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          opacity: active ? 1 : 0,
          transition: 'transform .3s ease, opacity .3s ease',
        }}
      />
    </a>
  )
}

function Burger({ open, reduce, ...rest }) {
  const line = {
    display: 'block',
    width: '18px',
    height: '2px',
    borderRadius: '2px',
    background: open ? '#fff' : INK,
    transition: reduce ? 'none' : 'transform .3s ease, background .3s ease',
  }
  return (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="lc-hd-menu"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        width: '44px',
        height: '44px',
        padding: 0,
        borderRadius: '13px',
        border: '1px solid rgba(21,17,13,.10)',
        background: open ? INK : 'rgba(255,255,255,.55)',
        cursor: 'pointer',
        transition: 'background .3s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      {...rest}
    >
      <span style={{ ...line, transform: open ? 'translateY(3.5px) rotate(45deg)' : 'none' }} />
      <span style={{ ...line, transform: open ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }} />
    </button>
  )
}

/* ------------------------------------------------------------------ header */

export default function Header() {
  const { scrolled, progress } = useScroll()
  const isMobile = useMedia(MQ_NAV)
  const reduce = useMedia(MQ_REDUCE)
  const active = useActiveSection(SPY_IDS)
  const [open, setOpen] = useState(false)

  // Smooth-scroll to a section, accounting for the fixed bar's height.
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' })
    if (window.history?.replaceState) window.history.replaceState(null, '', `#${id}`)
  }, [reduce])

  const navigate = useCallback((id) => { setOpen(false); scrollTo(id) }, [scrollTo])
  const toTop = useCallback((e) => {
    e.preventDefault()
    setOpen(false)
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [reduce])

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Esc closes the overlay; a jump to desktop width force-closes it.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  useEffect(() => { if (!isMobile) setOpen(false) }, [isMobile])

  const barStyle = {
    display: isMobile ? 'flex' : 'grid',
    gridTemplateColumns: isMobile ? undefined : '1fr auto 1fr',
    justifyContent: isMobile ? 'space-between' : undefined,
    alignItems: 'center',
    gap: '18px',
    padding: scrolled ? '10px clamp(16px,2.4vw,26px)' : '16px clamp(16px,2.4vw,30px)',
    borderRadius: '18px',
    border: `1px solid ${scrolled ? 'rgba(21,17,13,.07)' : 'transparent'}`,
    background: scrolled ? 'rgba(255,255,255,.8)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
    boxShadow: scrolled ? '0 22px 50px -34px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.7)' : 'none',
    transition: reduce
      ? 'none'
      : 'background .4s ease, box-shadow .4s ease, border-color .4s ease, padding .35s ease, backdrop-filter .4s ease',
  }

  const navLinkPlain = {
    fontSize: '14px', fontWeight: 500, color: LABEL, textDecoration: 'none', transition: 'color .3s',
  }

  return (
    <>
      <style>{`
        section[id] { scroll-margin-top: 96px; }
        .lc-hd a:focus-visible, .lc-hd button:focus-visible,
        .lc-menu a:focus-visible, .lc-menu button:focus-visible {
          outline: 2px solid ${ACCENT}; outline-offset: 3px; border-radius: 8px;
        }
        .lc-skip:focus { transform: translateY(0) !important; opacity: 1 !important; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      `}</style>

      {/* Skip link — visible only when keyboard-focused */}
      <a
        href="#top"
        className="lc-skip"
        onClick={toTop}
        style={{
          position: 'fixed', top: '12px', left: '12px', zIndex: 300,
          background: INK, color: '#fff', padding: '10px 16px', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          transform: 'translateY(-160%)', opacity: 0, transition: 'transform .2s ease, opacity .2s ease',
        }}
      >
        Skip to content
      </a>

      {/* Reading-progress line */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, height: '2px',
          width: `${progress * 100}%`,
          background: ACCENT,
          borderRadius: '0 2px 2px 0', zIndex: 200,
          transition: reduce ? 'none' : 'width .1s linear',
          opacity: progress > 0.001 ? 1 : 0,
        }}
      />

      <header
        className="lc-hd"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: 'clamp(10px,1.3vw,18px) clamp(10px,1.3vw,18px) 0',
        }}
      >
        <div style={barStyle}>
          {isMobile ? (
            <>
              <Brand onClick={toTop} />
              <Burger open={open} reduce={reduce} onClick={() => setOpen((o) => !o)} />
            </>
          ) : (
            <>
              <div style={{ justifySelf: 'start' }}>
                <Brand onClick={toTop} />
              </div>

              <nav aria-label="Primary" style={{ justifySelf: 'center', display: 'flex', alignItems: 'center', gap: 'clamp(14px,2vw,30px)', flexWrap: 'wrap' }}>
                {LINKS.map((item) => (
                  <NavLink key={item.id} item={item} active={active === item.id} onNavigate={navigate} />
                ))}
              </nav>

              <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Hoverable
                  as="a"
                  href="#join"
                  onClick={(e) => { e.preventDefault(); navigate('join') }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontSize: '14px', fontWeight: 600, color: INK, background: 'transparent',
                    padding: '10px 22px', borderRadius: '100px', textDecoration: 'none',
                    border: `1.5px solid ${INK}`,
                    transition: 'transform .3s, background .3s, color .3s',
                  }}
                  hoverStyle={{ background: INK, color: '#fff', transform: 'translateY(-1px)' }}
                >
                  Request an invitation
                </Hoverable>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        id="lc-hd-menu"
        className="lc-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0, zIndex: 95,
          background: STAGE,
          display: 'flex', flexDirection: 'column',
          padding: 'clamp(96px,18vw,128px) clamp(24px,7vw,48px) clamp(28px,7vw,44px)',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
          transition: reduce ? 'none' : 'opacity .35s ease, visibility .35s ease',
        }}
      >
        <nav aria-label="Mobile" style={{ display: 'flex', flexDirection: 'column' }}>
          {LINKS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); navigate(item.id) }}
              style={{
                display: 'flex', alignItems: 'baseline', gap: '16px',
                padding: 'clamp(12px,2.6vw,16px) 0',
                borderBottom: '1px solid rgba(21,17,13,.07)',
                fontSize: 'clamp(28px,8vw,44px)', fontWeight: 800, letterSpacing: '-.03em',
                color: INK, textDecoration: 'none',
                transform: open ? 'translateY(0)' : 'translateY(14px)',
                opacity: open ? 1 : 0,
                transition: reduce ? 'none' : `transform .45s cubic-bezier(.2,.7,.2,1) ${0.06 + i * 0.05}s, opacity .45s ease ${0.06 + i * 0.05}s, color .25s`,
              }}
            >
              {/* The active section is marked by its index number turning ink. */}
              <span style={{ fontSize: '13px', fontWeight: 600, color: active === item.id ? INK : MUTED_SOFT, letterSpacing: '.14em', minWidth: '26px', transition: 'color .25s' }}>
                0{i + 1}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '28px' }}>
          <Hoverable
            as="a"
            href="#join"
            onClick={(e) => { e.preventDefault(); navigate('join') }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontSize: '16px', fontWeight: 700, color: '#fff', background: ACCENT,
              padding: '17px 26px', borderRadius: '100px', textDecoration: 'none',
              transition: 'transform .3s, background .3s',
            }}
            hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
          >
            Request an invitation
            <ArrowUpRight size={16} />
          </Hoverable>
          <a
            href="mailto:members@1percentlifeclub.com"
            onClick={() => setOpen(false)}
            style={{ textAlign: 'center', fontSize: '15px', fontWeight: 600, color: MUTED_SOFT, textDecoration: 'none', padding: '8px' }}
          >
            Already a member? Sign in
          </a>
        </div>
      </div>
    </>
  )
}
