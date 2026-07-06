import { ACCENT, STAGE, INK, MUTED, HAIRLINE, BRONZE, SHADOW_PANEL } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import Plaque from '../components/Plaque.jsx'
import useReveal from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

export default function FinalCTA() {
  const { ref, reveal } = useReveal()

  return (
    <section id="join" style={{ padding: '0 clamp(10px,1.3vw,18px) clamp(10px,1.3vw,18px)' }}>
      <div ref={ref} style={{ position: 'relative', background: STAGE, border: `1px solid ${HAIRLINE}`, borderRadius: 'clamp(22px,2.4vw,36px)', boxShadow: SHADOW_PANEL, padding: 'clamp(64px,9vw,150px) clamp(24px,5vw,64px)', overflow: 'hidden', textAlign: 'center' }}>
        {/* The glow blooms up from below as the section arrives — the warmth
            rises to meet the invitation. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '50%',
            // Base centering — holds under reduced motion, where reveal() is
            // empty and the animated transforms below never apply.
            transform: 'translateX(-50%)',
            width: 'min(900px,94%)',
            height: '520px',
            background: `radial-gradient(56% 60% at 50% 60%,color-mix(in srgb,${ACCENT} 12%,transparent),transparent 72%)`,
            pointerEvents: 'none',
            zIndex: 0,
            ...reveal(150, 'translateX(-50%) translateY(80px) scale(.9)', 'translateX(-50%)'),
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 'clamp(18px,2vw,24px)', color: BRONZE, marginBottom: '22px', ...reveal(0, 'translateY(20px)') }}>
            The compounding starts now
          </div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'clamp(2.6rem,8vw,6.2rem)', lineHeight: '.94', letterSpacing: '-.05em', ...reveal(110, 'translateY(34px)') }}>
            Your next 1%<br />starts today.
          </h2>
          <p style={{ margin: '30px auto 0', maxWidth: '500px', fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.6, color: MUTED, ...reveal(230) }}>
            A private circle of 250 founders, doctors and leaders. A few seats open each quarter.
          </p>
          {/* The buttons transition their own transforms on hover, so the
              reveal lives on their flex wrapper. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center', marginTop: 'clamp(34px,4vw,46px)', ...reveal(340) }}>
            <Hoverable
              as="a"
              href="#top"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT, padding: '17px 36px', borderRadius: '100px', textDecoration: 'none', transition: 'transform .3s,background .3s' }}
              hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
            >
              Request an invitation
              <ArrowUpRight size={16} />
            </Hoverable>
            <Hoverable
              as="a"
              href="#programs"
              style={{ display: 'inline-flex', alignItems: 'center', fontSize: '15px', fontWeight: 600, color: INK, background: 'transparent', padding: '17px 32px', borderRadius: '100px', textDecoration: 'none', border: `1px solid ${HAIRLINE}`, transition: 'transform .3s,border-color .3s' }}
              hoverStyle={{ borderColor: INK, transform: 'translateY(-2px)' }}
            >
              See the programs
            </Hoverable>
          </div>

          <div style={{ marginTop: 'clamp(30px,3.6vw,44px)', ...reveal(430, 'translateY(14px)') }}>
            <Plaque />
          </div>
        </div>
      </div>
    </section>
  )
}
