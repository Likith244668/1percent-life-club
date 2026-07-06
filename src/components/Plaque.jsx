import { BRONZE, BRONZE_FAINT } from '../theme.js'

/**
 * The membership plaque — the site's scarcity signature. A quiet engraved
 * line ("Membership · 247 of 250 · By application") flanked by two hairlines,
 * used in the Hero and the Final CTA. The numerals sit in the signature
 * Instrument Serif so the count reads like an edition number, not a stat.
 *
 * Spread reveal()/enter() styles on the wrapper you place it in — the plaque
 * itself never animates its own transform.
 */
const rule = {
  width: '36px',
  height: '1px',
  background: BRONZE_FAINT,
  flexShrink: 1, // the hairlines give way first on narrow screens
}

export default function Plaque({ style }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span aria-hidden="true" style={rule} />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: BRONZE,
        }}
      >
        Gofytt 
        <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: '13px', letterSpacing: '.12em' }}>
          
        </span>
      </span>
      <span aria-hidden="true" style={rule} />
    </div>
  )
}
