import { ACCENT, LABEL } from '../theme.js'

/**
 * The small eyebrow label (accent dot + uppercase tracked text) that sits
 * above every section heading. Reused ~8 times in the original page.
 *
 * Props:
 *   center   center it as an inline-flex pill (used by centered sections)
 *   color    text color (lighter on the dark dashboard section)
 *   tracking letter-spacing override (the hero uses a slightly wider value)
 */
export default function SectionLabel({
  children,
  center = false,
  color = LABEL,
  tracking = '.22em',
  style,
}) {
  return (
    <div
      style={{
        display: center ? 'inline-flex' : 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        ...style,
      }}
    >
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ACCENT }} />
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: tracking,
          textTransform: 'uppercase',
          color,
        }}
      >
        {children}
      </span>
    </div>
  )
}
