import { ACCENT, MUTED, CARD_BORDER } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import ImageSlot from '../components/ImageSlot.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { Target, Star } from '../components/Icons.jsx'

const cardBase = {
  background: '#fff',
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: '22px',
  padding: 'clamp(24px,2.4vw,32px)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'clamp(300px,30vw,360px)',
  boxShadow: '0 30px 60px -50px rgba(40,28,16,.35)',
  transition: 'transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s',
}
const cardHover = {
  transform: 'translateY(-6px)',
  boxShadow: '0 40px 70px -45px rgba(40,28,16,.4)',
}

// The conic-gradient ring with a white inner circle holding an icon.
function IconRing({ degrees, children }) {
  return (
    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `conic-gradient(${ACCENT} ${degrees}deg,${CARD_BORDER} 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function StatCard({ degrees, icon, value, caption }) {
  return (
    <Hoverable as="article" style={cardBase} hoverStyle={cardHover}>
      <IconRing degrees={degrees}>{icon}</IconRing>
      <div style={{ marginTop: 'auto', paddingTop: '34px' }}>
        <div style={{ fontSize: 'clamp(40px,4.4vw,56px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '14px', color: MUTED, marginTop: '8px', lineHeight: 1.5 }}>{caption}</div>
      </div>
    </Hoverable>
  )
}

const Clock = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export default function Method() {
  return (
    <section id="method" style={{ padding: 'clamp(64px,9vw,128px) clamp(20px,5vw,64px) clamp(40px,5vw,72px)' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: 'clamp(34px,4vw,56px)' }}>
          <div>
            <SectionLabel>The method</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em', maxWidth: '14ch' }}>
              What one percent looks like
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', maxWidth: '330px', fontSize: '15px', lineHeight: 1.6, color: MUTED }}>
            Small enough to start today. Powerful enough to redesign your decade. The numbers our members live by.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(248px,100%),1fr))', gap: 'clamp(16px,1.6vw,22px)' }}>
          {/* Image card */}
          <article style={{ position: 'relative', borderRadius: '22px', overflow: 'hidden', minHeight: 'clamp(300px,30vw,360px)' }}>
            <ImageSlot id="lc-method" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} shape="rounded" radius={22} placeholder="Member in motion" />
            <div style={{ position: 'absolute', left: '16px', bottom: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#15110D', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '100px' }}>The Method</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#15110D', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(8px)', padding: '8px 13px', borderRadius: '100px' }}>＋ More</span>
            </div>
          </article>

          <StatCard degrees={331} icon={<Target />} value="92%" caption="Of members stay past their first twelve months." />
          <StatCard degrees={353} icon={<Star size={18} />} value="4.9" caption="Average member rating across 40,000+ reviews." />
          <StatCard
            degrees={198}
            icon={Clock}
            value={<>23<span style={{ fontSize: '.42em', fontWeight: 700, color: MUTED, letterSpacing: 0 }}>min</span></>}
            caption="The average daily session. Consistency over intensity."
          />
        </div>
      </div>
    </section>
  )
}
