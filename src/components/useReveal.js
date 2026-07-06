import { useEffect, useRef, useState } from 'react'

// The site's signature easing — the same curve the Hero entrance and the
// WhyItWorks chart already use, so every scroll reveal feels like one system.
export const EASE = 'cubic-bezier(.16,1,.3,1)'

// True once the element has scrolled into view (then stays true). If the
// observer API is missing the content shows immediately — the reveal is an
// enhancement, not a gate. Used by sections that drive their own choreography
// (chart draw, habit bars) off a single in-view signal.
export function useInView(ref, threshold = 0.3) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect() } },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return inView
}

// Reactive CSS media query (mirrors the helper in Header.jsx / Hero.jsx).
export function useMedia(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on)
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on))
  }, [query])
  return matches
}

/**
 * Scroll-reveal driver: one IntersectionObserver per section.
 *
 * Attach `ref` to the section's content wrapper, then spread `reveal(delay)`
 * into the inline style of each element that should animate in. Siblings
 * cascade via the delay (ms). The reveal fires once — just before the element
 * reaches its natural reading position (rootMargin trims 10% off the viewport
 * bottom) — and never replays, which keeps scrolling calm rather than busy.
 *
 *   const { ref, reveal } = useReveal()
 *   <div ref={ref}>
 *     <h2 style={{ ...headingStyle, ...reveal(0) }}>…</h2>
 *     <p  style={{ ...bodyStyle,    ...reveal(120) }}>…</p>
 *   </div>
 *
 * Under prefers-reduced-motion `reveal()` returns {} so everything renders
 * static and instantly visible. If IntersectionObserver is unavailable the
 * content shows immediately — the reveal is an enhancement, never a gate.
 *
 * NOTE: don't spread `reveal()` onto elements that already transition their
 * own `transform` (e.g. Hoverable CTAs) — the `transition` keys collide.
 * Wrap those in a plain div and reveal the wrapper instead.
 */
export default function useReveal({ threshold = 0, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const reduce = useMedia('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])

  // Style factory: fade + rise from `from` to `to` with a stagger `delay`.
  const reveal = (delay = 0, from = 'translateY(26px)', to = 'none') =>
    reduce
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? to : from,
          transition: `opacity .75s ${EASE} ${delay}ms, transform .95s ${EASE} ${delay}ms`,
          willChange: 'opacity, transform',
        }

  return { ref, shown, reduce, reveal }
}
