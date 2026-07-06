import { MUTED, INK, HAIRLINE, BRONZE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

const PROGRAMS = [
  { n: '01', title: 'Strength', desc: 'Compound-led training that builds real, lasting power.' },
  { n: '02', title: 'Fat Loss', desc: 'Calorie-smart sessions that protect muscle and energy.' },
  { n: '03', title: 'Mobility & Yoga', desc: 'Restore range, breath and calm — on or off the mat.' },
  { n: '04', title: 'Conditioning', desc: 'Zone-based cardio for an engine you can feel.' },
  { n: '05', title: 'Muscle', desc: 'Progressive hypertrophy with intelligent structure.' },
  { n: '06', title: 'Home', desc: 'Minimal-equipment sessions for small spaces, busy days.' },
]

const rowBase = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 'clamp(18px,3vw,48px)',
  padding: 'clamp(22px,2.6vw,34px) clamp(8px,1.4vw,20px)',
  borderBottom: `1px solid ${HAIRLINE}`,
  textDecoration: 'none',
  color: INK,
  transition: 'background .35s,padding-left .35s',
}
const rowHover = {
  background: `color-mix(in srgb,${INK} 4%,transparent)`,
  paddingLeft: 'clamp(16px,2vw,32px)',
}

export default function Programs() {
  const { ref, reveal } = useReveal()

  return (
    <section id="programs" style={{ padding: 'clamp(48px,6vw,88px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: 'clamp(30px,3.4vw,48px)' }}>
          <div style={reveal(0)}>
            <SectionLabel>Programs</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
              Six paths, one method.
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', maxWidth: '330px', fontSize: '15px', lineHeight: 1.6, color: MUTED, ...reveal(120) }}>
            Start where you are today. Switch whenever you're ready — your progress follows you everywhere.
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          {PROGRAMS.map((p, i) => (
            // The row transitions its own background/padding on hover, so the
            // reveal lives on a plain wrapper to avoid transition collisions.
            <div key={p.n} style={reveal(160 + i * 80, 'translateY(20px)')}>
              <Hoverable as="a" href="#join" style={rowBase} hoverStyle={rowHover}>
                <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(28px,3vw,40px)', color: BRONZE, lineHeight: 1, minWidth: '1.6ch' }}>{p.n}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 18px' }}>
                  <span style={{ fontWeight: 700, fontSize: 'clamp(20px,2.2vw,28px)', letterSpacing: '-.025em' }}>{p.title}</span>
                  <span style={{ fontSize: '14px', color: MUTED, lineHeight: 1.5 }}>{p.desc}</span>
                </div>
                <ArrowUpRight size={22} color={INK} />
              </Hoverable>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
