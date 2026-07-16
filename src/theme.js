// Shared design tokens for the 1% Life Club site.
// Clean editorial system: WHITE page + ORANGE accent + near-BLACK ink.
// Components import these names, so the whole site re-skins from this one file.
export const ACCENT = '#FF6B00' // --accent (reserved for primary CTAs + highlights)
export const BG = '#FFFFFF'     // --bg  (page background)
export const STAGE = '#F6F6F5'  // --stage (raised / alternating panels — barely-grey)
export const INK = '#141414'    // primary text / dark surfaces (neutral near-black)
export const DARK = '#0E0E0E'   // full-black section backgrounds (DailyHabits, CTA, Footer)

// Ink family extensions (now neutral, not warm).
export const INK_SOFT = '#1A1A1A'  // display lettering
export const INK_MUTED = '#4A4A4A' // long-form body

// Frequently reused supporting greys.
export const MUTED = '#6B6B6B'
export const MUTED_SOFT = '#8C8C8C'
export const LABEL = '#767676'
export const CARD_BORDER = '#EAEAEA'

// Retired bronze "luxury register" → neutral greys.
// (Names kept so existing imports keep working; the warm cast is gone.)
export const BRONZE = '#9A9A9A'
export const BRONZE_FAINT = '#D8D8D8'
export const SAND = '#C9C9C9' // link text on dark ink surfaces

// Hairline rules and borders.
export const HAIRLINE = '#E6E6E6'

// One shadow system — neutral, light, three depths (clean not heavy).
export const SHADOW_CARD = '0 1px 2px rgba(0,0,0,.03), 0 18px 40px -28px rgba(0,0,0,.16)'
export const SHADOW_CARD_HOVER = '0 24px 52px -26px rgba(0,0,0,.24)'
export const SHADOW_PANEL = '0 40px 90px -70px rgba(0,0,0,.20)'

// Font stacks. Anton = the heavy all-caps grotesque poster headline (ZONIXX look);
// Archivo = the workhorse UI/sans and secondary display; Instrument Serif = the one
// retained editorial serif accent (Stories pull-quotes, "one percent").
export const FONT_SANS = "'Archivo', system-ui, -apple-system, sans-serif"
export const FONT_DISPLAY = "'Anton', 'Archivo', system-ui, sans-serif"
export const FONT_SERIF = "'Instrument Serif', serif"

// Radius scale (the ~20px rounded-card motif from the reference).
export const RADIUS_CARD = 20
export const RADIUS_PANEL = 'clamp(22px,2.4vw,32px)'
export const RADIUS_PILL = 100

// Shared media queries.
export const MQ_MOBILE = '(max-width: 640px)'
export const MQ_NAV = '(max-width: 880px)'  // header collapse point
// Below this the hero content stacks under the media card instead of overlaying.
export const MQ_HERO = '(max-width: 1199px)'
export const MQ_REDUCE = '(prefers-reduced-motion: reduce)'
