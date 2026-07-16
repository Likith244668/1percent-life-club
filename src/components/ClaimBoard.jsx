import { useEffect, useRef, useState } from 'react'
import { MQ_REDUCE } from '../theme.js'
import { StampCard } from './Stamp.jsx'
import { useMedia, EASE } from './useReveal.js'

/* The interactive "sugar problems" collage that takes over the hero once the
   ticket is scratched. A dense, gap-free field of uniform claim stamps flies in
   from the edges, bumps (and lifts above its neighbours) on hover, and — when
   clicked — flies smoothly to the centre (a measured FLIP transform) where the
   club's plain read fades in over a dimmed backdrop. Responsive: a lighter
   subset of smaller stamps on phones. Honours reduced motion. */
export default function ClaimBoard({ cards, revealed }) {
  const reduce = useMedia(MQ_REDUCE)
  const narrow = useMedia('(max-width: 720px)')
  const tablet = useMedia('(min-width: 721px) and (max-width: 1024px)')
  const boardRef = useRef(null)
  const slotRefs = useRef([])
  const [hovered, setHovered] = useState(null)
  const [active, setActive] = useState(null)
  const [activeTf, setActiveTf] = useState('')

  // Responsive count + uniform size: desktop 15, tablet 12, mobile 9. The card
  // list is curated so each prefix stays balanced across all four edges.
  const count = narrow ? 9 : tablet ? 12 : 15
  const CARD_W = narrow ? 156 : tablet ? 202 : 244
  const CARD_H = narrow ? 150 : tablet ? 160 : 190
  const FONT = narrow ? '1.15rem' : tablet ? '1.5rem' : '1.85rem'
  const list = cards.slice(0, count)

  const close = () => {
    setActive(null)
    setActiveTf('')
  }

  // Fly the clicked card to the board centre (measured, so it's exact).
  const openCard = (i) => {
    const board = boardRef.current
    const slot = slotRefs.current[i]
    if (!board || !slot || reduce) {
      setActive(i)
      return
    }
    const b = board.getBoundingClientRect()
    const r = slot.getBoundingClientRect()
    const dx = b.left + b.width / 2 - (r.left + r.width / 2)
    const dy = b.top + b.height * 0.4 - (r.top + r.height / 2)
    const scale = Math.max(1.2, Math.min(2.2, 360 / CARD_W))
    setActiveTf(`translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(0deg)`)
    setActive(i)
  }

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <div ref={boardRef} aria-hidden={!revealed} style={{ position: 'absolute', inset: 0, zIndex: active !== null ? 30 : 6, pointerEvents: 'none' }}>
      {/* backdrop behind a focused card */}
      <div
        onClick={close}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          background: 'rgba(8,8,8,.78)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: active !== null ? 1 : 0,
          transition: 'opacity .4s ease',
          pointerEvents: active !== null ? 'auto' : 'none',
        }}
      />

      {/* the claim stamps */}
      {list.map((c, i) => {
        const isActive = active === i
        const dim = active !== null && !isActive
        const rot = c.rot
        const tf = isActive
          ? activeTf
          : hovered === i && active === null && revealed
            ? `translate(0px,-14px) scale(1.08) rotate(${(rot * 0.35).toFixed(1)}deg)`
            : `translate(0px,0px) scale(1) rotate(${rot}deg)`
        // Entrance: fly in from the card's nearest edge (top/bottom/left/right).
        const enterTf =
          c.from === 'top'
            ? 'translateY(-175%)'
            : c.from === 'bottom'
              ? 'translateY(175%)'
              : c.from === 'right'
                ? 'translateX(155%)'
                : 'translateX(-155%)'
        return (
          <div
            key={c.id}
            ref={(el) => (slotRefs.current[i] = el)}
            style={{
              // slot — positions the card; the entrance fly-in lives here.
              position: 'absolute',
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              zIndex: isActive ? 40 : hovered === i ? 16 : 5,
              opacity: !revealed ? 0 : dim ? 0.16 : 1,
              transform: revealed ? 'translate(0px,0px)' : enterTf,
              transition: reduce ? 'none' : `opacity .55s ${EASE} ${revealed ? i * 45 : 0}ms, transform .8s ${EASE} ${revealed ? i * 45 : 0}ms`,
              pointerEvents: revealed && (active === null || isActive) ? 'auto' : 'none',
            }}
          >
            <div
              role="button"
              tabIndex={revealed ? 0 : -1}
              aria-label={`${c.text} — ${c.detail}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onClick={() => (isActive ? close() : openCard(i))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  isActive ? close() : openCard(i)
                }
              }}
              className="lc-claim"
              style={{
                transform: tf,
                transition: reduce ? 'none' : 'transform .48s cubic-bezier(.2,.75,.25,1), filter .3s ease',
                filter: isActive || hovered === i ? 'drop-shadow(0 24px 32px rgba(0,0,0,.6))' : 'drop-shadow(0 8px 14px rgba(0,0,0,.4))',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <StampCard text={c.text} tone={c.tone} w={CARD_W} h={CARD_H} size={FONT} rot={0} />
            </div>
          </div>
        )
      })}

      {/* focused card's read — fades in below the centred card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: narrow ? '70%' : '66%',
          transform: 'translateX(-50%)',
          width: 'min(460px, 88vw)',
          textAlign: 'center',
          zIndex: 34,
          opacity: active !== null ? 1 : 0,
          transition: 'opacity .4s ease .12s',
          pointerEvents: 'none',
        }}
      >
        {active !== null && (
          <>
            <p style={{ margin: 0, maxWidth: '42ch', marginInline: 'auto', fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.6, color: 'rgba(255,255,255,.85)' }}>{list[active].detail}</p>
            <span style={{ display: 'block', marginTop: '18px', fontSize: '11px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>Tap anywhere to close</span>
          </>
        )}
      </div>
    </div>
  )
}
