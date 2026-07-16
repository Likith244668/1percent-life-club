import { useEffect, useState } from 'react'
import {
  ACCENT,
  BG,
  DARK,
  INK,
  INK_MUTED,
  MUTED,
  STAGE,
  CARD_BORDER,
  LABEL,
  FONT_DISPLAY,
  SHADOW_CARD,
  MQ_REDUCE,
} from '../theme.js'
import SectionLabel from '../components/SectionLabel.jsx'
import Hoverable from '../components/Hoverable.jsx'
import ScratchCard from '../components/ScratchCard.jsx'
import FanDeck from '../components/FanDeck.jsx'
import { useStampClip } from '../components/Stamp.jsx'
import ClaimBoard from '../components/ClaimBoard.jsx'
import Footer from '../sections/Footer.jsx'
import useReveal, { useMedia, EASE } from '../components/useReveal.js'
import { ArrowLeft, ArrowUpRight } from '../components/Icons.jsx'

// A fine film grain (SVG turbulence) tiled over the dark hero stage.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"

// The "sugar problems". Once the ticket is scratched, these stamps fly in from
// the edges and fill the stage as a dense, non-aligned collage (claims repeat,
// as on the reference microsite). Each bumps on hover and flies to centre with
// its `detail` on click. The 10 base problems below are tiled across a jittered
// grid by buildCards() — a clear centre zone is left for the revealed ticket.
const PROBLEMS = [
  { text: 'Fat-free?', detail: 'Take out the fat and the flavour goes — so the sugar moves in. Fat-free rarely means sugar-free.' },
  { text: 'All natural?', detail: 'Cane sugar is “natural” too. Nature was never the question — the dose is.' },
  { text: 'Hidden sugar', detail: 'It hides in sauces, breads and “healthy” bars under a dozen other names.' },
  { text: 'Sweet tooth', detail: 'Not a fixed trait — taste recalibrates within weeks once the peaks flatten.' },
  { text: 'The sugar high', detail: 'The spike feels like energy. It’s a loan — and the interest comes due by mid-afternoon.' },
  { text: 'Sports drink?', detail: 'Built for the last kilometres of a race — not for a 3 p.m. inbox.' },
  { text: 'Sugar-free?', detail: 'Often swapped for sweeteners that keep the sweet habit — and the craving — alive.' },
  { text: 'No added sugar?', detail: 'Sometimes true, often only technically. Read the whole panel, not the badge.' },
  { text: 'Late cravings', detail: 'A day of spikes ends in a night of hunting for more. Steady days sleep better.' },
  { text: '3 pm crash', detail: 'The bill for the morning’s spike — focus, mood and training all quietly withdrawn.' },
]

// A curated ring of positions around the centre ticket — never over it. Ordered
// so any prefix stays balanced: the first 9 (mobile) already cover all four
// edges, +3 (tablet) and +3 (desktop) just fill it in. `from` is the edge each
// card flies in from, so the entrance comes from top, bottom, left AND right.
const POSITIONS = [
  { top: '9%', left: '5%', from: 'top' },
  { top: '9%', right: '5%', from: 'top' },
  { top: '41%', left: '3%', from: 'left' },
  { top: '40%', right: '3%', from: 'right' },
  { bottom: '8%', left: '9%', from: 'bottom' },
  { bottom: '8%', right: '8%', from: 'bottom' },
  { top: '6%', left: '33%', from: 'top' },
  { bottom: '7%', left: '40%', from: 'bottom' },
  { top: '61%', right: '4%', from: 'right' },
  // tablet (+3)
  { top: '62%', left: '5%', from: 'left' },
  { top: '21%', left: '21%', from: 'left' },
  { top: '21%', right: '19%', from: 'right' },
  // desktop (+3)
  { top: '6%', left: '61%', from: 'top' },
  { bottom: '25%', left: '61%', from: 'bottom' },
  { bottom: '7%', right: '23%', from: 'bottom' },
]

