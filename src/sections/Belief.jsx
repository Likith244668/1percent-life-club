import { INK } from '../theme.js'
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

export default function Belief() {
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
    <section id="belief" style={{ padding: 'clamp(56px,7vw,120px) clamp(20px,5vw,64px)' }}>
      <div ref={ref} style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div style={reveal(0)}>
          <SectionLabel center style={{ marginBottom: 'clamp(26px,3vw,40px)' }}>Our belief</SectionLabel>
        </div>
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
      </div>
    </section>
  )
}
