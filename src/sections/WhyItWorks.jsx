import { ACCENT, MUTED, INK, CARD_BORDER } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { ArrowUpRight, Target } from '../components/Icons.jsx'

const Pulse = (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const Community = (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const FEATURES = [
  { icon: <Target size={23} strokeWidth={1.8} />, title: 'A personal method', body: 'Every plan begins with an honest assessment, then adapts to your body, schedule and pace — never a template.', link: 'Explore the method' },
  { icon: Pulse, title: 'Habits that compound', body: 'Five small daily actions, tracked in one calm view. No noise, no guilt — just momentum you can see.', link: 'See the system' },
  { icon: Community, title: 'A global community', body: '180,000 people choosing progress over perfection. Show up, cheer loud, and grow together every day.', link: 'Meet the club' },
]

const cardBase = {
  background: '#fff',
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: '22px',
  padding: 'clamp(28px,2.8vw,40px)',
  boxShadow: '0 30px 60px -50px rgba(40,28,16,.35)',
  transition: 'transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s,border-color .45s',
}
const cardHover = {
  transform: 'translateY(-7px)',
  boxShadow: '0 44px 76px -46px rgba(40,28,16,.42)',
  borderColor: `color-mix(in srgb,${ACCENT} 35%,${CARD_BORDER})`,
}

export default function WhyItWorks() {
  return (
    <section id="why" style={{ padding: 'clamp(48px,6vw,88px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ maxWidth: '600px', marginBottom: 'clamp(34px,4vw,56px)' }}>
          <SectionLabel>Why it works</SectionLabel>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
            Built around you, not the average.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(16px,1.6vw,22px)' }}>
          {FEATURES.map((f) => (
            <Hoverable as="article" key={f.title} style={cardBase} hoverStyle={cardHover}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `color-mix(in srgb,${ACCENT} 12%,#fff)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'clamp(30px,4vw,52px)' }}>
                {f.icon}
              </div>
              <h3 style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 'clamp(20px,1.9vw,24px)', letterSpacing: '-.02em' }}>{f.title}</h3>
              <p style={{ margin: '0 0 22px', fontSize: '15px', lineHeight: 1.65, color: MUTED }}>{f.body}</p>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: 600, color: INK, textDecoration: 'none' }}>
                {f.link}
                <ArrowUpRight size={15} color={ACCENT} />
              </a>
            </Hoverable>
          ))}
        </div>
      </div>
    </section>
  )
}
