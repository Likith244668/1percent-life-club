import { ACCENT } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'

export default function Belief() {
  return (
    <section id="belief" style={{ padding: 'clamp(56px,7vw,120px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel center style={{ marginBottom: 'clamp(26px,3vw,40px)' }}>Our belief</SectionLabel>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(1.7rem,3.7vw,3rem)', lineHeight: 1.2, letterSpacing: '-.03em' }}>
          We don't believe in overnight change. We believe in the quiet math of getting{' '}
          <span style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontStyle: 'italic', color: ACCENT }}>one percent</span>{' '}
          better — repeated until it becomes who you are.
        </p>
      </div>
    </section>
  )
}
