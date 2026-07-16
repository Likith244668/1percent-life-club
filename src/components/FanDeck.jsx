import { useRef, useState } from 'react'
import { ACCENT, INK, MUTED, CARD_BORDER } from '../theme.js'
import { useMedia, EASE } from './useReveal.js'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

/* A fanned card deck — the reference microsite's rounded "flower" of cards: a
   dense ring of identical rounded-rectangle petals radiating around a single
   upright front card that carries the content. Drag the front card (or use the
   ‹ Swipe › controls) and it arcs smoothly to the back of the ring while the
   next petal rises to front and the content advances.

   A fixed 16 petals make the ring read as a smooth flower even though only a
   handful of cards carry copy — the back petals are decorative colour only,
   content lives on the front petal. Every petal shares ONE transform structure
   (translate · translate · rotate · scale) so the browser interpolates cleanly
   between the drag, the centre and the ring positions. */

const PETALS = 16
const STEP = 360 / PETALS
const BACKS = ['#FF6B00', '#EFEBE4', '#343434'] // orange / cream / graphite, cycled

export default function FanDeck({ cards }) {
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const narrow = useMedia('(max-width: 640px)')
  const L = cards.length
  const W = narrow ? 206 : 250
  const H = narrow ? 272 : 330
  const RAD = narrow ? 64 : 82 // how far each petal rings out from centre
  const [pos, setPos] = useState(0)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const start = useRef({ x: 0, y: 0 })
  const dref = useRef({ x: 0, y: 0 })
  const THRESH = 76

  const go = (dir) => setPos((p) => p + dir)
  const content = cards[((pos % L) + L) % L]

  const onDown = (e) => {
    if (reduce) return
    dragging.current = true
    start.current = { x: e.clientX, y: e.clientY }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }
  const onMove = (e) => {
    if (!dragging.current) return
    const d = { x: e.clientX - start.current.x, y: e.clientY - start.current.y }
    dref.current = d
    setDrag(d)
  }
  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    const past = Math.abs(dref.current.x) > THRESH || Math.abs(dref.current.y) > THRESH
    setDrag({ x: 0, y: 0 })
    dref.current = { x: 0, y: 0 }
    if (past) go(1)
  }

  const btn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,.28)',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background .2s ease, transform .2s ease',
  }

  return (
    <div style={{ userSelect: 'none' }}>
      <div className="lc-fan" style={{ position: 'relative', height: narrow ? 400 : 500, maxWidth: 560, margin: '0 auto' }}>
        {Array.from({ length: PETALS }, (_, i) => {
          const rel = (((i - pos) % PETALS) + PETALS) % PETALS
          const isFront = rel === 0
          const a = rel * STEP
          const rad = (a * Math.PI) / 180
          const X = isFront ? drag.x : RAD * Math.sin(rad)
          const Y = isFront ? drag.y : -RAD * Math.cos(rad)
          const A = isFront ? drag.x * 0.05 : a
          const S = isFront ? 1 : 0.96
          const tf = `translate(-50%,-50%) translate(${X.toFixed(1)}px, ${Y.toFixed(1)}px) rotate(${A.toFixed(1)}deg) scale(${S})`
          const noTransition = reduce || (isFront && dragging.current)
          return (
            <div
              key={i}
              onPointerDown={isFront ? onDown : undefined}
              onPointerMove={isFront ? onMove : undefined}
              onPointerUp={isFront ? onUp : undefined}
              onPointerCancel={isFront ? onUp : undefined}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: W,
                height: H,
                transformOrigin: 'center center',
                transform: tf,
                transition: noTransition ? 'none' : `transform .55s ${EASE}, background .45s ease`,
                zIndex: 100 - rel,
                background: isFront ? '#F5F2EC' : BACKS[i % BACKS.length],
                borderRadius: 22,
                border: isFront ? `1px solid ${CARD_BORDER}` : 'none',
                boxShadow: isFront ? '0 34px 60px -30px rgba(0,0,0,.7)' : '0 16px 30px -24px rgba(0,0,0,.6)',
                cursor: isFront && !reduce ? 'grab' : 'default',
                touchAction: 'none',
                overflow: 'hidden',
              }}
            >
              {isFront && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'clamp(22px,3vw,28px)' }}>
                  <span style={{ alignSelf: 'flex-start', fontSize: '12px', fontWeight: 600, color: INK, background: '#fff', border: `1px solid ${CARD_BORDER}`, borderRadius: '100px', padding: '6px 14px' }}>
                    {content.tag}
                  </span>
                  <h3 style={{ margin: 'clamp(18px,2.6vw,26px) 0 0', fontWeight: 800, fontSize: 'clamp(1.4rem,2.8vw,1.9rem)', lineHeight: 1.05, letterSpacing: '-.03em', color: INK }}>
                    {content.title}
                  </h3>
                  <p style={{ margin: '12px 0 0', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.55, color: MUTED }}>{content.line}</p>
                  <span style={{ marginTop: 'auto', fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '15px', color: ACCENT }}>
                    {String((((pos % L) + L) % L) + 1).padStart(2, '0')} / {String(L).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ‹ Swipe › */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: 'clamp(16px,2.4vw,26px)' }}>
        <button type="button" aria-label="Previous" className="lc-fan-btn" style={btn} onClick={() => go(-1)}>
          <ChevronLeft size={18} />
        </button>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>Swipe</span>
        <button type="button" aria-label="Next" className="lc-fan-btn" style={btn} onClick={() => go(1)}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
