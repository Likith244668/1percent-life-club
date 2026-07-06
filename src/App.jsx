import { ACCENT, BG, STAGE, INK } from './theme.js'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import LogoMarquee from './sections/LogoMarquee.jsx'
import Method from './sections/Method.jsx'
import Programs from './sections/Programs.jsx'
import WhyItWorks from './sections/WhyItWorks.jsx'
import DailyHabits from './sections/DailyHabits.jsx'
import Ambassadors from './sections/Ambassadors.jsx'
import Journey from './sections/Journey.jsx'
import Stories from './sections/Stories.jsx'
import Belief from './sections/Belief.jsx'
import FinalCTA from './sections/FinalCTA.jsx'
import Footer from './sections/Footer.jsx'

export default function App() {
  return (
    <div
      style={{
        // CSS custom properties consumed via var(--accent) etc. in the sections,
        // mirroring the original page's root wrapper.
        '--accent': ACCENT,
        '--bg': BG,
        '--stage': STAGE,
        background: BG,
        minHeight: '100vh',
        fontFamily: "'Archivo',sans-serif",
        color: INK,
      }}
    >
      <Header />
      <main id="main">
        <Hero />
        <LogoMarquee />
        <Method />
        <Programs />
        <WhyItWorks />
        <DailyHabits />
        <Ambassadors />
        <Journey />
        <Stories />
        <Belief />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