// Attach the sugar problems (tiled) to the positions — one uniform-size stamp
// per slot. Sizes/counts are applied responsively in ClaimBoard.
const CARDS = POSITIONS.map((p, i) => ({
  id: `c${i}`,
  text: PROBLEMS[i % PROBLEMS.length].text,
  detail: PROBLEMS[i % PROBLEMS.length].detail,
  tone: (i * 3) % 5 < 3 ? 'orange' : 'cream',
  rot: ((i * 37) % 10) - 5,
  top: p.top,
  left: p.left,
  right: p.right,
  bottom: p.bottom,
  from: p.from,
}))

/* The detail page reached from the "Fight on sugar" section — a small
   microsite in the same voice as the landing page, built around two hands-on
   interactions: scratch a marketing claim off a label, and swipe through the
   club's sugar defaults. Kept honest: reframes and stances, no invented stats.
   Reached at hash route #/fight-on-sugar (see App.jsx). */

// Each claim is a shiny marketing word painted on the scratch coating; the
// club's plain read sits underneath, revealed as you scratch it away.
const LABELS = [
  { claim: 'Fat-Free', read: 'Take the fat out and the flavour goes — so the sugar moves in. Fat-free rarely means sugar-free.' },
  { claim: 'All Natural', read: 'Cane sugar is “natural” too. Nature was never the question. The dose is.' },
  { claim: 'Sports Drink', read: 'Built for the last kilometres of a race — not for a 3 p.m. inbox.' },
  { claim: 'No Added Sugar', read: 'Sometimes true, often only technically. Read the whole panel, not the badge.' },
]

// The fanned deck — the club's everyday defaults on sugar.
const DEFAULTS = [
  { id: 'd1', tag: 'Habit', title: 'Flatten the peak', line: 'No banned list. We simply clip the spikes that wreck an afternoon.' },
  { id: 'd2', tag: 'Fuel', title: 'Protein leads', line: 'Whole food and protein first. Sugar stops setting the schedule.' },
  { id: 'd3', tag: 'Label', title: 'Read the jar', line: 'What’s inside decides — the front of the box is only advertising.' },
  { id: 'd4', tag: 'Order', title: 'Veg before the rest', line: 'Fibre first slows down everything that follows it.' },
  { id: 'd5', tag: 'Swap', title: 'Change the drink', line: 'Most hidden sugar is liquid. Water and unsweetened win the day.' },
  { id: 'd6', tag: 'Movement', title: 'Walk it off', line: 'A short walk after a meal quietly blunts the spike.' },
  { id: 'd7', tag: 'Timing', title: 'Name the 3 p.m.', line: 'Expect the dip, then design the afternoon so it never arrives.' },
  { id: 'd8', tag: 'Sleep', title: 'Rest the craving', line: 'A short night hunts for sugar by noon. Guard the sleep first.' },
]

// The mechanism — how a sugar high quietly costs a day. Behavioural, not statistical.
const MECHANISM = [
  { step: '01', label: 'Spike', line: 'A fast sugar high overshoots what the body actually asked for.' },
  { step: '02', label: 'Crash', line: 'By mid-afternoon it craters — below where the day began.' },
  { step: '03', label: 'Steal', line: 'And it takes the focus, the training and the evening with it.' },
]

/* ------------------------------------------------------------- small chrome */

function MiniHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,.8)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        borderBottom: `1px solid ${CARD_BORDER}`,
      }}
    >
      <div
        style={{
          maxWidth: '1340px',
          margin: '0 auto',
          padding: '14px clamp(16px,4vw,40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <Hoverable
          as="a"
          href="#top"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            fontSize: '14px',
            fontWeight: 600,
            color: INK,
            textDecoration: 'none',
            padding: '8px 14px 8px 10px',
            borderRadius: '100px',
            border: `1px solid ${CARD_BORDER}`,
            transition: 'transform .25s, background .25s',
          }}
          hoverStyle={{ background: STAGE, transform: 'translateX(-2px)' }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Hoverable>

        <a href="#top" aria-label="1% Life Club — home" style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', textDecoration: 'none', color: INK }}>
          <span style={{ fontWeight: 900, fontSize: '19px', letterSpacing: '-.03em' }}>1%</span>
          <span style={{ fontWeight: 600, fontSize: '11px', letterSpacing: '.16em' }}>LIFE&nbsp;CLUB</span>
        </a>

        <Hoverable
          as="a"
          href="#join"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: INK,
            padding: '10px 18px',
            borderRadius: '100px',
            textDecoration: 'none',
            transition: 'transform .25s, background .25s',
          }}
          hoverStyle={{ background: ACCENT, transform: 'translateY(-1px)' }}
        >
          Request an invitation
        </Hoverable>
      </div>
    </header>
  )
}

