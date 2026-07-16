import { useEffect, useRef, useState } from 'react'
import { ACCENT, INK, DARK, STAGE, MUTED, CARD_BORDER, BRONZE, BRONZE_FAINT, MQ_REDUCE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE, useMedia, useInView } from '../components/useReveal.js'
import { ArrowUpRight, Play } from '../components/Icons.jsx'

/* ---------------------------------------------------------------- app content

   The phone runs a looping four-beat demo of the club app:
     0  LOCK    — a nudge lands on the lock screen ("time to eat")
     1  OPEN    — a beat of the logo as the app opens
     2  PLAN    — today's meal plan: what to eat, and when
     3  TRAIN   — the session waiting next, with the day's exercises
   It plays only once the section is in view, and holds on PLAN under
   prefers-reduced-motion so nothing moves.                                    */

const PHASE = { LOCK: 0, OPEN: 1, PLAN: 2, TRAIN: 3 }
const DURATIONS = [2900, 950, 3900, 3600] // ms each beat holds
// Which progress dot lights up for each phase (OPEN shares LOCK's dot).
const STEP_OF = [0, 0, 1, 2]
const STEPS = ['Nudge', 'Plan', 'Train']

const MEALS = [
  { time: '8:00', name: 'Overnight oats', macro: '32g', done: true },
  { time: '13:00', name: 'Grilled chicken bowl', macro: '45g', now: true },
  { time: '16:00', name: 'Greek yogurt & nuts', macro: '18g' },
  { time: '20:00', name: 'Salmon & greens', macro: '40g' },
]

const EXERCISES = [
  { name: 'Incline bench press', sets: '4 × 8' },
  { name: 'Seated cable row', sets: '4 × 10' },
  { name: 'Overhead press', sets: '3 × 10' },
  { name: 'Face pull', sets: '3 × 15' },
]

/* ------------------------------------------------------------- shared chrome */

// The little brand mark used as the app icon and splash logo.
function AppMark({ size = 30, radius = 9, font = 12 }) {
  return (
    <span style={{ flexShrink: 0, width: size, height: size, borderRadius: radius, background: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: font, letterSpacing: '-.03em', boxShadow: '0 7px 16px -7px rgba(255,107,0,.95)' }}>1%</span>
  )
}

// Light-screen status bar (dark glyphs).
function StatusBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: INK, padding: '0 4px', flexShrink: 0 }}>
      <span>9:41</span>
      <span style={{ width: '16px', height: '9px', borderRadius: '2px', border: `1px solid ${INK}`, opacity: .85, position: 'relative', display: 'inline-block' }}>
        <span style={{ position: 'absolute', top: '1.5px', bottom: '1.5px', left: '1.5px', right: '4px', background: INK, borderRadius: '1px' }} />
      </span>
    </div>
  )
}

// Shared screen header: overline + title on the left, app mark on the right.
function ScreenHead({ over, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: '10.5px', color: MUTED }}>{over}</div>
        <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-.02em', marginTop: '1px' }}>{title}</div>
      </div>
      <AppMark size={30} />
    </div>
  )
}

/* --------------------------------------------------------------- the screens */

// 0 — LOCK SCREEN: clock, date, and the incoming nudge with a tap ripple.
function LockScreen({ playing }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', background: 'radial-gradient(120% 80% at 50% 0%,#242424 0%,#0b0b0b 70%)', color: '#fff' }}>
      <div style={{ marginTop: '30px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,.6)' }}>Monday, 16 June</div>
      <div style={{ fontSize: '62px', fontWeight: 300, letterSpacing: '-.03em', lineHeight: 1, marginTop: '2px' }}>9:41</div>

      {/* the nudge */}
      <div style={{ marginTop: 'auto', width: '100%' }}>
        <div style={{ position: 'relative', display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(255,255,255,.13)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '18px', padding: '12px 12px', boxShadow: '0 26px 50px -26px rgba(0,0,0,.7)' }}>
          <AppMark />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>1% Life Club</span>
              <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,.55)' }}>now</span>
            </div>
            <div style={{ fontSize: '11px', lineHeight: 1.34, color: 'rgba(255,255,255,.92)', marginTop: '2px' }}>
              Time to eat — your lunch plan is ready. Tap to open.
            </div>
          </div>
          {/* tap ripple hint */}
          {playing && (
            <span aria-hidden="true" style={{ position: 'absolute', right: '16px', bottom: '-6px', width: '26px', height: '26px', borderRadius: '50%', border: `2px solid ${ACCENT}`, animation: `lcTap 1.6s ${EASE} infinite` }} />
          )}
        </div>
      </div>

      {/* home indicator */}
      <div style={{ width: '34%', height: '4px', borderRadius: '100px', background: 'rgba(255,255,255,.55)', marginTop: '16px' }} />
    </div>
  )
}

