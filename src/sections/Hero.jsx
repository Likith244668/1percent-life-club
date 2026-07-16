import { useState, useEffect } from 'react'
import { ACCENT, INK, INK_MUTED, LABEL, FONT_DISPLAY, MQ_REDUCE, MQ_MOBILE } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import Divider from '../components/Divider.jsx'
import MediaCard from '../components/MediaCard.jsx'
import LogoMarquee from './LogoMarquee.jsx'
import { EASE, useMedia } from '../components/useReveal.js'
import { ArrowUpRight } from '../components/Icons.jsx'
import looksImg from '../assets/looks.png'

/* ------------------------------------------------------------------ hooks */

// Flips true one frame after mount so the entrance transitions can play.
function useMounted() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setReady(true)) })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [])
  return ready
}

/* --------------------------------------------------------------- shared bits */

const eyebrow = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: LABEL,
}

// One display size shared by the top headline and the media-card overlay so
// "BETTER EVERY DAY." and "INSIDE AND OUT." read at exactly the same scale.
const HEADLINE_SIZE = 'clamp(3.5rem,11.5vw,9rem)'

/* ------------------------------------------------------------------- section */

export default function Hero() {
  const reduce = useMedia(MQ_REDUCE)
  const mobile = useMedia(MQ_MOBILE)
  const ready = useMounted()

  // Entrance helper: fade + rise, shared easing, staggered by delay (ms).
  const enter = (delay, from = 'translateY(20px)', to = 'none') =>
    reduce
      ? { opacity: 1, transform: to }
      : {
          opacity: ready ? 1 : 0,
          transform: ready ? to : from,
          transition: `opacity .7s ${EASE} ${delay}ms, transform .95s ${EASE} ${delay}ms`,
          willChange: 'opacity, transform',
        }

  const solidCta = (
    <Hoverable
      as="a"
      href="#join"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '9px',
        fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT,
        padding: '16px 30px', borderRadius: '100px', textDecoration: 'none',
        boxShadow: '0 18px 40px -22px rgba(255,107,0,.9)',
        transition: 'transform .3s, background .3s, box-shadow .3s',
      }}
      hoverStyle={{ background: INK, transform: 'translateY(-2px)', boxShadow: '0 22px 46px -22px rgba(20,20,20,.5)' }}
    >
      Request an invitation
      <ArrowUpRight size={16} />
    </Hoverable>
  )

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        padding: 'clamp(100px,11vh,140px) clamp(20px,5vw,64px) clamp(56px,7vw,88px)',
        textAlign: 'center',
      }}
    >
      {/* ------------------------------------------------ top: eyebrow + H1 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ ...eyebrow, ...enter(0, 'translateY(14px)') }}>A private members&rsquo; club</p>

        <h1
          style={{
            margin: 'clamp(18px,2.4vw,26px) 0 0',
            fontFamily: FONT_DISPLAY, fontWeight: 400,
            fontSize: HEADLINE_SIZE, lineHeight: .9,
            letterSpacing: '.005em', textTransform: 'uppercase', color: INK,
            ...enter(90),
          }}
        >
          Better<br />Every&nbsp;Day.
        </h1>
      </div>

      {/* ------------------------------------------------ big media card */}
      <div style={{ maxWidth: '1340px', margin: 'clamp(12px,1.8vw,22px) auto 0', ...enter(200) }}>
        <MediaCard
          src={looksImg}
          headline={<>Inside<br />and out.</>}
          headlineSize={HEADLINE_SIZE}
          caption="We help you get one percent better — steadily, quietly — until it&rsquo;s simply who you are."
          chip="2 min"
          ratio={mobile ? '4 / 5' : '2.4 / 1'}
          radius={32}
          placeholder="Hero image / short film"
        />
      </div>

      {/* ------------------------------------------ roll-call, under the image */}
      <div style={{ marginTop: 'clamp(20px,3vw,36px)' }}>
        <LogoMarquee />
      </div>

      {/* ------------------------------------------------ sparkle + mission */}
      <Divider style={{ margin: 'clamp(56px,7vw,96px) auto clamp(30px,4vw,46px)' }} />

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <h2
          style={{
            margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 400,
            fontSize: 'clamp(1.9rem,5vw,3.6rem)', lineHeight: 1, letterSpacing: '.01em',
            textTransform: 'uppercase', color: INK,
          }}
        >
          Progress over perfection.
        </h2>
        <p style={{ margin: 'clamp(16px,2vw,22px) auto clamp(24px,3vw,32px)', maxWidth: '54ch', fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.65, color: INK_MUTED }}>
          A private circle of 250 founders, doctors and leaders, compounding one percent a
          day. Membership by application — a few seats open each quarter.
        </p>
        {solidCta}
      </div>
    </section>
  )
}