/* --------------------------------------------------------------- hero stage */

// The reference microsite's hero: a dark, grainy, grid-lined stage with a giant
// ghost word behind, tilted "claim" stamps scattered around, and a perforated
// scratch-ticket at the centre — scratch it to reveal the headline.
function SugarHero() {
  const reduce = useMedia(MQ_REDUCE)
  const narrow = useMedia('(max-width: 720px)')
  const { ref, reveal } = useReveal()
  const ticket = useStampClip({ tooth: 15, depth: 7 })
  const ticketSize = narrow ? 'min(240px, 66vw)' : 'min(300px, 80vw)'

  // The stamps stay off-stage until the ticket is scratched, then fly in from
  // the left/right edges. Under reduced motion they're simply present.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (reduce) setRevealed(true)
  }, [reduce])

  return (
    <section
      style={{
        position: 'relative',
        background: DARK,
        color: '#fff',
        overflow: 'hidden',
        minHeight: 'min(92vh, 880px)',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(96px,13vh,150px) clamp(20px,5vw,64px) clamp(64px,9vh,110px)',
      }}
    >
      {/* faint grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(255,255,255,.05) 0 1px, transparent 1px 128px), repeating-linear-gradient(to bottom, rgba(255,255,255,.035) 0 1px, transparent 1px 128px)',
          backgroundPosition: 'center',
        }}
      />
      {/* film grain */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: NOISE, opacity: 0.22, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

      {/* giant ghost word */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(7rem,24vw,22rem)', lineHeight: 1, color: 'rgba(255,255,255,0.05)', whiteSpace: 'nowrap', letterSpacing: '.03em', textTransform: 'uppercase', userSelect: 'none' }}>
          Sugar&nbsp;&nbsp;Sugar&nbsp;&nbsp;Sugar
        </span>
      </div>

      {/* the interactive claim board — collage, hover-bump, click-to-centre */}
      <ClaimBoard cards={CARDS} revealed={revealed} />

      {/* vignette so the ticket reads clean over the collage */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(42% 46% at 50% 54%, rgba(14,14,14,.94), rgba(14,14,14,0) 72%)', pointerEvents: 'none' }} />

      {/* centre column — the ticket punches through above the collage (z6) */}
      <div ref={ref} style={{ position: 'relative', zIndex: 8, width: '100%', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        {/* eyebrow — steps aside once the board takes over */}
        <div
          style={{
            opacity: revealed ? 0 : 1,
            transform: revealed ? 'translateY(-8px)' : 'none',
            transition: reduce ? 'none' : `opacity .4s ${EASE}, transform .4s ${EASE}`,
            pointerEvents: revealed ? 'none' : 'auto',
          }}
        >
          <div style={{ display: 'inline-block', ...reveal(0) }}>
            <SectionLabel center color="rgba(255,255,255,.72)">
              The fight on sugar · Field guide
            </SectionLabel>
          </div>
        </div>

        {/* the scratch ticket */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(16px,2.6vw,26px)', ...reveal(120, 'translateY(28px)') }}>
          <div
            ref={ticket.ref}
            style={{
              width: ticketSize,
              height: ticketSize,
              clipPath: ticket.clipPath,
              WebkitClipPath: ticket.clipPath,
              filter: 'drop-shadow(0 34px 46px rgba(0,0,0,.55))',
            }}
          >
            <ScratchCard
              coatingTitle="1%"
              prompt="Scratch to reveal"
              promptSize={13}
              coatingFrom="#FF7A1A"
              coatingTo="#E85E00"
              threshold={0.45}
              radius={0}
              height="100%"
              onReveal={() => setRevealed(true)}
            >
              <div style={{ height: '100%', width: '100%', background: '#F1EDE6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '26px 24px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: ACCENT }}>You found it</span>
                <h1 style={{ margin: '12px 0 0', fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 'clamp(1.5rem,6vw,2rem)', lineHeight: 0.98, letterSpacing: '.01em', textTransform: 'uppercase', color: INK }}>
                  Sugar runs your afternoon
                </h1>
                <span style={{ marginTop: '14px', fontSize: '11px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED }}>Keep scrolling ↓</span>
              </div>
            </ScratchCard>
          </div>
        </div>

        <div
          style={{
            opacity: revealed ? 0 : 1,
            transform: revealed ? 'translateY(8px)' : 'none',
            transition: reduce ? 'none' : `opacity .4s ${EASE}, transform .4s ${EASE}`,
            pointerEvents: revealed ? 'none' : 'auto',
          }}
        >
          <p style={{ margin: 'clamp(26px,3.4vw,36px) auto 0', maxWidth: '38ch', fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.6, color: 'rgba(255,255,255,.66)', ...reveal(230) }}>
            It spikes, then it steals. Scratch the ticket — then swipe the defaults below.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------- page */

export default function FightOnSugarPage() {
  const scratch = useReveal()
  const mech = useReveal()
  const swipe = useReveal()
  const cta = useReveal()

  return (
    <>
      <style>{`
        .lc-scratch:focus-visible, .lc-deck:focus-visible, .lc-deck-btn:focus-visible {
          outline: 2px solid ${ACCENT}; outline-offset: 3px;
        }
        .lc-deck-btn:hover { background: ${INK}; color: #fff; transform: translateY(-2px); }
        .lc-fan-btn:hover { background: rgba(255,255,255,.14); transform: translateY(-2px); }
        .lc-fan-btn:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }
        .lc-scratch:active { cursor: grabbing; }
      `}</style>

      <MiniHeader />

      <main id="top" style={{ background: BG }}>
        <SugarHero />

        {/* ------------------------------------------------- scratch labels */}
        <section style={{ padding: 'clamp(30px,4vw,60px) clamp(20px,5vw,64px)' }}>
          <div ref={scratch.ref} style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ maxWidth: '640px', ...scratch.reveal(0) }}>
              <SectionLabel>The front of the box is marketing</SectionLabel>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.7rem,3.6vw,2.7rem)', lineHeight: 1.06, letterSpacing: '-.03em' }}>
                Scratch the claim off. Read what’s underneath.
              </h2>
              <p style={{ margin: 'clamp(14px,2vw,18px) 0 0', maxWidth: '46ch', fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.65, color: MUTED }}>
                Four claims you’ve seen a thousand times. Drag across each one to peel the label — the
                club’s plain read is waiting behind it.
              </p>
            </div>

            <div
              style={{
                marginTop: 'clamp(28px,3.4vw,44px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(250px,100%),1fr))',
                gap: 'clamp(16px,1.8vw,22px)',
                ...scratch.reveal(140, 'translateY(24px)'),
              }}
            >
              {LABELS.map((l) => (
                <ScratchCard key={l.claim} coatingTitle={l.claim} height={210}>
                  {/* Revealed underneath the coating */}
                  <div
                    style={{
                      height: '100%',
                      background: STAGE,
                      border: `1px solid ${CARD_BORDER}`,
                      borderRadius: 22,
                      padding: 'clamp(20px,2.4vw,26px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: ACCENT }}>
                      “{l.claim}”
                    </span>
                    <p style={{ margin: 0, fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.5, fontWeight: 600, color: INK, letterSpacing: '-.01em' }}>
                      {l.read}
                    </p>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED }}>
                      The label, honestly
                    </span>
                  </div>
                </ScratchCard>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- mechanism (3 steps) */}
        <section style={{ padding: 'clamp(30px,4vw,56px) clamp(20px,5vw,64px)' }}>
          <div ref={mech.ref} style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', ...mech.reveal(0) }}>
              <SectionLabel center>What actually happens</SectionLabel>
              <h2 style={{ margin: '0 auto', maxWidth: '18ch', fontWeight: 800, fontSize: 'clamp(1.7rem,3.6vw,2.7rem)', lineHeight: 1.06, letterSpacing: '-.03em' }}>
                Same breakfast. Three quiet moves later, the day is gone.
              </h2>
            </div>
            <div
              style={{
                marginTop: 'clamp(28px,3.4vw,44px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))',
                gap: 'clamp(16px,2vw,24px)',
              }}
            >
              {MECHANISM.map((m, i) => (
                <div
                  key={m.step}
                  style={{
                    background: '#fff',
                    border: `1px solid ${CARD_BORDER}`,
                    borderRadius: 22,
                    padding: 'clamp(24px,3vw,34px)',
                    boxShadow: SHADOW_CARD,
                    ...mech.reveal(120 + i * 110, 'translateY(22px)'),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2.4rem,4vw,3.2rem)', color: ACCENT, lineHeight: 1 }}>{m.step}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: INK }}>{m.label}</span>
                  </div>
                  <p style={{ margin: 'clamp(16px,2vw,22px) 0 0', fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.6, color: INK_MUTED }}>{m.line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- swipe defaults */}
        <section style={{ padding: 'clamp(10px,1.3vw,18px)' }}>
          <div
            ref={swipe.ref}
            style={{
              position: 'relative',
              background: DARK,
              color: '#fff',
              borderRadius: 'clamp(22px,2.4vw,36px)',
              padding: 'clamp(44px,6vw,96px) clamp(24px,5vw,64px)',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(900px,94%)',
                height: '520px',
                background: `radial-gradient(56% 60% at 50% 40%, color-mix(in srgb, ${ACCENT} 18%, transparent), transparent 70%)`,
                pointerEvents: 'none',
                opacity: 0.6,
              }}
            />
            <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', ...swipe.reveal(0) }}>
                <SectionLabel center color="rgba(255,255,255,.72)">
                  Your new defaults
                </SectionLabel>
              </div>
              <h2 style={{ margin: '0 auto', maxWidth: '16ch', fontWeight: 800, fontSize: 'clamp(1.9rem,4.4vw,3.1rem)', lineHeight: 1.04, letterSpacing: '-.03em', ...swipe.reveal(90, 'translateY(24px)') }}>
                Swipe through the moves that put you back in charge.
              </h2>
              <p style={{ margin: '18px auto 0', maxWidth: '44ch', fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.65, color: 'rgba(255,255,255,.66)', ...swipe.reveal(180) }}>
                Five defaults, one card at a time. Nothing forbidden — just a calmer curve.
              </p>

              <div style={{ marginTop: 'clamp(30px,4vw,46px)', ...swipe.reveal(260, 'translateY(26px)') }}>
                <FanDeck cards={DEFAULTS} />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ cta */}
        <section style={{ padding: 'clamp(44px,6vw,86px) clamp(20px,5vw,64px)' }}>
          <div ref={cta.ref} style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 'clamp(2.2rem,6vw,3.6rem)', lineHeight: 0.98, textTransform: 'uppercase', letterSpacing: '.01em', ...cta.reveal(0, 'translateY(24px)') }}>
              Stop letting sugar
              <br />
              run your day.
            </h2>
            <p style={{ margin: '22px auto 0', maxWidth: '46ch', fontSize: 'clamp(16px,1.4vw,18px)', lineHeight: 1.6, color: INK_MUTED, ...cta.reveal(120) }}>
              The discipline is small and repeatable — the kind of one percent members compound every
              day. A few seats open each quarter.
            </p>
            <div style={{ marginTop: 'clamp(28px,3.4vw,40px)', display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center', ...cta.reveal(220) }}>
              <Hoverable
                as="a"
                href="#join"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '15px', fontWeight: 600, color: '#fff', background: ACCENT, padding: '17px 34px', borderRadius: '100px', textDecoration: 'none', transition: 'transform .3s,background .3s,color .3s' }}
                hoverStyle={{ background: INK, transform: 'translateY(-2px)' }}
              >
                Request an invitation
                <ArrowUpRight size={16} />
              </Hoverable>
              <Hoverable
                as="a"
                href="#top"
                style={{ display: 'inline-flex', alignItems: 'center', fontSize: '15px', fontWeight: 600, color: INK, background: 'transparent', padding: '17px 30px', borderRadius: '100px', textDecoration: 'none', border: `1px solid ${CARD_BORDER}`, transition: 'transform .3s,border-color .3s,background .3s' }}
                hoverStyle={{ borderColor: INK, background: STAGE, transform: 'translateY(-2px)' }}
              >
                Back to the club
              </Hoverable>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
