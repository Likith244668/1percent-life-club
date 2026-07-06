import { useCallback, useEffect, useRef, useState } from 'react'
import { BG, INK, LABEL, BRONZE, CARD_BORDER, MQ_MOBILE, MQ_REDUCE } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE, useMedia } from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'
import sarahImg from '../assets/sarah-chen-cutout.png'
import marcusImg from '../assets/marcus-williams-cutout.png'
import priyaImg from '../assets/priya-desai-cutout.png'

/* ------------------------------------------------------------------ *
 * Data — member spotlights. Placeholder people written in the club's
 * voice; the client swaps in real members without touching the layout.
 * ------------------------------------------------------------------ */
const AMBASSADORS = [
  {
    id: 1,
    name: 'Sarah Chen',
    first: 'Sarah',
    role: 'Cardiothoracic surgeon',
    tagline: 'Precision in the theatre begins with precision at 6 a.m.',
    image: sarahImg,
    stats: [
      { label: 'Member since', value: '2023' },
      { label: 'Day streak', value: '412' },
      { label: 'Avg session', value: '24 min' },
    ],
  },
  {
    id: 2,
    name: 'Marcus Williams',
    first: 'Marcus',
    role: 'Founder & CEO, Meridian Capital',
    tagline: 'Excellence lives in the work nobody sees.',
    image: marcusImg,
    stats: [
      { label: 'Member since', value: '2022' },
      { label: 'Day streak', value: '731' },
      { label: 'Avg session', value: '26 min' },
    ],
  },
  {
    id: 3,
    name: 'Priya Desai',
    first: 'Priya',
    role: 'Consultant cardiologist',
    tagline: 'I prescribe what I practise: one percent, daily.',
    image: priyaImg,
    stats: [
      { label: 'Member since', value: '2024' },
      { label: 'Day streak', value: '168' },
      { label: 'Avg session', value: '21 min' },
    ],
  },
]

const N = AMBASSADORS.length
const DURATION = 650
const DISPLAY_FONT = "'Archivo',sans-serif"

/* Crisp outline for white text over a photo of unknown brightness — layered
 * zero-blur shadows in every direction (no cross-browser -webkit-text-stroke
 * clipping issues), plus one soft shadow for depth. */
function textOutline(width, color = 'rgba(40,28,16,0.9)', soft = '0 2px 10px rgba(40,28,16,0.6)') {
  const offsets = [
    [-width, -width], [0, -width], [width, -width],
    [-width, 0], [width, 0],
    [-width, width], [0, width], [width, width],
  ]
  const ring = offsets.map(([x, y]) => `${x}px ${y}px 0 ${color}`).join(', ')
  return `${ring}, ${soft}`
}

/* Soft film grain — generated inline as a data URI (no external stylesheet) */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")"

function JoinNowLink() {
  const [hover, setHover] = useState(false)
  const isMobile = useMedia(MQ_MOBILE)
  return (
    <a
      href="#join"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        position: 'absolute',
        zIndex: 60,
        // Mobile drops the link to its own row beneath the stat chips —
        // sharing the 56px baseline with the details block makes them collide.
        bottom: isMobile ? '14px' : '96px',
        right: 'clamp(16px,5vw,40px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textTransform: 'uppercase',
        fontFamily: DISPLAY_FONT,
        fontWeight: 800,
        fontSize: 'clamp(15px, 2.2vw, 30px)',
        letterSpacing: '-.01em',
        lineHeight: 1,
        color: hover ? BRONZE : INK,
        textDecoration: 'none',
        transition: 'color 200ms ease',
      }}
    >
      Request an invitation
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          transition: 'transform 200ms ease',
          transform: hover ? 'translate(3px,-3px)' : 'none',
        }}
      >
        <ArrowUpRight size={isMobile ? 16 : 26} strokeWidth={2.25} />
      </span>
    </a>
  )
}

