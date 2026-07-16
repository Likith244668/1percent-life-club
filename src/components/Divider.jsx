import { INK, HAIRLINE } from '../theme.js'
import { Sparkle } from './Icons.jsx'

/**
 * The recurring section separator — a centered four-point sparkle, optionally
 * flanked by two hairlines. The signature editorial motif from the reference;
 * dropped between major sections in place of the old ambient glows.
 *
 * Props:
 *   rules   draw the flanking hairlines (default true)
 *   color   sparkle color (default INK)
 *   size    sparkle size in px (default 20)
 *   maxWidth  total width the rules span to (default 460)
 *   style   margin / spacing overrides for the wrapper
 */
export default function Divider({ rules = true, color = INK, size = 32, maxWidth = 460, style }) {
  const line = { flex: 1, height: '1px', background: HAIRLINE }
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: rules ? '22px' : 0,
        width: '100%',
        maxWidth: `${maxWidth}px`,
        margin: '0 auto',
        ...style,
      }}
    >
      {rules && <span style={line} />}
      <Sparkle size={size} color={color} />
      {rules && <span style={line} />}
    </div>
  )
}
