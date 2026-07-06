import { useState } from 'react'
import { LABEL, BRONZE, MQ_REDUCE } from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import useReveal, { useMedia } from '../components/useReveal.js'

/* "The company you keep" — a quiet roll-call of the rooms our members lead.
   One slow small-caps line instead of logo tiles: in a private club the
   social proof is who sits next to you, not which brands endorse you. */
const PROFESSIONS = [
  'Surgeons', 'Founders', 'CEOs', 'Cardiologists', 'Investors',
  'Barristers', 'Consultants', 'Architects', 'Fund managers', 'Professors',
]

const MASK = 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'

function Profession({ name }) {
  return (
    <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: LABEL, padding: '0 22px' }}>
        {name}
      </span>
      <span aria-hidden="true" style={{ color: BRONZE, fontSize: '13px' }}>·</span>
    </span>
  )
}

export default function LogoMarquee() {
  const [paused, setPaused] = useState(false)
  const reduce = useMedia(MQ_REDUCE)
  const { ref, reveal } = useReveal()

  // Track is tripled so the -33.33% keyframe loops seamlessly.
  const track = [...PROFESSIONS, ...PROFESSIONS, ...PROFESSIONS]

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(24px,3vw,36px) 0',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes lcMarqueeLeft { from { transform: translateX(0); } to { transform: translateX(-33.3334%); } }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 'clamp(16px,2vw,24px)', ...reveal(0, 'translateY(16px)') }}>
        <SectionLabel center style={{ marginBottom: 0 }}>The company you keep</SectionLabel>
      </div>

      <div
        style={{ display: 'flex', overflow: 'hidden', WebkitMaskImage: MASK, maskImage: MASK, ...reveal(120, 'translateY(14px)') }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 'max-content',
            padding: '6px 0',
            animation: 'lcMarqueeLeft 60s linear infinite',
            animationPlayState: reduce || paused ? 'paused' : 'running',
          }}
        >
          {track.map((name, i) => (
            <Profession key={i} name={name} />
          ))}
        </div>
      </div>
    </section>
  )
}
