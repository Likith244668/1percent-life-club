import { MUTED, HAIRLINE, BRONZE } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE } from '../components/useReveal.js'

const STEPS = [
  { n: '01', title: 'Application', desc: 'A short application, read by a person. We keep the room small on purpose — a few seats open each quarter.' },
  { n: '02', title: 'Assessment', desc: 'We map your starting point — body, schedule and goals — with zero judgment.' },
  { n: '03', title: 'Plan', desc: 'A personal blueprint of small, daily one-percent actions built around your life.' },
  { n: '04', title: 'Practice', desc: 'You show up. We remove friction so the right move is the easy move.' },
  { n: '05', title: 'Results', desc: 'A compounded transformation — and the identity that keeps it for life.' },
]

export default function Journey() {
  const { ref, shown, reduce, reveal } = useReveal()

  return (
    <section style={{ padding: 'clamp(64px,9vw,128px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto clamp(48px,5vw,80px)', ...reveal(0) }}>
          <SectionLabel center>The membership journey</SectionLabel>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
            Five steps. One seat.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(190px,100%),1fr))', gap: 'clamp(22px,2.6vw,40px)' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={reveal(140 + i * 110, 'translateY(24px)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: '44px', color: BRONZE, lineHeight: 1 }}>{s.n}</span>
                {/* The divider draws left→right after its step lands — the
                    path through the five steps literally traces itself. */}
                <span
                  style={{
                    flex: 1, height: '1px', background: HAIRLINE,
                    transformOrigin: 'left',
                    transform: reduce || shown ? 'scaleX(1)' : 'scaleX(0)',
                    transition: reduce ? 'none' : `transform 1.1s ${EASE} ${320 + i * 110}ms`,
                  }}
                />
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
