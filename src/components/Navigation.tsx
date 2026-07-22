import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  { id: 'home', number: '00', label: 'Kick-off' },
  { id: 'profile', number: '01', label: 'Profile' },
  { id: 'formation', number: '02', label: 'Formation' },
  { id: 'experience', number: '03', label: 'Work' },
  { id: 'projects', number: '04', label: 'Projects' },
  { id: 'contact', number: '90+', label: 'Contact' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 48)
      setProgress(max > 0 ? window.scrollY / max : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-32% 0px -52% 0px', threshold: [0, 0.1, 0.35, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__shell">
        <a className="nav__mark" href="#home" onClick={close} aria-label="Back to kick-off">
          <span className="nav__crest-frame"><img src="/assets/fc-barcelona.svg" alt="" /></span>
          <span className="nav__wordmark"><strong>DIVYANSHU MITTAL</strong><small>FULL-STACK / PLAYER 10</small></span>
          <span className="nav__number">10</span>
        </a>

        <nav className={open ? 'nav__links nav__links--open' : 'nav__links'} aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? 'is-active' : ''}
              aria-current={active === link.id ? 'page' : undefined}
              onClick={close}
            >
              <span>{link.number}</span>{link.label}
            </a>
          ))}
        </nav>

        <a className="nav__cta" href="#contact" onClick={close}>
          <span>Next fixture</span><ArrowUpRight />
        </a>

        <button className="nav__toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>

        <div className="nav__progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </header>
  )
}
