import { useState, useEffect } from 'react'
import { ACCENT, STAGE, INK, MUTED } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import { ArrowUpRight, Play } from '../components/Icons.jsx'
import heroImg from '../assets/hero.png'

/* ------------------------------------------------------------------ hooks */

// Reactive CSS media query (mirrors the helper in Header.jsx). Drives the
// layout switch and the reduced-motion guard.
function useMedia(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on)
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on))
  }, [query])
  return matches
}

// Flips true one frame after mount so the entrance transitions can play.
function useMounted() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // Double rAF: let the initial (hidden) styles paint before transitioning.
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setReady(true)) })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [])
  return ready
}

/* --------------------------------------------------------------- overlay text */

const EASE = 'cubic-bezier(.16,1,.3,1)'

// Visually hidden but readable by screen readers / search engines.
const srOnly = {
  position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
}

/* ------------------------------------------------------------------- section */

export default function Hero() {
  const isMobile = useMedia('(max-width: 760px)')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const ready = useMounted()

  // Full-bleed offsets for the illustration. The negative top margin always
  // cancels the section's top padding; beyond that the two viewports differ:
  //  • Desktop — the image is tall with a big empty "sky", so we crop into it
  //    to pull the figure/headline up near the header.
  //  • Mobile  — the image is short and the fixed header is proportionally
  //    taller, so cropping would jam the headline under it. Instead we leave a
  //    small top gap (the transparent sky just reads as more cream/glow, so the
  //    full-bleed look is kept) so the headline clears the header.
  // Desktop also crops the tall empty foreground "floor" below the chasm (the
  // negative bottom margin trims it against the card via overflow:hidden) so the
  // hero doesn't trail off into dead space under the content.
  const floorCrop = 'clamp(60px,8vw,150px)'
  const figureMargin = isMobile
    ? 'calc(clamp(64px,6vw,84px) * -1 + clamp(18px,5vw,34px)) calc(clamp(20px,4vw,56px) * -1) 0'
    : `calc((clamp(64px,6vw,84px) + clamp(30px,5vw,96px)) * -1) calc(clamp(20px,4vw,56px) * -1) calc(${floorCrop} * -1)`

  // Entrance helper: fades + moves an element from `from` to its resting
  // transform `to`, on a shared easing curve with a stagger `delay` (ms).
  // Under reduced motion everything snaps straight to its final state.
  const enter = (delay, from, to = 'none') =>
    reduce
      ? { opacity: 1, transform: to }
      : {
          opacity: ready ? 1 : 0,
          transform: ready ? to : from,
          transition: `opacity .7s ${EASE} ${delay}ms, transform .95s ${EASE} ${delay}ms`,
          willChange: 'opacity, transform',
        }

  // The value-prop + CTAs + social proof. Rendered once; positioned inside the
  // image's lower "valley" on desktop, and stacked below the image on mobile.
  const content = (
    <div
      style={
        isMobile
          ? { position: 'relative', zIndex: 3, maxWidth: '600px', margin: '0 auto', padding: 'clamp(22px,6vw,30px) clamp(18px,5vw,26px) 0', textAlign: 'center' }
          : { position: 'absolute', zIndex: 3, left: 0, right: 0, bottom: 'clamp(128px,25%,300px)', maxWidth: '560px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }
      }
    >
      {/* Value proposition — brand voice, with the accent word set in the
          site's signature Instrument Serif italic (matches the Belief section). */}
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(15px,1.55vw,18px)',
          lineHeight: 1.55,
          color: '#5C544D',
          maxWidth: '46ch',
          marginInline: 'auto',
          ...enter(520, 'translateY(16px)'),
        }}
      >
        No extremes. No pressure. Just the quiet discipline of getting{' '}
        <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: 400, color: ACCENT, fontSize: '1.16em' }}>
          one percent
        </span>{' '}
        better — until it's simply who you are.
      </p>

      {/* Dual CTA */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center',
          marginTop: 'clamp(18px,2.4vw,26px)',
          ...enter(620, 'translateY(16px)'),
        }}
      >
        <Hoverable
          as="a"
          href="#join"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '9px',
            fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT,
            padding: '16px 30px', borderRadius: '100px', textDecoration: 'none',
            boxShadow: '0 18px 40px -22px rgba(255,107,0,.95)',
            transition: 'transform .3s, background .3s, box-shadow .3s',
          }}
          hoverStyle={{ background: INK, transform: 'translateY(-2px)', boxShadow: '0 22px 46px -22px rgba(21,17,13,.6)' }}
        >
          Begin your 1%
          <ArrowUpRight size={16} />
        </Hoverable>

        <Hoverable
          as="a"
          href="#method"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '11px',
            fontSize: '15px', fontWeight: 600, color: INK,
            background: 'rgba(255,255,255,.6)',
            border: '1px solid rgba(21,17,13,.12)',
            padding: '8px 20px 8px 8px', borderRadius: '100px', textDecoration: 'none',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            transition: 'transform .3s, background .3s, border-color .3s',
          }}
          hoverStyle={{ background: '#fff', transform: 'translateY(-2px)', borderColor: 'rgba(21,17,13,.22)' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: INK, color: '#fff' }}>
            <Play size={11} color="#fff" />
          </span>
          How it works
        </Hoverable>
      </div>
    </div>
  )

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        margin: 'clamp(10px,1.3vw,18px)',
        background: STAGE,
        border: '1px solid #EBE4DA',
        borderRadius: 'clamp(22px,2.4vw,36px)',
        boxShadow: '0 50px 110px -70px rgba(46,32,18,.4)',
        padding: 'clamp(64px,6vw,84px) clamp(20px,4vw,56px) clamp(26px,3.4vw,48px)',
        overflow: 'hidden',
      }}
    >
      {/* Keyframes that can't be expressed inline: the ambient glow breathe,
          the scroll-cue bob, and the members-pill pulse. All gated on
          !reduce below, so reduced-motion users get a completely still hero. */}
      <style>{`
        @keyframes lcHeroGlow { 0%,100%{opacity:.78;transform:translateX(-50%) scale(1);} 50%{opacity:1;transform:translateX(-50%) scale(1.05);} }
        @keyframes lcCue { 0%,100%{transform:translateY(0);opacity:.55;} 50%{transform:translateY(7px);opacity:1;} }
      `}</style>

      {/* Real headline for screen readers & SEO — the visual statement lives in
          the aria-hidden image typography below. */}
      <h1 style={srOnly}>I can do it. Join the 1% Life Club and get one percent better every day.</h1>

      {/* Ambient accent glow behind the headline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(960px,94%)',
          height: '540px',
          background: `radial-gradient(58% 60% at 50% 42%,color-mix(in srgb,${ACCENT} 20%,transparent),transparent 72%)`,
          pointerEvents: 'none',
          zIndex: 0,
          animation: reduce ? 'none' : 'lcHeroGlow 7s ease-in-out infinite',
        }}
      />

      {/* Hero illustration — full-bleed to the card edges (the section's
          overflow:hidden + radius clips it to the rounded card). Negative
          margins cancel the section padding so there's no side gap. */}
      <figure
        style={{
          position: 'relative',
          zIndex: 2,
          margin: figureMargin,
        }}
      >
        {/* Inner "stage" holds the image + everything positioned against it.
            Keeping the % overlays scoped here (not the whole figure) means the
            mobile content stacked below can't push the lettering off the image. */}
        <div style={{ position: 'relative' }}>
          <img
            src={heroImg}
            alt="A figure leaping across the gap between two cliffs"
            style={{ display: 'block', width: '100%', height: 'auto', ...enter(60, 'scale(1.05)') }}
          />

          {/* Light fade on the left and right edges so the scene melts into the
              cream card instead of ending on a hard grey edge. */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg,${STAGE} 0%,color-mix(in srgb,${STAGE} 55%,transparent) 3%,transparent 10%,transparent 90%,color-mix(in srgb,${STAGE} 55%,transparent) 97%,${STAGE} 100%)`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* The image lettering is decorative — the real <h1> above carries the
              text to assistive tech, so this block is aria-hidden. */}
          <div aria-hidden="true">
            {/* "I CAN" — left cliff, bold sans. Anchored by baseline
                (translateY -100%) so it lines up with "DO IT"; slides in from
                its cliff on load. */}
            <span
              style={{
                position: 'absolute',
                top: '42.5%',
                left: 'clamp(16px,7%,120px)',
                fontWeight: 900,
                fontSize: 'clamp(1.9rem,8.6vw,8rem)',
                letterSpacing: '-.02em',
                lineHeight: 1,
                color: '#2B2723',
                pointerEvents: 'none',
                zIndex: 2,
                ...enter(320, 'translateY(-100%) translateX(-46px)', 'translateY(-100%)'),
              }}
            >
              I CAN
            </span>

            {/* "DO IT" — right cliff. Playfair Display italic Didone to balance
                the black "I CAN". Same baseline; slides in from the right. */}
            <span
              style={{
                position: 'absolute',
                top: '41.2%',
                right: 'clamp(16px,6%,110px)',
                fontFamily: "'Playfair Display',serif",
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2rem,8.4vw,8.4rem)',
                letterSpacing: '-.005em',
                lineHeight: 1,
                color: '#2B2723',
                pointerEvents: 'none',
                zIndex: 2,
                ...enter(400, 'translateY(-100%) translateX(46px)', 'translateY(-100%)'),
              }}
            >
              DO IT
            </span>

            {/* The "T" of CAN'T — the emotional beat. It drops from the headline
                and rotates into the chasm on top of the shattered debris,
                arriving after the two words have settled. */}
            <span
              style={{
                position: 'absolute',
                top: '48%',
                left: '45%',
                fontWeight: 900,
                fontSize: 'clamp(2.3rem,8vw,7.5rem)',
                letterSpacing: '-.02em',
                lineHeight: 1,
                color: '#2B2723',
                pointerEvents: 'none',
                zIndex: 2,
                ...enter(660, 'translateX(-50%) translateY(-170px) rotate(-38deg)', 'translateX(-50%) rotate(25deg)'),
              }}
            >
              T
            </span>
          </div>

          {/* Desktop: content overlays the empty valley in the image */}
          {!isMobile && content}

          {/* Scroll cue (desktop only) — a quiet invitation to explore on. */}
          {!isMobile && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', left: 0, right: 0, bottom: `calc(${floorCrop} + clamp(40px,4.8vw,86px))`, zIndex: 3,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                color: MUTED, ...enter(900, 'translateY(10px)'),
              }}
            >
              <span style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase' }}>Scroll</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ animation: reduce ? 'none' : 'lcCue 1.8s ease-in-out infinite' }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          )}
        </div>

        {/* Mobile: content stacks below the image (never overlaps the art) */}
        {isMobile && content}
      </figure>
    </section>
  )
}
