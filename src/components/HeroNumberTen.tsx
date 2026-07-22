import { useEffect, useRef } from 'react'

const depthLayers = Array.from({ length: 14 }, (_, index) => index)

export function HeroNumberTen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    const rig = rigRef.current
    const hero = rig?.closest('.hero')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!container || !stage || !rig || !(hero instanceof HTMLElement) || reduceMotion) return

    let pointerFrame = 0
    let scrollFrame = 0

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

      window.cancelAnimationFrame(pointerFrame)
      pointerFrame = window.requestAnimationFrame(() => setTilt(x, y))
    }

    const resetTilt = () => {
      window.cancelAnimationFrame(pointerFrame)
      pointerFrame = window.requestAnimationFrame(() => setTilt(0, 0))
    }

    const updateScrollDepth = () => {
      window.cancelAnimationFrame(scrollFrame)
      scrollFrame = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(hero.offsetHeight, window.innerHeight)))
        const width = window.innerWidth
        const baseOpacity = width <= 760 ? 0.16 : width <= 900 ? 0.28 : width <= 1100 ? 0.62 : 0.78

        stage.style.setProperty('--ten-scroll-x', `${progress * -58}px`)
        stage.style.setProperty('--ten-scroll-y', `${progress * 76}px`)
        stage.style.setProperty('--ten-scroll-rotate-x', `${progress * -7}deg`)
        stage.style.setProperty('--ten-scroll-rotate-y', `${progress * 28}deg`)
        stage.style.setProperty('--ten-scroll-scale', `${1 + progress * 0.12}`)
        container.style.opacity = `${baseOpacity * (1 - progress * 0.9)}`
      })
    }

    updateScrollDepth()
    hero.addEventListener('pointermove', handlePointerMove)
    hero.addEventListener('pointerleave', resetTilt)
    window.addEventListener('scroll', updateScrollDepth, { passive: true })
    window.addEventListener('resize', updateScrollDepth)

    return () => {
      window.cancelAnimationFrame(pointerFrame)
      window.cancelAnimationFrame(scrollFrame)
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerleave', resetTilt)
      window.removeEventListener('scroll', updateScrollDepth)
      window.removeEventListener('resize', updateScrollDepth)
    }
  }, [])

  return (
    <div className="hero-ten" ref={containerRef} aria-hidden="true">
      <span className="hero-ten__orbit hero-ten__orbit--outer" />
      <span className="hero-ten__orbit hero-ten__orbit--inner" />
      <div className="hero-ten__stage" ref={stageRef}>
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
