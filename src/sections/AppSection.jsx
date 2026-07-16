import { ACCENT, INK, MUTED, MUTED_SOFT, CARD_BORDER, HAIRLINE, BRONZE, MQ_REDUCE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE, useMedia } from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

/* "App" — the club's own application, launching soon. A coming-soon teaser,
   not a live download: the store badges read "Coming soon" and the CTA routes
   to the invitation flow (members are first through the door). The phone
   preview stays in INK/BRONZE — orange is reserved for the CTA pill. */

// Store badge — a bordered "coming soon" chip, deliberately not a live link.
function StoreBadge({ glyph, sub, name }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '11px',
        padding: '10px 18px', borderRadius: '14px',
        border: `1px solid ${HAIRLINE}`, background: 'rgba(255,255,255,.5)',
        color: INK,
      }}
    >
      <span aria-hidden="true" style={{ display: 'inline-flex', color: INK }}>{glyph}</span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: BRONZE }}>{sub}</span>
        <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-.01em' }}>{name}</span>
      </span>
    </span>
  )
}

const AppleGlyph = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.36 12.78c.03 2.85 2.5 3.79 2.53 3.81-.02.06-.4 1.36-1.31 2.7-.79 1.15-1.6 2.3-2.9 2.32-1.27.03-1.68-.75-3.13-.75-1.46 0-1.91.73-3.11.78-1.25.05-2.2-1.24-3-2.39-1.62-2.35-2.86-6.64-1.2-9.53.83-1.44 2.3-2.35 3.9-2.37 1.22-.03 2.38.83 3.13.83.75 0 2.16-1.02 3.64-.87.62.03 2.36.25 3.48 1.9-.09.06-2.08 1.22-2.06 3.63M14.4 4.9c.66-.8 1.11-1.92.99-3.03-.95.04-2.1.63-2.79 1.43-.61.71-1.15 1.84-1 2.92 1.06.08 2.14-.54 2.8-1.32"/>
  </svg>
)

const PlayGlyph = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 3.4 15.6 12 4 20.6a1 1 0 0 1-.5-.86V4.26A1 1 0 0 1 4 3.4Zm13 6.02L19.6 11a1.2 1.2 0 0 1 0 2.06L17 14.58 14.2 12 17 9.42ZM5.6 4.9v14.2L13 12Z"/>
  </svg>
)

// A single mini habit row for the phone preview.
function MiniRow({ name, value, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
        <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: done ? INK : 'transparent', border: done ? 'none' : `1.5px dashed ${BRONZE}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {done && (
            <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.2 4 7.7 8.5 2.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </span>
        {name}
      </span>
      <span style={{ fontSize: '10.5px', color: done ? MUTED : BRONZE, fontWeight: done ? 400 : 600 }}>{value}</span>
    </div>
  )
}

export default function AppSection() {
  const reduce = useMedia(MQ_REDUCE)
  const { ref, reveal } = useReveal()

  return (
    <section id="app" style={{ padding: 'clamp(40px,5vw,80px) clamp(20px,5vw,64px)' }}>
      <style>{`@keyframes lcAppFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>

      <div
        ref={ref}
        style={{
          position: 'relative',
          maxWidth: '1340px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))',
          gap: 'clamp(40px,5vw,80px)',
          alignItems: 'center',
        }}
      >
        {/* Left — the announcement */}
        <div>
          <div style={reveal(0)}>
            <SectionLabel>The app</SectionLabel>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px', padding: '6px 13px', borderRadius: '100px', border: `1px solid ${HAIRLINE}`, background: 'rgba(255,255,255,.55)', fontSize: '11px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: BRONZE }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT }} />
              Launching soon
            </div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4.4vw,3.4rem)', lineHeight: 1.03, letterSpacing: '-.04em', maxWidth: '15ch' }}>
              The whole club, in your pocket.{' '}
              <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: 400, color: INK, fontSize: '1.05em' }}>Almost.</span>
            </h2>
          </div>
          <p style={{ margin: 'clamp(20px,2.6vw,28px) 0 0', maxWidth: '46ch', fontSize: 'clamp(15px,1.35vw,17px)', lineHeight: 1.7, color: MUTED, ...reveal(120) }}>
            We’re building the 1% Life Club app — your five habits, your streak and the whole circle in one calm view. It arrives on iOS and Android soon, and members walk through the door first.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'clamp(26px,3vw,34px)', ...reveal(220) }}>
            <StoreBadge glyph={AppleGlyph} sub="Coming soon" name="App Store" />
            <StoreBadge glyph={PlayGlyph} sub="Coming soon" name="Google Play" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px', marginTop: 'clamp(26px,3vw,34px)', ...reveal(300) }}>
            <Hoverable
              as="a"
              href="#join"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT, padding: '16px 30px', borderRadius: '100px', textDecoration: 'none', boxShadow: '0 18px 40px -22px rgba(255,107,0,.95)', transition: 'transform .3s, background .3s' }}
              hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
            >
              Be first through the door
              <ArrowUpRight size={16} />
            </Hoverable>
            <span style={{ fontSize: '13px', color: MUTED_SOFT }}>iOS &amp; Android · Members get early access</span>
          </div>
        </div>

        {/* Right — the phone preview */}
        <div style={{ display: 'flex', justifyContent: 'center', ...reveal(180, 'translateY(30px)') }}>
          <div style={{ animation: reduce ? 'none' : 'lcAppFloat 6s ease-in-out infinite' }}>
            <div
              aria-hidden="true"
              style={{
                position: 'relative',
                width: 'clamp(232px,26vw,286px)',
                aspectRatio: '9 / 18.6',
                background: INK,
                borderRadius: '46px',
                padding: '11px',
                boxShadow: '0 60px 100px -50px rgba(0,0,0,.5)',
              }}
            >
              {/* notch */}
              <div style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', width: '34%', height: '22px', background: INK, borderRadius: '0 0 14px 14px', zIndex: 3 }} />
              {/* screen */}
              <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fff', borderRadius: '36px', overflow: 'hidden', padding: 'clamp(20px,2.4vw,26px) clamp(16px,2vw,20px)' }}>
                {/* app header */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '5px' }}>
                    <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-.03em' }}>1%</span>
                    <span style={{ fontWeight: 600, fontSize: '8px', letterSpacing: '.14em' }}>LIFE CLUB</span>
                  </span>
                  <span style={{ fontSize: '10px', color: MUTED }}>Day 142</span>
                </div>

                {/* the ring — INK, not accent */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'clamp(18px,2.4vw,26px)' }}>
                  <div style={{ width: '108px', height: '108px', borderRadius: '50%', background: `conic-gradient(${INK} 288deg,${CARD_BORDER} 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '86px', height: '86px', borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-.03em', lineHeight: 1 }}>80%</span>
                      <span style={{ fontSize: '9px', color: MUTED, marginTop: '3px' }}>4 of 5 today</span>
                    </div>
                  </div>
                  <span style={{ marginTop: '12px', fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '13px', color: BRONZE }}>≈ 4.1× your day one</span>
                </div>

                {/* mini habit list */}
                <div style={{ marginTop: 'clamp(18px,2.4vw,24px)', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  <MiniRow name="Workout" value="45 / 45 min" done />
                  <MiniRow name="Protein" value="128 / 140 g" done />
                  <MiniRow name="Meditation" value="Start · 10 min" />
                </div>

                {/* tab-bar hint */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: '14px', display: 'flex', justifyContent: 'center', gap: '22px' }}>
                  {[INK, BRONZE, BRONZE].map((c, i) => (
                    <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: c, opacity: i === 0 ? 1 : 0.5 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
