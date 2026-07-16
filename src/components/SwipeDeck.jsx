import { useRef, useState } from 'react'
import { useMedia } from './useReveal.js'
import { ACCENT, INK, MUTED, CARD_BORDER, MQ_REDUCE } from '../theme.js'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

/**
 * A drag-to-swipe card stack — the Tinder-style deck, rebuilt without a
 * library. The top card follows the pointer (translate + a little rotation);
 * release past a threshold and it flings off-screen and the next card rises
 * into place. Loops forever.
 *
 * Controls: left/right chevron buttons, keyboard arrows, and progress dots.
 * Under prefers-reduced-motion the drag physics are disabled and the buttons
 * simply step through the deck.
 *
 * Props:
 *   cards       array of card data
 *   renderCard  (card, index, isTop) => node   — caller owns the card visuals
 *   height      deck height (the cards fill it)
 */
export default function SwipeDeck({ cards, renderCard, height = 340 }) {
  const reduce = useMedia(MQ_REDUCE)
  const n = cards.length
  const [index, setIndex] = useState(0)
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const [anim, setAnim] = useState(false) // transition on (release) vs off (drag)
  const dragging = useRef(false)
  const start = useRef({ x: 0, y: 0 })
  const deltaRef = useRef({ x: 0, y: 0 })
  const THRESH = 90

  const advance = () => setIndex((i) => (i + 1) % n)

  // Send the top card off in `dir` (-1 left, +1 right), then swap in the next.
  const fling = (dir) => {
    if (reduce) {
      advance()
      return
    }
    setAnim(true)
    setDelta({ x: dir * 640, y: deltaRef.current.y })
    deltaRef.current = { x: dir * 640, y: deltaRef.current.y }
    window.setTimeout(() => {
      setAnim(false)
      setDelta({ x: 0, y: 0 })
      deltaRef.current = { x: 0, y: 0 }
      advance()
    }, 300)
  }

  const onDown = (e) => {
    if (reduce) return
    dragging.current = true
    setAnim(false)
    start.current = { x: e.clientX, y: e.clientY }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }
  const onMove = (e) => {
    if (!dragging.current) return
    const d = { x: e.clientX - start.current.x, y: e.clientY - start.current.y }
    deltaRef.current = d
    setDelta(d)
  }
  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    const dx = deltaRef.current.x
    if (Math.abs(dx) > THRESH) {
      fling(dx > 0 ? 1 : -1)
    } else {
      setAnim(true)
      setDelta({ x: 0, y: 0 })
      deltaRef.current = { x: 0, y: 0 }
      window.setTimeout(() => setAnim(false), 300)
    }
  }

  // The visible stack: the top card plus up to two peeking behind it.
  const layerCount = Math.min(3, n)
  const layers = []
  for (let o = layerCount - 1; o >= 0; o--) {
    const ci = (index + o) % n
    const isTop = o === 0
    // How far this card has been dragged, as a 0..1 "commit" for the stamp.
    const commit = isTop ? Math.min(1, Math.abs(delta.x) / 140) : 0
    layers.push(
      <div
        key={cards[ci].id ?? ci}
        onPointerDown={isTop ? onDown : undefined}
        onPointerMove={isTop ? onMove : undefined}
        onPointerUp={isTop ? onUp : undefined}
        onPointerLeave={isTop ? onUp : undefined}
        onPointerCancel={isTop ? onUp : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10 - o,
          transform: isTop
            ? `translate(${delta.x}px, ${delta.y}px) rotate(${delta.x * 0.045}deg)`
            : `translateY(${o * 16}px) scale(${1 - o * 0.05})`,
          transformOrigin: 'center bottom',
          transition: isTop
            ? anim
              ? 'transform .3s cubic-bezier(.2,.75,.25,1)'
              : 'none'
            : 'transform .35s cubic-bezier(.2,.75,.25,1)',
          cursor: isTop && !reduce ? 'grab' : 'default',
          touchAction: 'none',
        }}
      >
        {renderCard(cards[ci], ci, isTop)}
        {/* Directional tint that firms up as you drag the top card. */}
        {isTop && !reduce && commit > 0.02 && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 24,
              background:
                delta.x > 0
                  ? `linear-gradient(90deg, transparent, ${ACCENT}22)`
                  : `linear-gradient(270deg, transparent, ${ACCENT}22)`,
              opacity: commit,
            }}
          />
        )}
      </div>,
    )
  }

  const btn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: `1px solid ${CARD_BORDER}`,
    background: '#fff',
    color: INK,
    cursor: 'pointer',
    boxShadow: '0 10px 24px -18px rgba(0,0,0,.4)',
    transition: 'transform .2s ease, background .2s ease, color .2s ease',
  }

  return (
    <div
      role="group"
      aria-roledescription="card deck"
      aria-label="Swipe through the club's sugar defaults"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          fling(-1)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          fling(1)
        }
      }}
      className="lc-deck"
      style={{ userSelect: 'none', outline: 'none' }}
    >
      <div style={{ position: 'relative', height, maxWidth: '420px', margin: '0 auto' }}>{layers}</div>

      {/* Controls: chevrons + progress dots. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginTop: 'clamp(20px,3vw,30px)',
        }}
      >
        <button type="button" aria-label="Swipe left" className="lc-deck-btn" style={btn} onClick={() => fling(-1)}>
          <ChevronLeft size={20} />
        </button>

        <div style={{ display: 'flex', gap: '8px' }} aria-hidden="true">
          {cards.map((c, i) => (
            <span
              key={c.id ?? i}
              style={{
                width: i === index ? '22px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === index ? ACCENT : 'rgba(255,255,255,.28)',
                transition: 'width .3s ease, background .3s ease',
              }}
            />
          ))}
        </div>

        <button type="button" aria-label="Swipe right" className="lc-deck-btn" style={btn} onClick={() => fling(1)}>
          <ChevronRight size={20} />
        </button>
      </div>

      <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '13px', color: MUTED }}>
        Drag a card, or use the arrows — <span style={{ color: '#fff' }}>{index + 1}</span> / {n}
      </p>
    </div>
  )
}
