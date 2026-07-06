import { useEffect, useMemo, useRef, useState } from 'react'
import { ACCENT, MUTED, MUTED_SOFT, INK, LABEL, CARD_BORDER, BRONZE, BRONZE_FAINT, SHADOW_CARD, MQ_MOBILE, MQ_REDUCE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE, useMedia, useInView } from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

const RATE = 1.01
const YEAR = 365

/* ------------------------------------------------------------------ content
   The three reasons are milestones on the compounding curve. The days are
   not decoration: day 1 is the honest baseline, day 66 is roughly when a
   habit becomes automatic, day 365 is the full year of one percent. */
const MILESTONES = [
  {
    day: 1,
    title: 'A personal method',
    body: 'Your plan starts with an honest assessment — not a template. It fits your body, your schedule and your pace from day one, so the first step is one you can actually take.',
    caption: 'Better by day 1. It starts small on purpose — with a plan that fits you.',
    link: { label: 'Explore the method', href: '#method' },
  },
  {
    day: 66,
    title: 'Habits that compound',
    body: 'Five small daily actions, tracked in one calm view. Around day 66 they stop needing willpower — and that is exactly when the curve starts pulling away from the flat line.',
    caption: 'Better by day 66 — about when a habit stops needing willpower.',
    link: { label: 'See the daily system', href: '#habits' },
  },
  {
    day: YEAR,
    title: 'A private circle',
    body: 'A room of 250 founders, doctors and leaders who expect you to show up. On the days motivation dips, the circle carries you — all the way to day 365.',
    caption: 'Better by day 365. One year of one percent, compounded.',
    link: { label: 'Meet the members', href: '#ambassadors' },
  },
]

/* ------------------------------------------------------------------- hooks */

// Eases a number toward `target` so the multiplier counts up/down.
function useCountUp(target, disabled) {
  const [val, setVal] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (disabled) { from.current = target; setVal(target); return }
    if (from.current === target) return
    const start = from.current
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 800)
      const e = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setVal(start + (target - start) * e)
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); from.current = target }
  }, [target, disabled])
  return val
}

/* ------------------------------------------------------------------- chart */

// SVG coordinate system. Linear scale on purpose: the flat weeks followed by
// the late surge IS the story this section tells.
const W = 560, H = 340
const PT = 18, PR = 20, PB = 40, PL = 16
const VMAX = 42
const chartX = (day) => PL + (day / YEAR) * (W - PL - PR)
const chartY = (v) => PT + (1 - v / VMAX) * (H - PT - PB)

