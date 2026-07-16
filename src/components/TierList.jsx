import { useState } from 'react'
import { INK, MUTED, INK_MUTED, HAIRLINE, ACCENT, FONT_DISPLAY, MQ_MOBILE } from '../theme.js'
import { Sparkle } from './Icons.jsx'
import { useMedia } from './useReveal.js'

/**
 * Big expandable rows — the reference's "BASIC / PREMIUM / ELITE" accordion.
 * Each row: huge display title left, a centered sparkle, a +/– toggle right;
 * clicking expands a detail paragraph. One row open at a time.
 *
 * Props:
 *   items    [{ id?, title, body }]
 *   defaultOpen  index open on mount (default 0; pass -1 for all closed)
 *   style    wrapper overrides
 */
export default function TierList({ items = [], defaultOpen = 0, style }) {
  const [open, setOpen] = useState(defaultOpen)
  const isMobile = useMedia(MQ_MOBILE)

  return (
    <div style={{ width: '100%', ...style }}>
      {items.map((item, i) => {
        const isOpen = open === i
        const id = item.id || `tier-${i}`
        return (
          <div key={id} style={{ borderTop: `1px solid ${HAIRLINE}`, ...(i === items.length - 1 ? { borderBottom: `1px solid ${HAIRLINE}` } : {}) }}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${id}-panel`}
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%', display: 'grid',
                gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto auto',
                alignItems: 'center', gap: 'clamp(14px,3vw,32px)',
                padding: 'clamp(18px,2.4vw,30px) 4px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                font: 'inherit', color: isOpen ? INK : '#2A2A2A',
                transition: 'color .25s',
              }}
            >
              <span
                style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 400, textTransform: 'uppercase',
                  fontSize: 'clamp(2rem,5.4vw,4.2rem)', lineHeight: .95, letterSpacing: '.01em',
                }}
              >
                {item.title}
              </span>
              {!isMobile && <Sparkle size={26} color={isOpen ? ACCENT : INK} />}
              <span
                aria-hidden="true"
                style={{
                  position: 'relative', width: '30px', height: '30px', flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  justifySelf: 'end',
                }}
              >
                {/* + / – toggle drawn from two bars */}
                <span style={{ position: 'absolute', width: '20px', height: '2px', background: INK, borderRadius: '2px' }} />
                <span style={{ position: 'absolute', width: '2px', height: '20px', background: INK, borderRadius: '2px', transform: isOpen ? 'scaleY(0)' : 'scaleY(1)', transition: 'transform .3s cubic-bezier(.16,1,.3,1)' }} />
              </span>
            </button>

            {/* Expanding detail panel */}
            <div
              id={`${id}-panel`}
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows .4s cubic-bezier(.16,1,.3,1)',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    margin: 0, maxWidth: '62ch',
                    padding: `0 4px clamp(20px,2.4vw,30px) ${isMobile ? '4px' : '2px'}`,
                    color: INK_MUTED, fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.6,
                    opacity: isOpen ? 1 : 0, transition: 'opacity .4s ease',
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
