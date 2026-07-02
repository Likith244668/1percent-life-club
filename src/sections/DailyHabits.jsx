import { ACCENT, INK } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { ArrowUpRight } from '../components/Icons.jsx'

const HABITS = [
  { name: 'Workout', value: '45 / 45 min', pct: '100%' },
  { name: 'Water', value: '2.4 / 3.0 L', pct: '80%' },
  { name: 'Protein', value: '128 / 140 g', pct: '91%' },
  { name: 'Sleep', value: '7.5 / 8.0 h', pct: '94%' },
  { name: 'Meditation', value: '0 / 10 min', pct: '0%', valueColor: '#A39B92' },
]

function ProgressRow({ name, value, pct, valueColor = '#79706A' }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: '13px', color: valueColor }}>{value}</span>
      </div>
      <div style={{ height: '6px', background: '#EFE9E1', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct, background: ACCENT, borderRadius: '100px' }} />
      </div>
    </div>
  )
}

export default function DailyHabits() {
  return (
    <section style={{ margin: 'clamp(10px,1.3vw,18px)', background: INK, color: '#fff', borderRadius: 'clamp(22px,2.4vw,36px)', padding: 'clamp(48px,7vw,110px) clamp(22px,5vw,72px)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(380px,100%),1fr))', gap: 'clamp(40px,5vw,80px)', alignItems: 'center' }}>
        <div>
          <SectionLabel color="#A39B92">Daily habits</SectionLabel>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
            Your day, in<br />one quiet view.
          </h2>
          <p style={{ margin: '24px 0 0', fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.7, color: '#A39B92', maxWidth: '430px' }}>
            Five habits. No noise, no guilt — just a calm dashboard that shows your progress and nudges your next one percent.
          </p>
          <Hoverable
            as="a"
            href="#join"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', marginTop: '34px', fontSize: '15px', fontWeight: 600, color: INK, background: '#fff', padding: '15px 28px', borderRadius: '100px', textDecoration: 'none', transition: 'transform .3s,background .3s' }}
            hoverStyle={{ background: ACCENT, color: '#fff', transform: 'translateY(-2px)' }}
          >
            Track your habits
            <ArrowUpRight size={16} />
          </Hoverable>
        </div>

        <div style={{ background: '#fff', color: INK, borderRadius: '20px', padding: 'clamp(22px,2.4vw,32px)', boxShadow: '0 50px 90px -50px rgba(0,0,0,.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#79706A' }}>Today · Day 142</div>
              <div style={{ fontWeight: 800, fontSize: '23px', letterSpacing: '-.02em', marginTop: '2px' }}>4 of 5 complete</div>
            </div>
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: `conic-gradient(${ACCENT} 288deg,#EFE9E1 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '43px', height: '43px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>80%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {HABITS.map((h) => (
              <ProgressRow key={h.name} {...h} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