// 1 — OPEN: a brief logo splash as the app launches.
function Splash() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: '#fff' }}>
      <AppMark size={58} radius={17} font={22} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
        <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '-.02em', color: INK }}>1% LIFE CLUB</span>
        <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: MUTED, marginTop: '5px' }}>Your day, planned</span>
      </div>
    </div>
  )
}

// 2 — PLAN: today's meals on a timeline, the "now" meal highlighted.
function FoodPlan() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#fff', color: INK, padding: '15px' }}>
      <StatusBar />
      <ScreenHead over="Today · Day 142" title="Your meal plan" />

      {/* protein progress */}
      <div style={{ marginTop: '15px', padding: '11px 13px', background: STAGE, borderRadius: '13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: MUTED }}>Protein</span>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>128 <span style={{ color: MUTED, fontWeight: 400 }}>/ 140 g</span></span>
        </div>
        <div style={{ height: '6px', background: '#fff', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '91%', background: ACCENT, borderRadius: '100px' }} />
        </div>
      </div>

      {/* meal timeline — stretches to fill, reads like the day itself */}
      <div style={{ position: 'relative', flex: 1, marginTop: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '2px' }}>
        <div style={{ position: 'absolute', left: '52px', top: '14px', bottom: '14px', width: '2px', background: CARD_BORDER }} />
        {MEALS.map((m) => (
          <div key={m.time} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '11px' }}>
            <span style={{ width: '38px', flexShrink: 0, fontSize: '11px', fontWeight: 700, color: m.now ? ACCENT : MUTED, textAlign: 'right' }}>{m.time}</span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: m.done || m.now ? ACCENT : '#fff', border: m.done || m.now ? 'none' : `1.5px solid ${BRONZE_FAINT}`, boxShadow: m.now ? `0 0 0 4px color-mix(in srgb,${ACCENT} 18%,#fff)` : `0 0 0 3px #fff` }} />
            <span style={{ flex: 1, minWidth: 0, background: m.now ? `color-mix(in srgb,${ACCENT} 8%,#fff)` : 'transparent', border: m.now ? `1px solid color-mix(in srgb,${ACCENT} 26%,#fff)` : '1px solid transparent', borderRadius: '11px', padding: m.now ? '8px 11px' : '5px 3px' }}>
              <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', fontSize: '11.5px', fontWeight: 600 }}>
                <span style={{ minWidth: 0 }}>{m.name}</span>
                <span style={{ flexShrink: 0, color: m.now ? ACCENT : MUTED, fontWeight: m.now ? 700 : 500 }}>{m.now ? 'Now' : m.macro}</span>
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* daily summary */}
      <div style={{ paddingTop: '13px', borderTop: `1px solid ${CARD_BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: MUTED }}>Planned today</span>
        <span style={{ fontSize: '11px', fontWeight: 700 }}>1,840 kcal · 135g protein</span>
      </div>
    </div>
  )
}

// 3 — TRAIN: the next session card and the day's exercises.
function WorkoutPlan() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#fff', color: INK, padding: '15px' }}>
      <StatusBar />
      <ScreenHead over="Up next · 6:30 pm" title="Your session" />

      {/* the workout card */}
      <div style={{ position: 'relative', marginTop: '15px', borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(150deg,#2a2a2a,#0e0e0e)', color: '#fff', padding: '15px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '130px', height: '130px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,107,0,.5),transparent 70%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>Strength · Day B</div>
          <div style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-.02em', marginTop: '4px' }}>Upper body</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '3px' }}>45 min · 6 exercises</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '14px', background: ACCENT, color: '#fff', fontSize: '11.5px', fontWeight: 700, padding: '9px 15px', borderRadius: '100px' }}>
            <Play size={9} color="#fff" /> Start session
          </div>
        </div>
      </div>

      {/* today's exercises — stretches to fill */}
      <div style={{ flex: 1, marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: '8px', flexShrink: 0 }}>Today&rsquo;s moves</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {EXERCISES.map((e) => (
            <div key={e.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '11.5px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                {e.name}
              </span>
              <span style={{ color: MUTED, fontWeight: 500 }}>{e.sets}</span>
            </div>
          ))}
        </div>
      </div>

      {/* streak payoff */}
      <div style={{ paddingTop: '13px', borderTop: `1px solid ${CARD_BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: MUTED }}>142 days</span>
        <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '13px', color: INK }}>
          ≈ 4.1<span style={{ color: BRONZE }}>×</span> your day-one self
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- phone + flow */

