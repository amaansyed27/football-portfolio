import { useEffect, useRef } from 'react'

const depthLayers = Array.from({ length: 14 }, (_, index) => index)

export function HeroNumberTen() {
  const rigRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rig = rigRef.current
    const hero = rig?.closest('.hero')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!rig || !(hero instanceof HTMLElement) || reduceMotion) return

    let frame = 0

    const setTilt = (x: number, y: number) => {
      rig.style.setProperty('--ten-rotate-x', `${y * -7}deg`)
      rig.style.setProperty('--ten-rotate-y', `${x * 11}deg`)
      rig.style.setProperty('--ten-shift-x', `${x * 12}px`)
      rig.style.setProperty('--ten-shift-y', `${y * 9}px`)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2))
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2))

      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setTilt(x, y))
    }

    const resetTilt = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setTilt(0, 0))
    }

    hero.addEventListener('pointermove', handlePointerMove)
    hero.addEventListener('pointerleave', resetTilt)

    return () => {
      window.cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerleave', resetTilt)
    }
  }, [])

  return (
    <div className="hero-ten" aria-hidden="true">
      <span className="hero-ten__orbit hero-ten__orbit--outer" />
      <span className="hero-ten__orbit hero-ten__orbit--inner" />
      <div className="hero-ten__stage">
        <div className="hero-ten__rig" ref={rigRef}>
          <div className="hero-ten__stack">
            {depthLayers.map((layer) => (
              <span
                className="hero-ten__depth"
                key={layer}
                style={{
                  transform: `translate(-50%, -50%) translate3d(${-layer * 2.25}px, ${layer * 2.7}px, ${-layer * 4.5}px)`,
                }}
              >
                10
              </span>
            ))}
            <span className="hero-ten__edge">10</span>
            <span className="hero-ten__face">10</span>
            <span className="hero-ten__glint">10</span>
          </div>
          <div className="hero-ten__plate">
            <span>PLAYER NUMBER</span>
            <i />
            <strong>10</strong>
            <small>CREATIVE SYSTEMS</small>
          </div>
        </div>
      </div>
    </div>
  )
}
