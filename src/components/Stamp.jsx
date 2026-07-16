import { useEffect, useMemo, useRef, useState } from 'react'
import { ACCENT, FONT_DISPLAY } from '../theme.js'

/* Postage-stamp / ticket edge — the perforated sawtooth border seen on the
   reference microsite. Built with clip-path (not CSS masks) because a computed
   polygon gives even teeth at any size and clips the interactive canvas cleanly,
   with none of the cross-browser mask-composite pain. */

// A polygon() string tracing a sawtooth "stamp" perimeter for a w×h box.
// Teeth bite inward by `depth`, spaced ~`tooth` px apart along every edge.
export function stampPolygon(w, h, tooth = 14, depth = 7) {
  const pts = []
  const edge = (ax, ay, bx, by, nx, ny) => {
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy)
    const n = Math.max(3, Math.round(len / tooth))
    const ux = dx / len
    const uy = dy / len
    for (let i = 0; i < n; i++) {
      const outer = (i / n) * len
      const inner = ((i + 0.5) / n) * len
      pts.push([ax + ux * outer, ay + uy * outer]) // point on the edge line
      pts.push([ax + ux * inner + nx * depth, ay + uy * inner + ny * depth]) // notch inward
    }
  }
  // Walk the four edges clockwise; each inward normal points into the card.
  edge(0, 0, w, 0, 0, 1)
  edge(w, 0, w, h, -1, 0)
  edge(w, h, 0, h, 0, -1)
  edge(0, h, 0, 0, 1, 0)
  return 'polygon(' + pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',') + ')'
}

// Measures an element and keeps a matching stamp clip-path in sync on resize.
// Attach `ref` to the element and spread `clipPath` into its style (both the
// standard and -webkit- properties).
export function useStampClip({ tooth = 14, depth = 7 } = {}) {
  const ref = useRef(null)
  const [clip, setClip] = useState('none')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const compute = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w && h) setClip(stampPolygon(w, h, tooth, depth))
    }
    compute()
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(compute)
      ro.observe(el)
    }
    return () => ro && ro.disconnect()
  }, [tooth, depth])
  return { ref, clipPath: clip }
}

/* A tilted decorative stamp tile (the scattered "claim" tiles behind the hero).
   Orange stamps carry white type; cream stamps carry orange — mirroring the
   reference's two-tone collage. Positioning is left to the caller so an
   animated wrapper can translate it without fighting this element's rotation. */
export function StampCard({ text, tone = 'orange', w = 150, h = 150, size = '1.6rem', rot = 0, tooth = 12, depth = 6, style }) {
  const clip = useMemo(() => stampPolygon(w, h, tooth, depth), [w, h, tooth, depth])
  const orange = tone === 'orange'
  return (
    <div
      style={{
        width: w,
        height: h,
        transform: `rotate(${rot}deg)`,
        clipPath: clip,
        WebkitClipPath: clip,
        background: orange ? ACCENT : '#F1EDE6',
        color: orange ? '#fff' : ACCENT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        textAlign: 'center',
        userSelect: 'none',
        ...style,
      }}
    >
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '.01em' }}>{text}</span>
    </div>
  )
}
