import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { INK, MUTED, CARD_BORDER, SHADOW_CARD, MQ_REDUCE } from '../theme.js'
import ImageSlot from '../components/ImageSlot.jsx'
import useReveal, { useMedia } from '../components/useReveal.js'
import { Play } from '../components/Icons.jsx'

/* ------------------------------------------------------------------ data
   The club's build-in-public chapters — how the method and the app were shaped
   with founding members, in the open. Fully swap-friendly: add a real `src`
   (+ optional `poster`) to any chapter and it becomes a live autoplaying reel;
   with neither, the swappable poster placeholder renders. Titles are segment
   arrays — a plain string is normal text, a `{ mark }` object is an ink
   highlight. */
const CHAPTERS = [
  {
    id: 1,
    title: ['IT STARTED WITH A ', { mark: 'QUESTION' }],
    body: 'We asked 200 driven people what actually keeps them consistent. Their honest answers became the method.',
    media: {},
  },
  {
    id: 2,
    title: ['FIVE PILLARS, ', { mark: 'VOTED' }],
    body: 'Move, Fuel, Rest, Mind, Belong. Members ranked what mattered — so we built the daily around the full set.',
    media: {},
  },
  {
    id: 3,
    title: ['THE APP, ', { mark: 'IN THE OPEN' }],
    body: 'Every screen was tested by members before launch. The dashboard you’ll use was shaped by the people using it.',
    media: {},
  },
  {
    id: 4,
    title: [{ mark: '247 OF 250' }, ' SEATS'],
    body: 'We kept the circle small on purpose. A few seats open each quarter — by application only.',
    media: {},
  },
  {
    id: 5,
    title: ['BUILT TO LAST A ', { mark: 'DECADE' }],
    body: 'No thirty-day sprints. We designed for the version of you ten years from now.',
    media: {},
  },
]

/* --------------------------------------------------------------- headline */

// Renders a segment array as an uppercase headline with ink highlights.
function Highlight({ segments }) {
  return segments.map((s, i) =>
    typeof s === 'string' ? (
      <span key={i}>{s}</span>
    ) : (
      <mark
        key={i}
        style={{
          background: INK,
          color: '#fff',
          padding: '.04em .32em',
          borderRadius: '4px',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
        }}
      >
        {s.mark}
      </mark>
    ),
  )
}

/* ------------------------------------------------------------- overlays */

function Scrim() {
  return <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.72) 0%, rgba(10,10,10,.12) 34%, transparent 55%)', pointerEvents: 'none' }} />
}

function Caption({ text }) {
  return (
    <span style={{ position: 'absolute', left: '16px', right: '16px', bottom: '16px', zIndex: 3, color: '#fff', fontWeight: 600, fontSize: '15px', lineHeight: 1.28, textShadow: '0 2px 10px rgba(0,0,0,.55)' }}>
      {text}
    </span>
  )
}

/* ------------------------------------------------------------ live video
   Only used when a chapter supplies a real `src`. Autoplays muted/looped while
   ≥50% in view, pauses when it scrolls away; tap toggles sound. Under reduced
   motion it stays paused behind a play button. */