export default function Ambassadors() {
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useMedia(MQ_MOBILE)
  const reduce = useMedia(MQ_REDUCE)
  const [paused, setPaused] = useState(false)
  const { ref: revealRef, reveal } = useReveal()

  const lockRef = useRef(false)
  const activeRef = useRef(0)
  const timerRef = useRef(null)

  /* keep a ref in sync so callbacks never read a stale index */
  useEffect(() => {
    activeRef.current = activeIndex
  }, [activeIndex])

  /* preload every portrait once on mount */
  useEffect(() => {
    AMBASSADORS.forEach((a) => {
      const img = new window.Image()
      img.src = a.image
    })
  }, [])

  const lock = useCallback(() => {
    lockRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      lockRef.current = false
    }, DURATION)
  }, [])

  const goTo = useCallback(
    (i) => {
      if (lockRef.current || i === activeRef.current) return
      lock()
      setActiveIndex(i)
    },
    [lock]
  )

  /* gentle autoplay — pauses on hover / focus, stops entirely under
     prefers-reduced-motion, and never fights the lock */
  useEffect(() => {
    if (paused || reduce) return
    const id = setInterval(() => {
      if (!lockRef.current) {
        lock()
        setActiveIndex((prev) => (prev + 1) % N)
      }
    }, 3000)
    return () => clearInterval(id)
  }, [paused, reduce, lock])

  /* role of a card relative to the current centre */
  const roleOf = (i) => {
    const offset = (i - activeIndex + N) % N
    if (offset === 0) return 'center'
    if (offset === 1) return 'right'
    if (offset === N - 1) return 'left'
    return 'back'
  }

  /* the single transition string shared by every animated element */
  const tween = (props) => props.map((p) => `${p} ${DURATION}ms ${EASE}`).join(', ')

  /* per-role visual recipe for the portrait cards */
  const cardVisual = (role) => {
    const sideX = isMobile ? 64 : 108 // % of own width
    const base = {
      transition: tween(['transform', 'filter', 'opacity']),
      willChange: 'transform, filter, opacity',
    }
    switch (role) {
      case 'center':
        return {
          ...base,
          transform: `translate(-50%, -50%) translateZ(${isMobile ? 0 : 80}px) scale(${isMobile ? 1 : 1.16})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 30,
        }
      case 'left':
        return {
          ...base,
          transform: `translate(-50%, -50%) translateX(-${sideX}%) rotateY(32deg) scale(0.62)`,
          filter: 'blur(2px)',
          opacity: isMobile ? 0 : 0.55,
          zIndex: 12,
        }
      case 'right':
        return {
          ...base,
          transform: `translate(-50%, -50%) translateX(${sideX}%) rotateY(-32deg) scale(0.62)`,
          filter: 'blur(2px)',
          opacity: isMobile ? 0 : 0.55,
          zIndex: 12,
        }
      default: // back (only with 4+ items; harmless for 3)
        return {
          ...base,
          transform: 'translate(-50%, -50%) translateY(-6%) scale(0.46)',
          filter: 'blur(4px)',
          opacity: 0,
          zIndex: 5,
        }
    }
  }

  return (
    <section
      id="ambassadors"
      aria-label="Member spotlights"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        color: INK,
        minHeight: 'clamp(620px, 92vh, 860px)',
        backgroundColor: BG,
        fontFamily: "'Archivo',sans-serif",
      }}
    >
      {/* The whole stage (ghost name, carousel, details) rises as one — the
          carousel's own choreography takes over once it has landed. */}
      <div ref={revealRef} style={{ position: 'relative', width: '100%', height: 'clamp(620px, 92vh, 860px)', overflow: 'hidden', ...reveal(0, 'translateY(36px)') }}>
        {/* depth wash — keeps the scene from looking flat as colours change */}
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              `radial-gradient(120% 90% at 50% 8%, color-mix(in srgb,${BRONZE} 16%,transparent) 0%, transparent 45%)`,
            transition: tween(['background']),
          }}
        />

        {/* moving glow that picks up each ambassador's tint */}
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 1,
            left: '50%',
            top: '54%',
            transform: 'translate(-50%, -50%)',
            width: 'min(720px, 80vw)',
            height: 'min(720px, 80vw)',
            borderRadius: '9999px',
            background: `radial-gradient(circle, color-mix(in srgb,${BRONZE} 22%,transparent) 0%, transparent 62%)`,
            opacity: 0.6,
            filter: 'blur(8px)',
          }}
        />

        {/* ghost display name — all names stacked, crossfading in Archivo 900 */}
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            display: 'flex',
            userSelect: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            top: isMobile ? '13%' : '17%',
          }}
        >
          {AMBASSADORS.map((a, i) => (
            <span
              key={a.id}
              style={{
                position: 'absolute',
                textTransform: 'uppercase',
                fontFamily: DISPLAY_FONT,
                fontWeight: 900,
                fontSize: 'clamp(56px, 20vw, 280px)',
                lineHeight: 1,
                letterSpacing: '-.04em',
                whiteSpace: 'nowrap',
                color: BRONZE,
                opacity: i === activeIndex ? 0.22 : 0,
                transform: `translateY(${i === activeIndex ? 0 : 14}px)`,
                transition: tween(['opacity', 'transform']),
              }}
            >
              {a.first}
            </span>
          ))}
        </div>

        {/* section eyebrow — the site-wide label, anchored to the stage */}
        <div style={{ position: 'absolute', left: 'clamp(16px,4vw,32px)', top: '24px', zIndex: 60 }}>
          <SectionLabel style={{ marginBottom: 0 }}>Member spotlights</SectionLabel>
        </div>

        {/* carousel stage */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, perspective: '2200px' }}>
          {AMBASSADORS.map((a, i) => {
            const role = roleOf(i)
            const clickable = role === 'left' || role === 'right'
            return (
              <button
                key={a.id}
                type="button"
                tabIndex={clickable ? 0 : -1}
                aria-label={clickable ? `View ${a.name}` : undefined}
                aria-hidden={!clickable && role !== 'center'}
                onClick={() => clickable && goTo(i)}
                style={{
                  ...cardVisual(role),
                  position: 'absolute',
                  padding: 0,
                  border: 'none',
                  left: '50%',
                  top: isMobile ? '44%' : '53%',
                  width: isMobile ? 'min(300px, 74vw)' : 'min(340px, 27vw)',
                  aspectRatio: '3 / 4',
                  cursor: clickable ? 'pointer' : 'default',
                  backgroundColor: 'transparent',
                }}
              >
                <img
                  src={a.image}
                  alt={a.name}
                  width={960}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                    filter: role === 'center' ? 'drop-shadow(0 22px 38px rgba(40,28,16,0.45))' : undefined,
                  }}
                />
                {/* nameplate only on the active card */}
                <span
                  aria-hidden="true"
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '0 20px 16px',
                    opacity: role === 'center' ? 1 : 0,
                    transition: tween(['opacity']),
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      textTransform: 'uppercase',
                      fontFamily: DISPLAY_FONT,
                      fontWeight: 900,
                      fontSize: 'clamp(19px, 2.2vw, 28px)',
                      letterSpacing: '-.01em',
                      lineHeight: 1.05,
                      color: '#fff',
                      textShadow: textOutline(1.5),
                    }}
                  >
                    {a.name}
                  </span>
                  <span
                    style={{
                      marginTop: '2px',
                      display: 'block',
                      fontSize: 'clamp(11px,1.4vw,12px)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color: '#fff',
                      opacity: 0.85,
                      textShadow: textOutline(1),
                    }}
                  >
                    {a.role}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* progress dots — centred directly beneath the active photo.
            Arrow keys move the carousel once any dot has focus. */}
        <div
          role="group"
          aria-label="Choose member"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo((activeRef.current + 1) % N) }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo((activeRef.current - 1 + N) % N) }
          }}
          style={{
            position: 'absolute',
            zIndex: 60,
            left: '50%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            top: isMobile ? '44%' : '53%',
            transform: isMobile
              ? 'translate(-50%, calc(min(300px, 74vw) * 0.667 + 22px))'
              : 'translate(-50%, calc(min(340px, 27vw) * 0.8 + 30px))',
            transition: tween(['transform']),
          }}
        >
          {AMBASSADORS.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={`Go to ${a.name}`}
              aria-current={i === activeIndex}
              onClick={() => goTo(i)}
              style={{
                borderRadius: '9999px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                height: 6,
                width: i === activeIndex ? 30 : 6,
                backgroundColor: i === activeIndex ? INK : 'rgba(21,17,13,0.18)',
                transition: tween(['width', 'background-color']),
              }}
            />
          ))}
        </div>

        {/* bottom-left — crossfading details + controls */}
        <div
          style={{
            position: 'absolute',
            zIndex: 60,
            bottom: isMobile ? '56px' : '96px',
            left: isMobile ? '16px' : '64px',
            maxWidth: 'min(92vw, 440px)',
          }}
        >
          <span style={{ display: 'block', fontSize: 'clamp(10px,1.3vw,12px)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: LABEL }}>
            Featured member
          </span>

          {/* fixed-height stack so the controls below never jump */}
          <div aria-live="polite" style={{ position: 'relative', height: isMobile ? 112 : 162, marginTop: 10 }}>
            {AMBASSADORS.map((a, i) => (
              <div
                key={a.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === activeIndex ? 1 : 0,
                  transform: `translateY(${i === activeIndex ? 0 : 16}px)`,
                  transition: tween(['opacity', 'transform']),
                  pointerEvents: i === activeIndex ? 'auto' : 'none',
                }}
              >
                <p style={{ margin: 0, fontSize: 'clamp(16px,1.8vw,18px)', fontWeight: 600, opacity: 0.95 }}>{a.role}</p>
                {!isMobile && (
                  <p style={{ margin: '4px 0 0', fontSize: '14px', lineHeight: 1.5, opacity: 0.82 }}>{a.tagline}</p>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: isMobile ? '12px' : '16px' }}>
                  {a.stats.map((s) => (
                    <div key={s.label} style={{ borderRadius: '12px', border: `1px solid ${CARD_BORDER}`, padding: '6px 12px', backgroundColor: '#fff', boxShadow: '0 20px 40px -32px rgba(40,28,16,.35)' }}>
                      <span style={{ display: 'block', fontSize: 'clamp(16px,1.8vw,18px)', fontWeight: 700, lineHeight: 1 }}>{s.value}</span>
                      <span style={{ marginTop: '4px', display: 'block', fontSize: 'clamp(9px,1.1vw,10px)', textTransform: 'uppercase', letterSpacing: '0.12em', color: LABEL }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom-right display link */}
        <JoinNowLink />

        {/* film grain — topmost, inert */}
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundImage: GRAIN,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            opacity: 0.2,
            mixBlendMode: 'soft-light',
          }}
        />
      </div>
    </section>
  )
}
