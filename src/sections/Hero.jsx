import { ACCENT, STAGE, INK, MUTED_SOFT } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import { ArrowUpRight, Play, Star } from '../components/Icons.jsx'

export default function Hero() {
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
      {/* Ambient accent glow behind the headline */}
      <div
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
        }}
      />

      {/* Headline block */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '1040px', margin: 'clamp(10px,2.4vw,34px) auto 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: 'clamp(20px,2.4vw,30px)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ACCENT }} />
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6B645D' }}>
            A members' club for daily progress
          </span>
        </div>

        <h1 style={{ margin: 0, fontWeight: 900, fontSize: 'clamp(3.4rem,13vw,11rem)', lineHeight: '.86', letterSpacing: '-.055em' }}>
          BETTER<br />
          <span style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontStyle: 'italic', fontSize: '.82em', letterSpacing: '-.015em' }}>
            every day.
          </span>
        </h1>

        <p style={{ margin: 'clamp(26px,3vw,38px) auto 0', maxWidth: '440px', fontSize: 'clamp(16px,1.35vw,18px)', lineHeight: 1.6, color: '#79706A' }}>
          Not a transformation. A practice — the quiet discipline of getting one percent better, repeated until it becomes who you are.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center', marginTop: 'clamp(30px,3.4vw,42px)' }}>
          <Hoverable
            as="a"
            href="#join"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#fff',
              background: ACCENT,
              padding: '16px 30px',
              borderRadius: '100px',
              textDecoration: 'none',
              transition: 'transform .3s,background .3s',
            }}
            hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
          >
            Begin your 1%
            <ArrowUpRight size={16} />
          </Hoverable>

          <Hoverable
            as="a"
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '15px',
              fontWeight: 600,
              color: INK,
              background: 'transparent',
              padding: '16px 28px',
              borderRadius: '100px',
              textDecoration: 'none',
              border: '1px solid #E1D9CE',
              transition: 'transform .3s,border-color .3s',
            }}
            hoverStyle={{ borderColor: INK, transform: 'translateY(-2px)' }}
          >
            <Play size={15} color="currentColor" />
            Watch the film
          </Hoverable>
        </div>

        {/* Social proof: avatars + rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: 'clamp(30px,3.4vw,40px)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#E9D8C4', border: `2px solid ${STAGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#7A6A52' }}>M</span>
            <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F0CDBA', border: `2px solid ${STAGE}`, marginLeft: '-11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#9A5C45' }}>P</span>
            <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#DCD3E0', border: `2px solid ${STAGE}`, marginLeft: '-11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#6A5C78' }}>A</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 700 }}>
              <Star size={13} />
              4.9 average rating
            </div>
            <div style={{ fontSize: '12px', color: MUTED_SOFT, marginTop: '1px' }}>Joined by 180,000+ members worldwide</div>
          </div>
        </div>
      </div>
    </section>
  )
}