function StoryVideo({ src, poster, caption, reduce }) {
  const ref = useRef(null)
  const [muted, setMuted] = useState(true)
  const [started, setStarted] = useState(!reduce)

  useEffect(() => {
    const v = ref.current
    if (!v || reduce || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() },
      { threshold: 0.5 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])

  return (
    <>
      <video ref={ref} src={src} poster={poster} muted={muted} loop playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <Scrim />
      {caption && <Caption text={caption} />}

      {reduce && !started && (
        <button type="button" aria-label="Play clip" onClick={() => { setStarted(true); ref.current?.play() }} style={{ position: 'absolute', inset: 0, zIndex: 4, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={17} color={INK} />
          </span>
        </button>
      )}

      <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((m) => !m)} style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 5, width: '34px', height: '34px', borderRadius: '50%', border: 0, cursor: 'pointer', background: 'rgba(10,10,10,.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4z" />
          {muted ? <path d="m23 9-6 6M17 9l6 6" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
        </svg>
      </button>
    </>
  )
}

/* --------------------------------------------------------- media router */

function StoryMedia({ media, reduce }) {
  if (media.src) return <StoryVideo {...media} reduce={reduce} />

  // Placeholder state — a swappable ImageSlot poster; overlays mimic the
  // finished reel so the layout reads correctly before real clips land.
  return (
    <>
      <ImageSlot shape="rect" fit="cover" position="50% 30%" placeholder="Add clip / photo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {media.caption && <Scrim />}
      {media.caption && <Caption text={media.caption} />}
    </>
  )
}

/* --------------------------------------------------------- chapter card */

function ChapterCard({ chapter, i, reveal, reduce }) {
  return (
    <article
      style={{
        flex: '0 0 auto',
        width: 'clamp(272px,22vw,352px)',
        scrollSnapAlign: 'start',
        ...reveal(120 + i * 80, 'translateY(24px)'),
      }}
    >
      {/* header — when several cards sit side by side (desktop) its height is
          equalised imperatively to the tallest header so every media card's
          top edge lines up; on the single-card mobile rail it runs natural so
          the copy hugs its own clip. Height is owned by the effect below, not
          React, so it isn't in this style object. */}
      <div data-head style={{ marginBottom: 'clamp(12px,1.2vw,16px)' }}>
        <h3 style={{ margin: 0, fontWeight: 800, textTransform: 'uppercase', fontSize: 'clamp(17px,1.5vw,21px)', lineHeight: 1.25, letterSpacing: '-.01em', color: INK }}>
          <Highlight segments={chapter.title} />
        </h3>
        <p style={{ margin: 'clamp(10px,1vw,14px) 0 0', fontSize: '13.5px', lineHeight: 1.5, color: MUTED }}>{chapter.body}</p>
      </div>

      <div style={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: '20px', overflow: 'hidden', background: INK, boxShadow: SHADOW_CARD }}>
        <StoryMedia media={chapter.media} reduce={reduce} />
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ arrow button */

function RailArrow({ dir, onClick, hidden }) {
  return (
    <button
      type="button"
      aria-label={dir < 0 ? 'Previous' : 'Next'}
      onClick={onClick}
      style={{
        position: 'absolute', top: '50%',
        [dir < 0 ? 'left' : 'right']: 'clamp(4px,1vw,16px)',
        transform: 'translateY(-50%)', zIndex: 6,
        width: 'clamp(44px,3.4vw,52px)', height: 'clamp(44px,3.4vw,52px)',
        borderRadius: '50%', border: `1px solid ${CARD_BORDER}`, background: '#fff',
        cursor: 'pointer', display: hidden ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
        color: INK, boxShadow: '0 18px 40px -20px rgba(0,0,0,.4)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir < 0 ? 'rotate(180deg)' : 'none' }}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  )
}

/* ----------------------------------------------------------------- section */

export default function BuiltWithYou() {
  const reduce = useMedia(MQ_REDUCE)
  // Equal header heights only help when several cards sit side by side (desktop
  // row) so their media boxes line up. In the single-card mobile rail it just
  // leaves a ragged gap between short copy and the media, so let headers run
  // natural there and every card's text hugs its own clip.
  const alignHeads = useMedia('(min-width: 640px)')
  const { ref, reveal } = useReveal()
  const railRef = useRef(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  // Equalise header heights so the media cards line up — but only when cards
  // sit side by side (desktop). We drive the height imperatively rather than
  // through state: measuring meant blanking each header to `auto`, and routing
  // the result back through setState silently failed whenever the new max
  // equalled the old one (React bailed on the re-render and left every header
  // stuck at the measured `auto`, so nothing lined up). Writing the final
  // height straight to the node each pass keeps it correct on first paint,
  // on resize, across the 640px breakpoint, and after web fonts settle.
  useLayoutEffect(() => {
    const el = railRef.current
    if (!el) return
    const equalise = () => {
      const heads = el.querySelectorAll('[data-head]')
      heads.forEach((h) => { h.style.height = 'auto' })
      if (!alignHeads) return // mobile: leave each header at its natural height
      let max = 0
      heads.forEach((h) => { max = Math.max(max, h.offsetHeight) })
      heads.forEach((h) => { h.style.height = `${max}px` })
    }
    equalise()
    window.addEventListener('resize', equalise)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalise)
    return () => window.removeEventListener('resize', equalise)
  }, [alignHeads])

  // Track scroll so the arrows hide at the ends.
  const measure = () => {
    const el = railRef.current
    if (!el) return
    setEdges({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }
  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const nudge = (dir) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="built" style={{ padding: 'clamp(40px,5vw,84px) 0' }}>
      <style>{`.lc-built-rail{scrollbar-width:none;-ms-overflow-style:none;}.lc-built-rail::-webkit-scrollbar{display:none;}`}</style>

      <div ref={ref}>
        <div style={{ padding: '0 clamp(20px,5vw,64px)', textAlign: 'center', marginBottom: 'clamp(30px,4vw,52px)', ...reveal(0) }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', letterSpacing: '-.035em', lineHeight: 1.06, color: INK }}>
            Built with you.
          </h2>
          <p style={{ margin: '14px auto 0', maxWidth: '52ch', fontSize: '15px', lineHeight: 1.6, color: MUTED }}>
            The club wasn&rsquo;t designed in a boardroom. It was built in the open, with the
            people who&rsquo;d live in it.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            ref={railRef}
            className="lc-built-rail"
            onScroll={measure}
            style={{
              display: 'flex',
              gap: 'clamp(14px,1.4vw,20px)',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 clamp(20px,5vw,64px)',
              scrollPaddingLeft: 'clamp(20px,5vw,64px)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {CHAPTERS.map((c, i) => (
              <ChapterCard key={c.id} chapter={c} i={i} reveal={reveal} reduce={reduce} />
            ))}
          </div>

          <RailArrow dir={-1} onClick={() => nudge(-1)} hidden={edges.atStart} />
          <RailArrow dir={1} onClick={() => nudge(1)} hidden={edges.atEnd} />
        </div>
      </div>
    </section>
  )
}
