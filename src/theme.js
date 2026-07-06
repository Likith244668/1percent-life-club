// Shared design tokens for the 1% Life Club site.
// Mirrors the CSS custom properties used by the original markup so individual
// components can reference one source of truth instead of repeating hex codes.
export const ACCENT = '#FF6B00' // --accent
export const BG = '#F1EBE3'     // --bg  (page background)
export const STAGE = '#FBF9F6'  // --stage (raised panels)
export const INK = '#15110D'    // primary text / dark surfaces

// Ink family extensions.
export const INK_SOFT = '#2B2723'  // hero display lettering
export const INK_MUTED = '#5C544D' // long-form body on light stage

// Frequently reused supporting colors.
export const MUTED = '#79706A'
export const MUTED_SOFT = '#8A8178'
export const LABEL = '#6B645D'
export const CARD_BORDER = '#EFE9E1'

// Warm bronze support family — the quiet accent for captions, serif numbers
// and hairline details (the luxury register; orange stays for primary CTAs).
export const BRONZE = '#A39B92'
export const BRONZE_FAINT = '#CFC6BA'
export const SAND = '#D9D2CA' // link text on dark ink surfaces

// Hairline rules and borders on cream/stage surfaces
// (CARD_BORDER stays for borders on white cards).
export const HAIRLINE = '#E4DDD3'

// One shadow system — a single warm base at three depths.
export const SHADOW_CARD = '0 30px 60px -50px rgba(40,28,16,.35)'
export const SHADOW_CARD_HOVER = '0 40px 70px -45px rgba(40,28,16,.4)'
export const SHADOW_PANEL = '0 50px 110px -70px rgba(40,28,16,.4)'

// Shared media queries.
export const MQ_MOBILE = '(max-width: 640px)'
export const MQ_NAV = '(max-width: 880px)'  // header collapse point
// Hero stack point: below this the content stacks under the image instead of
// overlaying the "valley" — the valley is too shallow for the overlay there.
export const MQ_HERO = '(max-width: 1199px)'
export const MQ_REDUCE = '(prefers-reduced-motion: reduce)'
