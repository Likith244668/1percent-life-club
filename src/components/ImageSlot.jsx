import { useRef, useState } from 'react'
import { ACCENT } from '../theme.js'

/**
 * React port of the original standalone <image-slot> custom element.
 *
 * Shows a warm branded placeholder until an image is provided, and — as a
 * preview convenience — lets you click or drag-drop an image file to fill the
 * slot for the current session (not persisted). Size/layout come from the
 * `style` prop (width/height), exactly like the original element.
 *
 * Props mirror the old attributes:
 *   src          Optional image URL to display.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *   radius       Corner radius in px for 'rounded'.        (default 12)
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *   position     object-position for the image.            (default '50% 50%')
 *   placeholder  Empty-state caption.
 */
const ACCEPT = 'image/png,image/jpeg,image/webp,image/avif,image/gif'

function radiusFor(shape, radius) {
  switch ((shape || 'rounded').toLowerCase()) {
    case 'circle': return '50%'
    case 'pill': return '9999px'
    case 'rect': return '0'
    default: {
      const n = parseFloat(radius)
      return `${Number.isFinite(n) ? n : 12}px`
    }
  }
}

export default function ImageSlot({
  src = '',
  shape = 'rounded',
  radius = 12,
  fit = 'cover',
  position = '50% 50%',
  placeholder = 'Add an image',
  style,
  ...rest
}) {
  const [url, setUrl] = useState(src)
  const [over, setOver] = useState(false)
  const inputRef = useRef(null)

  const borderRadius = radiusFor(shape, radius)

  const fillFromFile = (file) => {
    if (file) setUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setOver(false)
    fillFromFile(e.dataTransfer?.files?.[0])
  }

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'top',
        fontFamily: 'Archivo, system-ui, -apple-system, sans-serif',
        ...style,
      }}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      {...rest}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius,
          background: 'linear-gradient(135deg,#F2F2F1 0%,#E9E9E7 52%,#DEDEDC 100%)',
          outline: over ? `2px solid ${ACCENT}` : 'none',
          outlineOffset: '-2px',
        }}
      >
        {/* Soft neutral sheen so the empty slot still reads as a surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(70% 60% at 30% 20%,rgba(255,255,255,.5),transparent 60%)',
          }}
        />

        {url ? (
          <img
            alt=""
            src={url}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              zIndex: 2,
              objectFit: fit,
              objectPosition: position,
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              textAlign: 'center',
              padding: '20px',
              cursor: 'pointer',
              color: '#8C8C8C',
              background: 'transparent',
              border: 'none',
              font: 'inherit',
            }}
          >
            <span
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,.6)',
                boxShadow: '0 10px 28px -16px rgba(60,40,20,.5)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '.01em', maxWidth: '80%', lineHeight: 1.4 }}>
              {placeholder}
            </span>
            <span style={{ fontSize: '11px', color: '#A8A8A8' }}>Drop or click to add an image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          fillFromFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
