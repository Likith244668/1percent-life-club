import { INK, MUTED, MUTED_SOFT, HAIRLINE, BRONZE } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE } from '../components/useReveal.js'

/* The problem beat — why the conventional approach fails the exact people the
   club is built for. Three honest failure modes of "getting in shape," each
   the setup for a promise the rest of the page keeps. Private-club voice: no
   scare tactics, no mass-market urgency — just the quiet diagnosis. */
const FAILURES = [
  {
    n: '01',
    title: 'All or nothing',
    desc: 'Thirty-day sprints, punishing resets, then the inevitable collapse. Intensity you can’t sustain was never a plan — it was a promise to quit.',
  },
  {
    n: '02',
    title: 'Built for the average',
    desc: 'Generic programs written for no one in particular — and so, for no one at all. They ignore your body, your calendar and the life you actually lead.',
  },
  {
    n: '03',
    title: 'Willpower as a strategy',
    desc: 'Motivation is weather; it always passes. Anything that depends on feeling driven every morning is designed to fail on the days that matter most.',
  },
]

export default function Problem() {
  const { ref, reveal } = useReveal()

  return (
    <section id="problem" style={{ padding: 'clamp(44px,6vw,90px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(40px,5vw,88px)', alignItems: 'start' }}>
        {/* Left — the diagnosis */}
        <div>
          <div style={reveal(0)}>
            <SectionLabel>The problem</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em', maxWidth: '15ch' }}>
              Getting better shouldn’t be a war with{' '}
              <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: 400, color: INK, fontSize: '1.08em' }}>yourself</span>.
            </h2>
          </div>
          <p style={{ margin: 'clamp(22px,3vw,32px) 0 0', maxWidth: '40ch', fontSize: 'clamp(15px,1.35vw,17px)', lineHeight: 1.7, color: MUTED, ...reveal(120) }}>
            The most capable people we know don’t lack discipline. They’re let down by a fitness culture built on extremes — one that asks for everything, then leaves nothing behind. Three ideas quietly keep it broken.
          </p>
        </div>

        {/* Right — the three failure modes */}
        <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          {FAILURES.map((f, i) => (
            <div
              key={f.n}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'clamp(16px,2vw,28px)',
                padding: 'clamp(24px,2.8vw,34px) 0',
                borderBottom: `1px solid ${HAIRLINE}`,
                ...reveal(180 + i * 110, 'translateY(20px)'),
              }}
            >
              <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(30px,3.2vw,44px)', color: BRONZE, lineHeight: 1, minWidth: '1.6ch' }}>{f.n}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* A quiet ✕ — the mark of what doesn't work. Bronze, not accent. */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BRONZE} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M6 6 18 18M18 6 6 18" />
                  </svg>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(19px,2vw,24px)', letterSpacing: '-.02em' }}>{f.title}</h3>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.65, color: MUTED }}>{f.desc}</p>
              </div>
            </div>
          ))}

          {/* The bridge into the rest of the page. */}
          <p style={{ margin: 'clamp(22px,2.4vw,30px) 0 0', fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.55, color: MUTED_SOFT, ...reveal(180 + FAILURES.length * 110) }}>
            <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', color: INK, fontSize: '1.12em' }}>One percent</span>{' '}
            is the answer to all three.
          </p>
        </div>
      </div>
    </section>
  )
}
