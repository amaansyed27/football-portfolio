import { useEffect, useState } from 'react'

type Props = { onComplete: () => void }

export function IntroSequence({ onComplete }: Props) {
  const [leaving, setLeaving] = useState(false)

  const close = () => {
    setLeaving(true)
    window.setTimeout(onComplete, 720)
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(close, reduced ? 700 : 4300)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={`intro ${leaving ? 'intro--leaving' : ''}`} aria-label="Opening sequence">
      <button className="intro__skip" onClick={close}>Skip intro</button>
      <div className="intro__lights" />
      <div className="intro__orbit intro__orbit--one" />
      <div className="intro__orbit intro__orbit--two" />
      <div className="intro__orbit intro__orbit--three" />
      <div className="intro__crest-wrap">
        <img src="/assets/fc-barcelona.svg" className="intro__crest" alt="FC Barcelona crest" />
        <span className="intro__line" />
      </div>
      <p className="intro__eyebrow">A football story in code</p>
      <p className="intro__name">DIVYANSHU<br />MITTAL</p>
    </div>
  )
}
