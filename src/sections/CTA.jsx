import { ACCENT, DARK, INK, FONT_DISPLAY } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import Plaque from '../components/Plaque.jsx'
import Divider from '../components/Divider.jsx'
import useReveal from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

export default function CTA() {
  const { ref, reveal } = useReveal()

  return (
    <section id="join" style={{ padding: '0 clamp(10px,1.3vw,18px) clamp(10px,1.3vw,18px)' }}>
      <div
        ref={ref}
        style={{
          position: 'relative', background: DARK, color: '#fff',
          borderRadius: 'clamp(22px,2.4vw,36px)',
          padding: 'clamp(46px,6vw,106px) clamp(24px,5vw,64px)',
          overflow: 'hidden', textAlign: 'center',
        }}
      >
        {/* Very faint warm bloom from below — orange kept a whisper on black */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: '-30%', left: '50%', transform: 'translateX(-50%)',
            width: 'min(900px,94%)', height: '520px',
            background: `radial-gradient(56% 60% at 50% 60%,color-mix(in srgb,${ACCENT} 16%,transparent),transparent 70%)`,
            pointerEvents: 'none', zIndex: 0, opacity: .5,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
          <Divider color="#fff" rules={false} size={26} style={{ marginBottom: 'clamp(26px,3vw,40px)', ...reveal(0) }} />

          <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 'clamp(18px,2vw,24px)', color: 'rgba(255,255,255,.62)', marginBottom: '20px', ...reveal(80, 'translateY(20px)') }}>
            The compounding starts now
          </div>

          <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 'clamp(2.8rem,9.4vw,6.6rem)', lineHeight: '.92', letterSpacing: '.01em', textTransform: 'uppercase', ...reveal(150, 'translateY(34px)') }}>
            Your next 1%<br />starts today.
          </h2>

          <p style={{ margin: '28px auto 0', maxWidth: '500px', fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.6, color: 'rgba(255,255,255,.7)', ...reveal(250) }}>
            A private circle of 250 founders, doctors and leaders. A few seats open each quarter.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center', marginTop: 'clamp(34px,4vw,46px)', ...reveal(340) }}>
            <Hoverable
              as="a"
              href="#top"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT, padding: '17px 36px', borderRadius: '100px', textDecoration: 'none', transition: 'transform .3s,background .3s,color .3s' }}
              hoverStyle={{ background: '#fff', color: INK, transform: 'translateY(-2px)' }}
            >
              Request an invitation
              <ArrowUpRight size={16} />
            </Hoverable>
            <Hoverable
              as="a"
              href="#pillars"
              style={{ display: 'inline-flex', alignItems: 'center', fontSize: '15px', fontWeight: 600, color: '#fff', background: 'transparent', padding: '17px 32px', borderRadius: '100px', textDecoration: 'none', border: '1px solid rgba(255,255,255,.3)', transition: 'transform .3s,border-color .3s,background .3s' }}
              hoverStyle={{ borderColor: '#fff', background: 'rgba(255,255,255,.06)', transform: 'translateY(-2px)' }}
            >
              See the five pillars
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
