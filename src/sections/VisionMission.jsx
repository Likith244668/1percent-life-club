import { INK, MUTED, HAIRLINE, BRONZE } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { EASE } from '../components/useReveal.js'

/* The statement, split into words so it can surface one word at a time —
   the reveal mirrors the copy: small increments, compounding into a sentence.
   `accent: true` marks the two words set in the signature serif italic. */
const SENTENCE = [
  ...'We don’t believe in overnight change. We believe in the quiet math of getting'.split(' ').map((text) => ({ text })),
  { text: 'one', accent: true },
  { text: 'percent', accent: true },
  ...'better — repeated until it becomes who you are.'.split(' ').map((text) => ({ text })),
]

const PLAIN_TEXT = SENTENCE.map((w) => w.text).join(' ')

// Visually hidden but readable by screen readers (mirrors Hero.jsx) — the
// word-split spans below are aria-hidden so assistive tech gets one sentence.
const srOnly = {
  position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
}

/* The two pillars of the club's intent. Vision is the world we're building
   toward; Mission is the work we do every day to get there. Written in the
   private-club voice — no growth-metric language, no mass-market promises. */
const STATEMENTS = [
  {
    key: 'Vision',
    title: 'Our vision',
    body: 'A private circle where the most driven people alive stop chasing transformation and start practising it — until being one percent better every day is simply who they are.',
  },
  {
    key: 'Mission',
    title: 'Our mission',
    body: 'To give 250 members the method, the room and the quiet accountability to compound one percent a day — built for life, never for a season.',
  },
]

export default function VisionMission() {
  const { ref, shown, reduce, reveal } = useReveal({ rootMargin: '0px 0px -18% 0px' })

  const word = (i) =>
    reduce
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(.45em)',
          transition: `opacity .55s ${EASE} ${140 + i * 26}ms, transform .7s ${EASE} ${140 + i * 26}ms`,
        }

  return (
    <section id="vision" style={{ padding: 'clamp(40px,5vw,84px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div style={reveal(0)}>
          <SectionLabel center style={{ marginBottom: 'clamp(26px,3vw,40px)' }}>Vision &amp; mission</SectionLabel>
        </div>

        {/* Centrepiece belief — the emotional anchor both statements resolve to. */}
        <p style={srOnly}>{PLAIN_TEXT}</p>
        <p aria-hidden="true" style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(1.7rem,3.7vw,3rem)', lineHeight: 1.2, letterSpacing: '-.03em' }}>
          {SENTENCE.map((w, i) => (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', ...word(i) }}>
              {w.accent ? (
                <span style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontStyle: 'italic', color: INK, fontSize: '1.12em' }}>{w.text}</span>
              ) : (
                w.text
              )}
              {i < SENTENCE.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        {/* Vision + Mission — two quiet columns, split by a hairline. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
            gap: 'clamp(28px,4vw,56px)',
            marginTop: 'clamp(44px,5vw,72px)',
            textAlign: 'left',
          }}
        >
          {STATEMENTS.map((s, i) => (
            <div
              key={s.key}
              style={{
                // On two-up, the second column carries a leading hairline; it
                // simply has no left rule when the columns stack on mobile.
                paddingLeft: i === 1 ? 'clamp(0px,3vw,56px)' : 0,
                borderLeft: i === 1 ? `1px solid ${HAIRLINE}` : 'none',
                ...reveal(160 + i * 120, 'translateY(24px)'),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(28px,3vw,40px)', color: BRONZE, lineHeight: 1 }}>0{i + 1}</span>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(20px,2.2vw,26px)', letterSpacing: '-.025em' }}>{s.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.7, color: MUTED }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
