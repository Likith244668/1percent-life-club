import { ACCENT, STAGE, INK, MUTED } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import { ArrowUpRight } from '../components/Icons.jsx'

export default function FinalCTA() {
  return (
    <section id="join" style={{ padding: '0 clamp(10px,1.3vw,18px) clamp(10px,1.3vw,18px)' }}>
      <div style={{ position: 'relative', background: STAGE, border: '1px solid #EBE4DA', borderRadius: 'clamp(22px,2.4vw,36px)', boxShadow: '0 50px 110px -70px rgba(46,32,18,.4)', padding: 'clamp(64px,9vw,150px) clamp(24px,5vw,64px)', overflow: 'hidden', textAlign: 'center' }}>
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(900px,94%)',
            height: '520px',
            background: `radial-gradient(56% 60% at 50% 60%,color-mix(in srgb,${ACCENT} 22%,transparent),transparent 72%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 'clamp(18px,2vw,24px)', color: ACCENT, marginBottom: '22px' }}>
            The compounding starts now
          </div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 'clamp(2.6rem,8vw,6.2rem)', lineHeight: '.94', letterSpacing: '-.05em' }}>
            Your next 1%<br />starts today.
          </h2>
          <p style={{ margin: '30px auto 0', maxWidth: '500px', fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.6, color: MUTED }}>
            Join 180,000 people building a better life one percent at a time. No extremes. No pressure. Just progress.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center', marginTop: 'clamp(34px,4vw,46px)' }}>
            <Hoverable
              as="a"
              href="#top"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT, padding: '17px 36px', borderRadius: '100px', textDecoration: 'none', transition: 'transform .3s,background .3s' }}
              hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
            >
              Join the club
              <ArrowUpRight size={16} />
            </Hoverable>
            <Hoverable
              as="a"
              href="#programs"
              style={{ display: 'inline-flex', alignItems: 'center', fontSize: '15px', fontWeight: 600, color: INK, background: 'transparent', padding: '17px 32px', borderRadius: '100px', textDecoration: 'none', border: '1px solid #E1D9CE', transition: 'transform .3s,border-color .3s' }}
              hoverStyle={{ borderColor: INK, transform: 'translateY(-2px)' }}
            >
              See the programs
            </Hoverable>
          </div>
        </div>
      </div>
    </section>
  )
}
