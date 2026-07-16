import { useState, useEffect, useRef } from 'react'
import { ACCENT, BG, STAGE, INK, FONT_SANS } from './theme.js'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import Problem from './sections/Problem.jsx'
import VisionMission from './sections/VisionMission.jsx'
import Pillars from './sections/Pillars.jsx'
import Method from './sections/Method.jsx'
import DailyHabits from './sections/DailyHabits.jsx'
import FightOnSugar from './sections/FightOnSugar.jsx'
import Stories from './sections/Stories.jsx'
import Ambassadors from './sections/Ambassadors.jsx'
import BuiltWithYou from './sections/BuiltWithYou.jsx'
import CTA from './sections/CTA.jsx'
import AppSection from './sections/AppSection.jsx'
import Footer from './sections/Footer.jsx'
import Divider from './components/Divider.jsx'
import FightOnSugarPage from './pages/FightOnSugarPage.jsx'

// A ✦ breathing point between major chapters — the recurring editorial motif.
const chapterBreak = { margin: 'clamp(8px,2vw,28px) auto', padding: '0 clamp(20px,5vw,64px)' }

// Root shell styling — CSS custom properties consumed via var(--accent) etc. in
// the sections, shared by both the landing page and the sugar detail page.
const rootStyle = {
  '--accent': ACCENT,
  '--bg': BG,
  '--stage': STAGE,
  background: BG,
  minHeight: '100vh',
  fontFamily: FONT_SANS,
  color: INK,
}

// Tiny hash router. The landing page uses `#section` anchors; a dedicated
// detail page lives at `#/fight-on-sugar`. Hash routing (rather than the
// History API) keeps this deploy-safe on any static host with zero config.
function useHashPath() {
  const read = () => (typeof window !== 'undefined' ? window.location.hash.slice(1) : '')
  const [path, setPath] = useState(read)
  useEffect(() => {
    const on = () => setPath(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return path
}

export default function App() {
  const path = useHashPath()
  const onSugarPage = path.startsWith('/fight-on-sugar')
  const wasSugarPage = useRef(onSugarPage)

  // Manage scroll across route switches: jump to the top of the detail page on
  // entry, and — when returning to the landing page — bring the target section
  // into view (the browser can't, since that section didn't exist at hash-change
  // time). Normal in-page anchor clicks are untouched.
  useEffect(() => {
    const leftPage = wasSugarPage.current && !onSugarPage
    wasSugarPage.current = onSugarPage
    if (onSugarPage) {
      window.scrollTo(0, 0)
      return
    }
    if (leftPage) {
      const id = path && !path.startsWith('/') ? path : 'top'
      requestAnimationFrame(() => {
        const el = document.getElementById(id || 'top')
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
        else window.scrollTo(0, 0)
      })
    }
  }, [onSugarPage, path])

  if (onSugarPage) {
    return (
      <div style={rootStyle}>
        <FightOnSugarPage />
      </div>
    )
  }

  return (
    <div style={rootStyle}>
      <Header />
      <main id="main">
        <Hero />
        <VisionMission />
        <Problem />
        <Divider style={chapterBreak} />
        <Pillars />
        <Method />
        <DailyHabits />
        <FightOnSugar />
        <Divider style={chapterBreak} />
        <Stories />
        <Ambassadors />
        <BuiltWithYou />
        <CTA />
        <AppSection />
      </main>
      <Footer />
    </div>
  )
}
