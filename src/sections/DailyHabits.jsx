import { useRef } from 'react'
import { ACCENT, INK, MUTED, CARD_BORDER, BRONZE, BRONZE_FAINT, MQ_REDUCE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE, useMedia, useInView } from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

/* A habit is "complete" once today's minimum is logged — the bar shows how
   far past it you went. The one remaining habit is the card's visible nudge:
   the "next one percent" the copy on the left promises. */
const HABITS = [
  { name: 'Workout', value: '45 / 45 min', pct: 100, done: true },
  { name: 'Water', value: '2.4 / 3.0 L', pct: 80, done: true },
  { name: 'Protein', value: '128 / 140 g', pct: 91, done: true },
  { name: 'Sleep', value: '7.5 / 8.0 h', pct: 94, done: true },
  { name: 'Meditation', pct: 0, next: true, nudge: 'Start · 10 min' },
]

/* -------------------------------------------------------------------- rows */

function StatusDot({ done }) {
  return done ? (
    <span style={{ width: '17px', height: '17px', borderRadius: '50%', background: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="complete">
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
        <path d="M1.5 5.2 4 7.7 8.5 2.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span style={{ width: '17px', height: '17px', borderRadius: '50%', border: `1.5px dashed ${BRONZE_FAINT}`, flexShrink: 0, boxSizing: 'border-box' }} aria-label="not started" />
  )
}

function HabitRow({ habit, filled, delay, reduce }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600 }}>
          <StatusDot done={habit.done} />
          {habit.name}
        </span>
        {habit.next ? (
          <span style={{ fontSize: '12px', fontWeight: 600, color: ACCENT, background: `color-mix(in srgb,${ACCENT} 10%,#fff)`, border: `1px solid color-mix(in srgb,${ACCENT} 30%,#fff)`, padding: '4px 11px', borderRadius: '100px' }}>
            {habit.nudge}
          </span>
        ) : (
          <span style={{ fontSize: '13px', color: MUTED }}>{habit.value}</span>
        )}
      </div>
      <div style={{ height: '6px', background: CARD_BORDER, borderRadius: '100px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: filled ? `${habit.pct}%` : '0%',
            background: ACCENT,
            borderRadius: '100px',
            transition: reduce ? 'none' : `width .9s ${EASE} ${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- section */

export default function DailyHabits() {
  const cardRef = useRef(null)
  const reduce = useMedia(MQ_REDUCE)
  const inView = useInView(cardRef, 0.35)
  const { ref: copyRef, reveal } = useReveal()

  return (
    <section id="habits" style={{ margin: 'clamp(10px,1.3vw,18px)', background: INK, color: '#fff', borderRadius: 'clamp(22px,2.4vw,36px)', padding: 'clamp(48px,7vw,110px) clamp(22px,5vw,72px)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(380px,100%),1fr))', gap: 'clamp(40px,5vw,80px)', alignItems: 'center' }}>
        <div ref={copyRef}>
          <div style={reveal(0)}>
            <SectionLabel color={BRONZE}>Daily habits</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
              Your day, in<br />one quiet view.
            </h2>
          </div>
          <p style={{ margin: '24px 0 0', fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.7, color: BRONZE, maxWidth: '430px', ...reveal(130) }}>
            Five habits. No noise, no guilt — just a calm dashboard that shows your progress and nudges your next one percent.
          </p>
          {/* The CTA transitions its own transform on hover, so the reveal
              lives on this wrapper instead. */}
          <div style={reveal(240)}>
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
        </div>

        <div
          ref={cardRef}
          style={{
            background: '#fff', color: INK, borderRadius: '20px', padding: 'clamp(22px,2.4vw,32px)', boxShadow: '0 50px 90px -50px rgba(0,0,0,.7)',
            // Card rises on the same inView signal that fills the bars, so the
            // dashboard arrives and comes alive in one motion.
            ...(reduce ? {} : {
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(30px) scale(.985)',
              transition: `opacity .75s ${EASE}, transform .95s ${EASE}`,
            }),
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', color: MUTED }}>Today · Day 142</div>
              <div style={{ fontWeight: 800, fontSize: '23px', letterSpacing: '-.02em', marginTop: '2px' }}>4 of 5 complete</div>
            </div>
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: `conic-gradient(${ACCENT} 288deg,${CARD_BORDER} 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '43px', height: '43px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>80%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {HABITS.map((h, i) => (
              <HabitRow key={h.name} habit={h} filled={inView} delay={i * 110} reduce={reduce} />
            ))}
          </div>

          {/* the quiet payoff: today's streak in the language of the curve above */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginTop: '26px', paddingTop: '18px', borderTop: `1px solid ${CARD_BORDER}` }}>
            <span style={{ fontSize: '13px', color: MUTED }}>142 days of one percent</span>
            {/* 1.01^142 ≈ 4.1 */}
            <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '17px', color: INK }}>
              ≈ 4.1<span style={{ color: BRONZE }}>×</span> your day-one self
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
