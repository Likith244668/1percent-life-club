import { ACCENT, MUTED } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'

const STEPS = [
  { n: '01', title: 'Assessment', desc: 'We map your starting point — body, schedule and goals — with zero judgment.' },
  { n: '02', title: 'Plan', desc: 'A personal blueprint of small, daily one-percent actions built around your life.' },
  { n: '03', title: 'Action', desc: 'You show up. We remove friction so the right move is the easy move.' },
  { n: '04', title: 'Progress', desc: 'Honest tracking turns effort into momentum you can actually see.' },
  { n: '05', title: 'Results', desc: 'A compounded transformation — and the identity that keeps it for life.' },
]

export default function Journey() {
  return (
    <section style={{ padding: 'clamp(64px,9vw,128px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto clamp(48px,5vw,80px)' }}>
          <SectionLabel center>The journey</SectionLabel>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
            Five steps. One you.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(190px,100%),1fr))', gap: 'clamp(22px,2.6vw,40px)' }}>
          {STEPS.map((s) => (
            <div key={s.n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: '44px', color: ACCENT, lineHeight: 1 }}>{s.n}</span>
                <span style={{ flex: 1, height: '1px', background: '#E2DDD6' }} />
              </div>
              <h3 style={{ margin: '0 0 9px', fontWeight: 700, fontSize: '20px', letterSpacing: '-.02em' }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: MUTED }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
