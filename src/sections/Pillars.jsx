import { INK, MUTED } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import TierList from '../components/TierList.jsx'
import useReveal from '../components/useReveal.js'

/* The five pillars of the method — the whole club in one frame. They map one
   to one onto the five habits the app tracks (Move·Fuel·Rest·Mind·Belong).
   Rendered as big editorial accordion rows — the reference's "tier" block. */
const PILLARS = [
  { name: 'Move', line: 'Train with intent', desc: 'Compound-led sessions that respect your time — roughly twenty-three focused minutes. Consistency over intensity, every day it counts.' },
  { name: 'Fuel', line: 'Eat like it matters', desc: 'Calorie-smart, muscle-first nutrition without the dogma. Enough structure to protect your energy — never so much it runs your life.' },
  { name: 'Rest', line: 'Recover on purpose', desc: 'Sleep, mobility and breath — the half of progress no one photographs. We make room for it, because that is where the gains are kept.' },
  { name: 'Mind', line: 'Steady the operator', desc: 'Focus, stillness and the quiet clarity to keep showing up. A calmer head is the difference between a good week and a good decade.' },
  { name: 'Belong', line: 'Keep good company', desc: 'A private circle of 250 who expect you to show up. On the days motivation dips, the room carries you the rest of the way.' },
]

export default function Pillars() {
  const { ref, reveal } = useReveal()

  const items = PILLARS.map((p) => ({
    id: p.name,
    title: p.name,
    body: `${p.line}. ${p.desc}`,
  }))

  return (
    <section id="pillars" style={{ padding: 'clamp(40px,5vw,78px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: 'clamp(30px,4vw,48px)' }}>
          <div style={reveal(0)}>
            <SectionLabel>The five pillars</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em', maxWidth: '16ch' }}>
              Five pillars.{' '}
              <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: 400, color: INK, fontSize: '1.08em' }}>One percent</span>{' '}
              each.
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', maxWidth: '340px', fontSize: '15px', lineHeight: 1.6, color: MUTED, ...reveal(120) }}>
            Hold all five and the whole life moves. Miss one and the others quietly compensate — so we build every day around the full set.
          </p>
        </div>

        <div style={reveal(160, 'translateY(22px)')}>
          <TierList items={items} />
        </div>
      </div>
    </section>
  )
}
