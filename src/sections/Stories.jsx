import { INK, MUTED_SOFT, CARD_BORDER, HAIRLINE, SHADOW_CARD, BRONZE } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE } from '../components/useReveal.js'
import { Star } from '../components/Icons.jsx'
import storyImg from '../assets/success-stories.png'

const SMALL = [
  { quote: '"Between theatre lists and two kids, one percent is the only system that has ever fit my life. Stronger, calmer, never behind."', name: 'Priya N.', meta: ' · Cardiothoracic surgeon · Member since 2023' },
  { quote: '"No extremes, no burnout. Just a system I\'ve actually kept for two years — and a room that expects me to show up."', name: 'Daniel R.', meta: ' · Founder & CEO · Member since 2022' },
]

export default function Stories() {
  const { ref, shown, reduce, reveal } = useReveal()

  return (
    <section id="stories" style={{ padding: 'clamp(48px,6vw,88px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(34px,4vw,56px)', ...reveal(0) }}>
          <SectionLabel>Member stories</SectionLabel>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
            Proof, not promises.
          </h2>
        </div>

        {/* Featured story */}
        <div style={{ background: '#fff', border: `1px solid ${CARD_BORDER}`, borderRadius: '24px', padding: 'clamp(16px,1.6vw,22px)', boxShadow: '0 40px 80px -56px rgba(40,28,16,.4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(20px,2.4vw,40px)', alignItems: 'stretch', marginBottom: 'clamp(16px,1.6vw,22px)', ...reveal(100, 'translateY(30px)') }}>
          <div style={{ position: 'relative', width: '100%', minHeight: 'clamp(300px,32vw,420px)', height: '100%', borderRadius: '18px', overflow: 'hidden' }}>
            <img
              src={storyImg}
              alt="Portrait of Marcus T., a member, after nine months in the club"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                // Slow settle from a slight zoom — the portrait breathes in as
                // the card lands (clipped by the rounded frame above).
                transform: reduce || shown ? 'scale(1)' : 'scale(1.07)',
                transition: reduce ? 'none' : `transform 1.6s ${EASE} 100ms`,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(14px,2vw,40px) clamp(14px,2vw,30px) clamp(20px,2vw,40px) 0' }}>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '24px' }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} color={BRONZE} />)}
            </div>
            <p style={{ margin: 0, fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(24px,2.8vw,38px)', lineHeight: 1.32, letterSpacing: '-.01em' }}>
              "I stopped chasing transformations and started stacking days. Down 22&nbsp;kg — and for the first time, it feels permanent."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '32px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>Marcus T.</div>
                <div style={{ fontSize: '13px', color: MUTED_SOFT }}>Founder, private equity · Member since 2024</div>
              </div>
              <div style={{ width: '1px', height: '34px', background: HAIRLINE }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: INK, letterSpacing: '-.02em' }}>−22 kg</div>
                <div style={{ fontSize: '13px', color: MUTED_SOFT }}>in 9 months</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary testimonials */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(16px,1.6vw,22px)' }}>
          {SMALL.map((s, i) => (
            <article key={s.name} style={{ background: '#fff', border: `1px solid ${CARD_BORDER}`, borderRadius: '22px', padding: 'clamp(26px,2.6vw,36px)', boxShadow: SHADOW_CARD, ...reveal(240 + i * 100, 'translateY(26px)') }}>
              <p style={{ margin: 0, fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(19px,2vw,24px)', lineHeight: 1.4, letterSpacing: '-.01em' }}>{s.quote}</p>
              <div style={{ marginTop: '22px', fontSize: '14px' }}>
                <span style={{ fontWeight: 700 }}>{s.name}</span>
                <span style={{ color: MUTED_SOFT }}>{s.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
