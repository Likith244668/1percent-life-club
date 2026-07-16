import { useState } from 'react'
import { INK, FONT_SANS, RADIUS_CARD } from '../theme.js'
import { ArrowUpRight } from './Icons.jsx'
import ImageSlot from './ImageSlot.jsx'

/**
 * Rounded photo card with a label bottom-left and a circular arrow button
 * bottom-right — the reference's "PERSONAL TRAINING / GROUP FITNESS" tiles.
 * Used for the five Pillars and the member spotlights.
 *
 * Props:
 *   src        optional image URL (ImageSlot placeholder until set)
 *   placeholder empty-state caption for the slot
 *   label      the overlaid title (uppercase)
 *   sublabel   optional small line under the label
 *   href       makes the whole card a link (default '#join')
 *   ratio      aspect-ratio (default '4 / 5')
 *   radius     corner radius px (default RADIUS_CARD)
 *   style      wrapper overrides
 */
export default function CategoryCard({
  src = '',
  placeholder = 'Add an image',
  label,
  sublabel,
  href = '#join',
  ratio = '4 / 5',
  radius = RADIUS_CARD,
  style,
}) {
  const [hover, setHover] = useState(false)

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        position: 'relative', display: 'block', width: '100%', aspectRatio: ratio,
        borderRadius: `${radius}px`, overflow: 'hidden', textDecoration: 'none',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'transform .35s cubic-bezier(.16,1,.3,1)',
        ...style,
      }}
    >
      <ImageSlot
        src={src}
        placeholder={placeholder}
        shape="rounded"
        radius={radius}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Scrim for label legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'linear-gradient(180deg,rgba(10,10,10,0) 45%,rgba(10,10,10,.62) 100%)',
        }}
      />

      {/* Bottom row: label + circular arrow */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px',
          padding: 'clamp(16px,2vw,22px)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#fff', fontFamily: FONT_SANS, fontWeight: 800, fontSize: 'clamp(15px,1.5vw,19px)', letterSpacing: '.02em', textTransform: 'uppercase', lineHeight: 1.1 }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ marginTop: '5px', color: 'rgba(255,255,255,.78)', fontSize: '12.5px', fontWeight: 500, lineHeight: 1.35 }}>
              {sublabel}
            </div>
          )}
        </div>
        <span
          style={{
            flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%',
            background: hover ? '#fff' : 'rgba(255,255,255,.16)',
            border: '1px solid rgba(255,255,255,.5)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            color: hover ? INK : '#fff',
            transition: 'background .3s, color .3s',
          }}
        >
          <ArrowUpRight size={17} />
        </span>
      </div>
    </a>
  )
}
