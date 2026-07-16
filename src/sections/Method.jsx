import { INK, MUTED, CARD_BORDER, SHADOW_CARD, SHADOW_CARD_HOVER, FONT_DISPLAY } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE } from '../components/useReveal.js'
import looksImg from '../assets/looks.png'

const cardBase = {
  background: '#fff',
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: '20px',
  padding: 'clamp(24px,2.4vw,32px)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'clamp(280px,28vw,340px)',
  boxShadow: SHADOW_CARD,
  transition: `transform .45s ${EASE},box-shadow .45s`,
}
const cardHover = { transform: 'translateY(-6px)', boxShadow: SHADOW_CARD_HOVER }

function StatCard({ kicker, value, caption }) {
  return (
    <Hoverable as="article" style={cardBase} hoverStyle={cardHover}>
      <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: MUTED }}>{kicker}</div>
      <div style={{ marginTop: 'auto', paddingTop: '34px' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 'clamp(44px,5.4vw,72px)', letterSpacing: '.01em', lineHeight: .9, color: INK }}>{value}</div>
        <div style={{ fontSize: '14px', color: MUTED, marginTop: '12px', lineHeight: 1.5 }}>{caption}</div>
      </div>
    </Hoverable>
  )
}

export default function Method() {
  const { ref, reveal } = useReveal()

  // Cards carry their own hover transitions, so each grid cell is a plain
  // display:grid wrapper that owns the reveal (keeps equal-height stretching).
  const cell = (i) => ({ display: 'grid', ...reveal(160 + i * 100) })

  return (
    <section id="method" style={{ padding: 'clamp(40px,5.5vw,84px) clamp(20px,5vw,64px) clamp(28px,3.5vw,50px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: 'clamp(34px,4vw,56px)' }}>
          <div style={reveal(0)}>
            <SectionLabel>The method</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em', maxWidth: '14ch' }}>
              What one percent looks like
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', maxWidth: '330px', fontSize: '15px', lineHeight: 1.6, color: MUTED, ...reveal(120) }}>
            Small enough to start today. Powerful enough to redesign your decade. The numbers our members live by.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(248px,100%),1fr))', gap: 'clamp(16px,1.6vw,22px)' }}>
          {/* Image card */}
          <div style={cell(0)}>
            <article style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', minHeight: 'clamp(280px,28vw,340px)', boxShadow: SHADOW_CARD }}>
              <img
                src={looksImg}
                alt="A member mid-session in the club's training studio"
                width={1023}
                height={1537}
                loading="lazy"
                decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 28%', display: 'block' }}
              />
              <div style={{ position: 'absolute', left: '16px', bottom: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: INK, background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '100px' }}>The Method</span>
              </div>
            </article>
          </div>

          <div style={cell(1)}>
            <StatCard kicker="Retention" value="92%" caption="Of members stay past their first twelve months." />
          </div>
          <div style={cell(2)}>
            <StatCard kicker="Member rating" value="4.9" caption="Average — gathered one member at a time." />
          </div>
          <div style={cell(3)}>
            <StatCard
              kicker="Daily session"
              value={<>23<span style={{ fontSize: '.4em', letterSpacing: 0, marginLeft: '.08em' }}>MIN</span></>}
              caption="The average daily session. Consistency over intensity."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
