import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a className="nav__mark" href="#home" onClick={close} aria-label="Home">
        <img src="/assets/fc-barcelona.svg" alt="" /><span>DM<span className="gold">.</span></span>
      </a>
      <nav className={open ? 'nav__links nav__links--open' : 'nav__links'} aria-label="Primary navigation">
        <a href="#profile" onClick={close}>Profile</a>
        <a href="#formation" onClick={close}>Formation</a>
        <a href="#projects" onClick={close}>Projects</a>
        <a href="#contact" onClick={close}>Contact</a>
      </nav>
      <span className="nav__status"><i /> Available for the next fixture</span>
      <button className="nav__toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}
