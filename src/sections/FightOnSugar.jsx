import { ACCENT, INK, MUTED, CARD_BORDER, BRONZE, BRONZE_FAINT, STAGE, SHADOW_PANEL } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import Hoverable from '../components/Hoverable.jsx'
import useReveal from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'

/* The club's one public stance: sugar is the quiet tax on a day's one percent.
   Framed as a discipline, not a diet — no forbidden-food scolding, no invented
   statistics. The old line chart tested badly (people couldn't read the
   spike-and-crash), so the story now lives in a phone mock: a "day of energy"
   timeline where each moment shows two simple meters — steady fuel vs sugar.
   At 3pm the sugar meter collapses to one bar while steady holds; the crash is
   undeniable without anyone having to parse a graph. */
const PLEDGE = [
  { title: 'Fewer spikes, not forbidden foods', desc: 'No crash diets and no banned list. We simply flatten the peaks that wreck an afternoon.' },
  { title: 'Labels, not headlines', desc: 'We read what’s actually in the jar — and quietly ignore whatever the front of the box is shouting.' },
  { title: 'Real food earns the day', desc: 'Protein and whole food first. Sugar isn’t the enemy at the table — it just stops running the schedule.' },
]

// Energy across a day, 0–5 bars. Both start level at breakfast; sugar overshoots
// by 11, craters at 3pm and never recovers, while steady climbs all day.
const DAY = [
  { time: '8 AM', title: 'Breakfast', note: 'Balanced', steady: 3, sugar: 3 },
  { time: '11 AM', title: 'The sugar high', note: 'Wired', steady: 4, sugar: 5 },
  { time: '3 PM', title: 'The 3 pm crash', note: 'Foggy', steady: 4, sugar: 1, crash: true },
  { time: '9 PM', title: 'Evening', note: 'Drained', steady: 5, sugar: 2 },
]

const TRACK = '#E6E6E6' // empty meter segment on the light phone screen

// A five-segment energy meter — reads like a signal / battery bar, not a chart.
function Meter({ value, color }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ flex: 1, height: '7px', borderRadius: '2px', background: i < value ? color : TRACK }} />
      ))}
    </div>
  )
}