function PhoneFlow({ inView, reduce }) {
  const [phase, setPhase] = useState(PHASE.LOCK)

  // Optional test hook: a screenshot harness can pin a phase via window.__lcFlow.
  const pinned = typeof window !== 'undefined' && typeof window.__lcFlow === 'number' ? window.__lcFlow : null
  const active = reduce ? PHASE.PLAN : (pinned != null ? pinned : phase)

  useEffect(() => {
    if (reduce || pinned != null || !inView) return
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), DURATIONS[phase])
    return () => clearTimeout(t)
  }, [phase, inView, reduce, pinned])

  const layer = (i) => ({
    opacity: active === i ? 1 : 0,
    transform: active === i ? 'none' : 'scale(.98)',
    transition: reduce ? 'none' : `opacity .5s ${EASE}, transform .65s ${EASE}`,
    zIndex: active === i ? 2 : 1,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
      <div style={{ animation: reduce ? 'none' : 'lcHabitFloat 6s ease-in-out infinite' }}>
        <div
          style={{
            position: 'relative',
            width: 'clamp(258px,29vw,300px)',
            background: 'linear-gradient(160deg,#262626 0%,#0f0f0f 62%)',
            borderRadius: '46px',
            padding: '10px',
            border: '1px solid rgba(255,255,255,.07)',
            boxShadow: '0 60px 110px -50px rgba(0,0,0,.8), 0 40px 130px -50px rgba(255,107,0,.16)',
          }}
        >
          {/* notch */}
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', width: '32%', height: '20px', background: '#0f0f0f', borderRadius: '0 0 13px 13px', zIndex: 9 }} />

          {/* screen — fixed tall aspect; each beat fills it edge-to-edge */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '9 / 18', background: '#fff', borderRadius: '38px', overflow: 'hidden' }}>
            <div style={layer(PHASE.LOCK)}><LockScreen playing={!reduce && inView && active === PHASE.LOCK} /></div>
            <div style={layer(PHASE.OPEN)}><Splash /></div>
            <div style={layer(PHASE.PLAN)}><FoodPlan /></div>
            <div style={layer(PHASE.TRAIN)}><WorkoutPlan /></div>
          </div>
        </div>
      </div>

      {/* step legend — where we are in the flow */}
      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {STEPS.map((label, i) => {
          const on = STEP_OF[active] === i
          return (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 600, letterSpacing: '.02em', color: on ? '#fff' : 'rgba(255,255,255,.4)', transition: `color .4s ${EASE}` }}>
              <span style={{ width: on ? '18px' : '6px', height: '6px', borderRadius: '100px', background: on ? ACCENT : 'rgba(255,255,255,.28)', transition: `width .4s ${EASE}, background .4s ${EASE}` }} />
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- section */

export default function DailyHabits() {
  const cardRef = useRef(null)
  const reduce = useMedia(MQ_REDUCE)
  const inView = useInView(cardRef, 0.3)
  const { ref: copyRef, reveal } = useReveal()

  return (
    <section id="habits" style={{ margin: 'clamp(10px,1.3vw,18px)', background: DARK, color: '#fff', borderRadius: 'clamp(22px,2.4vw,36px)', padding: 'clamp(36px,5vw,78px) clamp(22px,5vw,72px)', overflow: 'hidden' }}>
      <style>{`@keyframes lcHabitFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes lcTap{0%{opacity:.9;transform:scale(.6)}70%{opacity:0;transform:scale(1.5)}100%{opacity:0}}`}</style>

      <div style={{ maxWidth: '1340px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(360px,100%),1fr))', gap: 'clamp(40px,5vw,80px)', alignItems: 'center' }}>
        {/* ---------------------------------------------------------- copy */}
        <div ref={copyRef}>
          <div style={reveal(0)}>
            <SectionLabel color={BRONZE}>Daily habits</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
              Your day,<br />quietly planned.
            </h2>
          </div>
          <p style={{ margin: '24px 0 0', fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.7, color: 'rgba(255,255,255,.72)', maxWidth: '440px', ...reveal(130) }}>
            A gentle nudge lands on your lock screen. One tap opens today — what to eat and when, the session waiting next, and a streak that keeps itself. No noise, no guilt.
          </p>
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

        {/* ------------------------------------------------- phone + flow */}
        <div
          ref={cardRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            ...(reduce ? {} : {
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(34px) scale(.985)',
              transition: `opacity .8s ${EASE}, transform .95s ${EASE}`,
            }),
          }}
        >
          <PhoneFlow inView={inView} reduce={reduce} />
        </div>
      </div>
    </section>
  )
}
