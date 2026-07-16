import { INK, FONT_DISPLAY, RADIUS_CARD } from '../theme.js'
import { Play } from './Icons.jsx'
import ImageSlot from './ImageSlot.jsx'

/**
 * Large rounded image/video card with text overlaid — the reference's hero
 * "INSIDE AND OUT." card and the training tiles. Wraps ImageSlot so the slot
 * stays a swappable placeholder until a real image is dropped in.
 *
 * Props:
 *   src         optional image URL (ImageSlot placeholder shows until set)
 *   placeholder empty-state caption for the slot
 *   headline    big white statement overlaid on the image (FONT_DISPLAY)
 *   caption     small paragraph pinned bottom-left
 *   chip        text for the bottom-right pill (e.g. '3 min'); null hides it
 *   align       vertical position of the headline: 'center' | 'bottom' | 'top'
 *   ratio       aspect-ratio string (default '16 / 10')
 *   radius      corner radius in px (default RADIUS_CARD)
 *   style       wrapper overrides
 */
export default function MediaCard({
  src = '',
  placeholder = 'Add an image',
  headline,
  headlineSize = 'clamp(2.4rem,7vw,6rem)',
  caption,
  chip = null,
  align = 'center',
  ratio = '16 / 10',
  radius = RADIUS_CARD,
  style,
}) {
  const justify = align === 'top' ? 'flex-start' : align === 'bottom' ? 'flex-end' : 'center'

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: ratio, borderRadius: `${radius}px`, overflow: 'hidden', ...style }}>
      <ImageSlot
        src={src}
        placeholder={placeholder}
        shape="rounded"
        radius={radius}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Scrim so overlaid text stays legible over any photo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'linear-gradient(180deg,rgba(10,10,10,.28) 0%,rgba(10,10,10,.05) 34%,rgba(10,10,10,.12) 62%,rgba(10,10,10,.6) 100%)',
        }}
      />

      {/* Headline — centered in the card (align controls the vertical anchor) */}
      {headline && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 4,
            display: 'flex', alignItems: justify, justifyContent: 'center',
            padding: 'clamp(20px,3vw,40px)', pointerEvents: 'none',
          }}
        >
          <h3
            style={{
              margin: 0, textAlign: 'center', color: '#fff',
              fontFamily: FONT_DISPLAY, fontWeight: 400,
              fontSize: headlineSize, lineHeight: .9,
              letterSpacing: '.005em', textTransform: 'uppercase',
              textShadow: '0 2px 30px rgba(0,0,0,.28)',
            }}
          >
            {headline}
          </h3>
        </div>
      )}

      {/* Caption + chip — pinned to the bottom, independent of the headline */}
      {(caption || chip) && (
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px',
            padding: 'clamp(20px,3vw,40px)', pointerEvents: 'none',
          }}
        >
          <p style={{ margin: 0, maxWidth: '32ch', color: 'rgba(255,255,255,.9)', fontSize: 'clamp(12px,1.2vw,14px)', lineHeight: 1.5 }}>
            {caption}
          </p>
          {chip && (
            <span
              style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', borderRadius: '100px',
                background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.34)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                color: '#fff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
              }}
            >
              {chip}
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', color: INK }}>
                <Play size={9} color={INK} />
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