export default function FightOnSugar() {
  const { ref, shown, reduce, reveal } = useReveal()

  // Rows cascade in once the phone lands (skipped under reduced motion).
  const row = (i) =>
    reduce
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(12px)',
          transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${520 + i * 130}ms, transform .6s cubic-bezier(.16,1,.3,1) ${520 + i * 130}ms`,
        }

  return (
    <section id="sugar" style={{ padding: 'clamp(34px,4.2vw,62px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 'clamp(32px,4vw,72px)', alignItems: 'center' }}>
          {/* Left — the stance */}
          <div>
            <div style={reveal(0)}>
              <SectionLabel>The fight on sugar</SectionLabel>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.9rem,4vw,3.2rem)', lineHeight: 1.04, letterSpacing: '-.035em', maxWidth: '15ch' }}>
                Sugar is the quiet tax on your{' '}
                <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: 400, color: INK, fontSize: '1.08em' }}>one percent</span>.
              </h2>
            </div>
            <p style={{ margin: 'clamp(20px,2.6vw,28px) 0 0', maxWidth: '44ch', fontSize: 'clamp(15px,1.35vw,17px)', lineHeight: 1.7, color: MUTED, ...reveal(120) }}>
              It spikes, then it steals — the crash takes the focus, the training and the evening with it. Members don’t swear off sugar. They just stop letting it run the day. Three quiet commitments do the work.
            </p>

            <div style={{ marginTop: 'clamp(24px,3vw,34px)', display: 'flex', flexDirection: 'column' }}>
              {PLEDGE.map((p, i) => (
                <div
                  key={p.title}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '14px',
                    padding: 'clamp(16px,1.8vw,20px) 0',
                    borderTop: `1px solid ${CARD_BORDER}`,
                    ...reveal(200 + i * 100, 'translateY(18px)'),
                  }}
                >
                  {/* a small check — the disciplined "yes", in ink not accent */}
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${BRONZE_FAINT}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1.8 6.2 4.5 9 10 2.8" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(16px,1.6vw,19px)', letterSpacing: '-.02em' }}>{p.title}</h3>
                    <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: MUTED }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — a phone mock: a day of energy, moment by moment */}
          <div style={{ display: 'flex', justifyContent: 'center', ...reveal(180, 'translateY(28px)') }}>
            <div
              role="img"
              aria-label="A day-of-energy app. Steady fuel and sugar both start level at breakfast. By 11am sugar spikes; by 3pm sugar has crashed to one bar while steady fuel holds at four; by 9pm steady is full and sugar is still low."
              style={{ width: 'min(322px,86vw)', background: INK, borderRadius: '46px', padding: '11px', boxShadow: SHADOW_PANEL }}
            >
              <div style={{ background: STAGE, borderRadius: '36px', overflow: 'hidden' }}>
                {/* status bar + dynamic island */}
                <div style={{ position: 'relative', height: '46px' }}>
                  <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '92px', height: '26px', background: INK, borderRadius: '14px' }} />
                  <span style={{ position: 'absolute', top: '15px', left: '24px', fontSize: '13px', fontWeight: 600, color: INK, letterSpacing: '-.02em' }}>9:41</span>
                  <div style={{ position: 'absolute', top: '18px', right: '22px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {[6, 8, 10, 12].map((h) => (
                      <span key={h} style={{ width: '3px', height: `${h}px`, borderRadius: '1px', background: INK }} />
                    ))}
                    <span style={{ marginLeft: '3px', width: '20px', height: '11px', border: `1.4px solid ${INK}`, borderRadius: '3px', padding: '1.5px', display: 'inline-flex' }}>
                      <span style={{ flex: 1, background: INK, borderRadius: '1px' }} />
                    </span>
                  </div>
                </div>

                {/* app content */}
                <div style={{ padding: '4px 22px 24px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: BRONZE }}>A day of energy</span>
                  <p style={{ margin: '6px 0 2px', fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '20px', color: INK, lineHeight: 1.2 }}>Same breakfast, same&nbsp;morning</p>

                  {/* legend */}
                  <div style={{ display: 'flex', gap: '16px', margin: '14px 0 6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 600, color: INK }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: INK }} />Steady fuel
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: MUTED }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: BRONZE }} />Sugar
                    </span>
                  </div>

                  {/* timeline */}
                  {DAY.map((d, i) => (
                    <div
                      key={d.time}
                      style={{
                        marginTop: '8px',
                        padding: '12px 13px',
                        borderRadius: '16px',
                        background: d.crash ? 'rgba(20,20,20,0.05)' : 'transparent',
                        border: `1px solid ${d.crash ? BRONZE_FAINT : 'transparent'}`,
                        ...row(i),
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '9px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '9px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: BRONZE, minWidth: '34px' }}>{d.time}</span>
                          <span style={{ fontSize: '14.5px', fontWeight: d.crash ? 700 : 600, color: INK, letterSpacing: '-.02em' }}>{d.title}</span>
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: d.crash ? INK : BRONZE }}>{d.note}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', columnGap: '10px', rowGap: '7px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10.5px', color: MUTED }}>Steady</span>
                        <Meter value={d.steady} color={INK} />
                        <span style={{ fontSize: '10.5px', color: MUTED }}>Sugar</span>
                        <Meter value={d.sugar} color={BRONZE} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* the plain-English takeaway, full width under both columns */}
        <p style={{ margin: 'clamp(28px,3.5vw,44px) auto 0', maxWidth: '58ch', textAlign: 'center', fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.6, color: MUTED, ...reveal(240) }}>
          Same start. By <strong style={{ color: INK, fontWeight: 600 }}>3&nbsp;pm</strong> sugar has crashed you below normal — and there it stays. Steady fuel just keeps climbing.
        </p>

        {/* Gateway to the hands-on detail page (scratch a label, swipe the defaults). */}
        <div style={{ marginTop: 'clamp(26px,3vw,38px)', display: 'flex', justifyContent: 'center', ...reveal(320) }}>
          <Hoverable
            as="a"
            href="#/fight-on-sugar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#fff',
              background: ACCENT,
              padding: '16px 30px',
              borderRadius: '100px',
              textDecoration: 'none',
              transition: 'transform .3s, background .3s',
            }}
            hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
          >
            Open the sugar field guide
            <ArrowUpRight size={16} />
          </Hoverable>
        </div>
      </div>
    </section>
  )
}
