import { useCallback, useEffect, useRef, useState } from 'react'
import { useMedia } from './useReveal.js'
import { MQ_REDUCE } from '../theme.js'

/**
 * A canvas scratch-to-reveal card — the "peel the marketing off the label"
 * interaction borrowed from playful product microsites, rebuilt from scratch
 * (no library) to fit this project's inline-styled system.
 *
 * `children` render underneath an opaque painted coating. Dragging a pointer
 * across the surface erases the coating with a destination-out brush; once
 * ~`threshold` of it is gone the remainder dissolves and the card is revealed.
 *
 * The coating shows `coatingTitle` (the shiny marketing claim) big, with a
 * small "scratch to read the label" prompt beneath it.
 *
 * Accessibility / motion:
 *   - Under prefers-reduced-motion the coating is skipped entirely and the
 *     content shows immediately — the scratch is a delight, never a gate.
 *   - The card is focusable; Enter/Space reveals it without a pointer.
 */
export default function ScratchCard({
  children,
  coatingTitle = 'Scratch',
  prompt = 'SCRATCH TO READ THE LABEL',
  promptSize = 11,
  coatingFrom = '#1C1C1C',
  coatingTo = '#333333',
  threshold = 0.5,
  brush = 24,
  radius = 22,
  height = 210,
  className = 'lc-scratch',
  onReveal,
}) {
  const reduce = useMedia(MQ_REDUCE)
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const moves = useRef(0)
  const done = useRef(false)
  const [revealed, setRevealed] = useState(false)

  // Paint the opaque coating: base gradient + a diagonal sheen + the claim text.
  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const w = wrap.clientWidth
    const h = wrap.clientHeight
    if (!w || !h) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = 'source-over'

    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, coatingFrom)
    g.addColorStop(1, coatingTo)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // A soft diagonal foil sheen so the coating reads as a scratchable panel.
    const sh = ctx.createLinearGradient(0, 0, w, h)
    sh.addColorStop(0.0, 'rgba(255,255,255,0)')
    sh.addColorStop(0.46, 'rgba(255,255,255,0.04)')
    sh.addColorStop(0.5, 'rgba(255,255,255,0.13)')
    sh.addColorStop(0.54, 'rgba(255,255,255,0.04)')
    sh.addColorStop(1.0, 'rgba(255,255,255,0)')
    ctx.fillStyle = sh
    ctx.fillRect(0, 0, w, h)

    // The claim, big and centred — shrunk to fit the card width so long claims
    // ("NO ADDED SUGAR") never clip against the edges. Optional: an empty
    // coatingTitle centres the prompt on its own (used by the hero ticket).
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const claim = coatingTitle ? coatingTitle.toUpperCase() : ''
    let titleSize = 0
    if (claim) {
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1px'
      const pad = 24
      titleSize = Math.max(18, Math.min(34, Math.round(w / 9)))
      ctx.font = `800 ${titleSize}px 'Archivo', system-ui, sans-serif`
      while (titleSize > 12 && ctx.measureText(claim).width > w - pad * 2) {
        titleSize -= 1
        ctx.font = `800 ${titleSize}px 'Archivo', system-ui, sans-serif`
      }
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fillText(claim, w / 2, h / 2 - 8)
    }
    // The prompt.
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px'
    ctx.fillStyle = 'rgba(255,255,255,0.62)'
    ctx.font = `700 ${promptSize}px 'Archivo', system-ui, sans-serif`
    ctx.fillText(prompt.toUpperCase(), w / 2, claim ? h / 2 + titleSize / 2 + 10 : h / 2)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  }, [coatingTitle, prompt, promptSize, coatingFrom, coatingTo])

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    if (onReveal) onReveal()
    const canvas = canvasRef.current
    if (!canvas) return setRevealed(true)
    canvas.style.transition = 'opacity .45s ease'
    canvas.style.opacity = '0'
    window.setTimeout(() => setRevealed(true), 430)
  }, [onReveal])

  // Erase along the stroke with a round destination-out brush.
  const eraseTo = (x, y) => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = brush * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const p = last.current || { x, y }
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, brush, 0, Math.PI * 2)
    ctx.fill()
    last.current = { x, y }
  }

  // Fraction of the coating erased (sampled coarsely — every 16th pixel).
  const sample = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    let data
    try {
      data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
    } catch {
      return
    }
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++
      if (data[i] === 0) clear++
    }
    if (total && clear / total >= threshold) finish()
  }

  const pointFor = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onDown = (e) => {
    if (revealed || reduce) return
    drawing.current = true
    last.current = null
    const p = pointFor(e)
    eraseTo(p.x, p.y)
    try {
      canvasRef.current.setPointerCapture(e.pointerId)
    } catch {}
  }
  const onMove = (e) => {
    if (!drawing.current) return
    const p = pointFor(e)
    eraseTo(p.x, p.y)
    if (moves.current++ % 8 === 0) sample()
  }
  const onUp = () => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    sample()
  }

  // Paint on mount and whenever the card is resized (until it's revealed).
  useEffect(() => {
    if (reduce) return
    paint()
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (!revealed && !drawing.current) paint()
      })
      if (wrapRef.current) ro.observe(wrapRef.current)
    }
    // Repaint once webfonts land so the claim renders in Archivo, not fallback.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!revealed && !drawing.current) paint()
      })
    }
    return () => ro && ro.disconnect()
  }, [reduce, paint, revealed])

  return (
    <div
      ref={wrapRef}
      className={className}
      role="group"
      aria-label={`${coatingTitle} — scratch to reveal`}
      tabIndex={reduce || revealed ? -1 : 0}
      onKeyDown={(e) => {
        if (!reduce && !revealed && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          finish()
        }
      }}
      style={{
        position: 'relative',
        height,
        borderRadius: radius,
        overflow: 'hidden',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* The reveal, sitting underneath the coating. */}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>

      {/* The scratchable coating. Absent entirely under reduced motion. */}
      {!reduce && (
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            touchAction: 'none',
            cursor: revealed ? 'default' : 'grab',
            pointerEvents: revealed ? 'none' : 'auto',
          }}
        />
      )}
    </div>
  )
}