function CompoundChart({ active, drawn, reduce, small }) {
  // The svg scales down with its column, so on phones the type inside the
  // 560-unit viewBox must be authored larger to stay readable.
  const fs = (n) => (small ? n * 1.7 : n)
  const curve = useMemo(() => {
    const pts = []
    for (let d = 0; d <= YEAR; d += 5) pts.push(`${chartX(d).toFixed(1)} ${chartY(Math.pow(RATE, d)).toFixed(1)}`)
    pts.push(`${chartX(YEAR).toFixed(1)} ${chartY(Math.pow(RATE, YEAR)).toFixed(1)}`)
    return `M ${pts.join(' L ')}`
  }, [])
  // The shaded wedge between the curve and the 1.00× line — the gain itself.
  const area = `${curve} L ${chartX(YEAR).toFixed(1)} ${chartY(1).toFixed(1)} L ${chartX(0).toFixed(1)} ${chartY(1).toFixed(1)} Z`

  const m = MILESTONES[active]
  const mx = chartX(m.day)
  const my = chartY(Math.pow(RATE, m.day))
  const appear = { opacity: drawn ? 1 : 0, transition: reduce ? 'none' : `opacity .6s ${EASE} 1.3s` }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', width: '100%', height: 'auto' }}
      role="img"
      aria-label={`Compounding curve: one percent better every day grows to ${Math.pow(RATE, YEAR).toFixed(1)} times better over 365 days, while zero percent a day stays flat at 1.`}
    >
      <defs>
        <linearGradient id="lcCompoundFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity=".2" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* multiplier gridlines */}
      {[10, 20, 30].map((v) => (
        <g key={v}>
          <line x1={PL} x2={W - PR} y1={chartY(v)} y2={chartY(v)} stroke={CARD_BORDER} strokeWidth="1" />
          <text x={PL} y={chartY(v) - 5} fontSize={fs(10)} fill={MUTED}>{v}×</text>
        </g>
      ))}

      {/* the flat line: what a day of 0% looks like, all year */}
      <line x1={PL} x2={W - PR} y1={chartY(1)} y2={chartY(1)} stroke={BRONZE_FAINT} strokeWidth="1.2" strokeDasharray="4 5" />
      <text x={W - PR} y={chartY(1) - 7} textAnchor="end" fontSize={fs(10.5)} fill={BRONZE}>
        0% a day — flat at 1.00×
      </text>

      {/* the only days worth labelling: the three milestones */}
      {MILESTONES.map(({ day }) => (
        <text
          key={day}
          x={chartX(day)}
          y={H - PB + 22}
          textAnchor={day === 1 ? 'start' : day === YEAR ? 'end' : 'middle'}
          fontSize={fs(10)}
          fontWeight="600"
          letterSpacing=".14em"
          fill={MILESTONES[active].day === day ? ACCENT : BRONZE}
          style={{ textTransform: 'uppercase', transition: 'fill .35s' }}
        >
          Day {day}
        </text>
      ))}

      {/* gain wedge + curve, drawn in when the section scrolls into view */}
      <path d={area} fill="url(#lcCompoundFill)" style={{ opacity: drawn ? 1 : 0, transition: reduce ? 'none' : `opacity .9s ${EASE} 1s` }} />
      <path
        d={curve}
        fill="none"
        stroke={ACCENT}
        strokeWidth={small ? 3.5 : 2.5}
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={drawn ? 0 : 1}
        style={{ transition: reduce ? 'none' : `stroke-dashoffset 1.7s ${EASE} .15s` }}
      />

      {/* milestone dots on the curve */}
      {MILESTONES.map(({ day }) => (
        <circle key={day} cx={chartX(day)} cy={chartY(Math.pow(RATE, day))} r={small ? 4.5 : 3} fill="#fff" stroke={ACCENT} strokeWidth="1.4" style={appear} />
      ))}

      {/* active marker, gliding along the curve */}
      <g style={{ ...appear, transform: `translate(${mx}px,${my}px)`, transition: `${appear.transition}, transform ${reduce ? '0s' : `.7s ${EASE}`}` }}>
        <circle r={small ? 15 : 11} fill={ACCENT} opacity=".16" />
        <circle r={small ? 7 : 5} fill={ACCENT} stroke="#fff" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

/* ----------------------------------------------------------------- section */

export default function WhyItWorks() {
  const panelRef = useRef(null)
  const reduce = useMedia(MQ_REDUCE)
  const small = useMedia(MQ_MOBILE)
  const inView = useInView(panelRef, 0.3)
  const { ref: headRef, reveal } = useReveal()

  const [active, setActive] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const [paused, setPaused] = useState(false)

  // Gently walk through the milestones until the reader takes over.
  useEffect(() => {
    if (!inView || reduce || interacted || paused) return
    const id = setInterval(() => setActive((a) => (a + 1) % MILESTONES.length), 4000)
    return () => clearInterval(id)
  }, [inView, reduce, interacted, paused])

  const select = (i) => { setActive(i); setInteracted(true) }

  const m = MILESTONES[active]
  const value = useCountUp(Math.pow(RATE, m.day), reduce)
  const display = value >= 10 ? value.toFixed(1) : value.toFixed(2)

  return (
    <section id="why" style={{ padding: 'clamp(48px,6vw,88px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div ref={headRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: 'clamp(30px,3.4vw,48px)' }}>
          <div style={reveal(0)}>
            <SectionLabel>Why it works</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em' }}>
              Built around{' '}
              <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: 400, color: INK, fontSize: '1.08em' }}>you</span>,
              <br />not the average.
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', maxWidth: '330px', fontSize: '15px', lineHeight: 1.6, color: MUTED, ...reveal(120) }}>
            One percent is invisible on any given day and impossible to miss after a year. Three things keep you on the curve.
          </p>
        </div>

        <div
          ref={panelRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            background: '#fff',
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: '26px',
            padding: 'clamp(24px,3vw,48px)',
            boxShadow: SHADOW_CARD,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(380px,100%),1fr))',
            gap: 'clamp(28px,4vw,64px)',
            alignItems: 'center',
            // The panel rises as its own inView fires; the chart inside then
            // draws on the same signal, so the two read as one gesture.
            ...(reduce ? {} : {
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(30px)',
              transition: `opacity .75s ${EASE}, transform .95s ${EASE}`,
            }),
          }}
        >
          {/* ------------------------------------------------ the proof */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: LABEL }}>
                The compound effect
              </span>
              <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '17px', color: MUTED_SOFT }}>
                1.01<sup style={{ fontSize: '.62em' }}>{m.day}</sup>
              </span>
            </div>
            <div style={{ marginTop: '16px', fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(56px,6vw,88px)', lineHeight: 0.95, letterSpacing: '-.02em', color: INK }}>
              {display}<span style={{ color: BRONZE }}>×</span>
            </div>
            <p style={{ margin: '12px 0 20px', fontSize: '14px', lineHeight: 1.55, color: MUTED, maxWidth: '36ch', minHeight: '3.1em' }}>
              {m.caption}
            </p>
            <CompoundChart active={active} drawn={inView} reduce={reduce} small={small} />
          </div>

          {/* --------------------------------------------- the reasons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MILESTONES.map((r, i) => {
              const isActive = i === active
              return (
                <Hoverable
                  key={r.title}
                  style={{
                    borderRadius: '16px',
                    background: isActive ? `color-mix(in srgb,${ACCENT} 7%,#fff)` : 'transparent',
                    border: `1px solid ${isActive ? `color-mix(in srgb,${ACCENT} 28%,${CARD_BORDER})` : 'transparent'}`,
                    transition: 'background .35s,border-color .35s',
                  }}
                  hoverStyle={isActive ? {} : { background: `color-mix(in srgb,${ACCENT} 4%,#fff)` }}
                >
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-expanded={isActive}
                    aria-controls={`why-reason-${i}`}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      color: INK,
                      padding: 'clamp(16px,1.7vw,22px) clamp(16px,1.8vw,24px)',
                    }}
                  >
                    <span>
                      <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: isActive ? ACCENT : LABEL, transition: 'color .35s' }}>
                        Day {r.day}
                      </span>
                      <span style={{ display: 'block', marginTop: '7px', fontWeight: 700, fontSize: 'clamp(18px,1.7vw,21px)', letterSpacing: '-.02em' }}>
                        {r.title}
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0, transform: isActive ? 'rotate(45deg)' : 'none', transition: `transform .45s ${EASE}` }}>
                      <path d="M9 2v14M2 9h14" stroke={isActive ? ACCENT : BRONZE} strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div id={`why-reason-${i}`} style={{ display: 'grid', gridTemplateRows: isActive ? '1fr' : '0fr', transition: reduce ? 'none' : `grid-template-rows .5s ${EASE}` }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 clamp(16px,1.8vw,24px) clamp(18px,1.9vw,24px)' }}>
                        <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.65, color: MUTED }}>{r.body}</p>
                        <a
                          href={r.link.href}
                          tabIndex={isActive ? 0 : -1}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: 600, color: INK, textDecoration: 'none' }}
                        >
                          {r.link.label}
                          <ArrowUpRight size={15} color={INK} />
                        </a>
                      </div>
                    </div>
                  </div>
                </Hoverable>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
