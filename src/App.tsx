import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Code2, Database, MapPin } from 'lucide-react'
import { HeroNumberTen } from './components/HeroNumberTen'
import { IntroSequence } from './components/IntroSequence'
import { Navigation } from './components/Navigation'
import { SectionLabel } from './components/SectionLabel'
import { FootballScene } from './scene/FootballScene'
import { profile } from './data/profile'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { usePortfolioMotion } from './hooks/usePortfolioMotion'

function App() {
  const [introDone, setIntroDone] = useState(false)
  useSmoothScroll(introDone)
  usePortfolioMotion(introDone)

  useEffect(() => {
    document.body.classList.toggle('intro-active', !introDone)
    return () => document.body.classList.remove('intro-active')
  }, [introDone])

  return (
    <>
      {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}
      <Navigation />
      <FootballScene />
      <div className="noise" />

      <main>
        <section className="hero" id="home">
          <div className="hero__stadium" />
          <HeroNumberTen />
          <div className="hero__content">
            <p className="hero__kicker"><span>10</span> Full-stack developer · Delhi, India</p>
            <h1><span>DIVYANSHU</span><strong>MITTAL</strong></h1>
            <p className="hero__role">Engineering from the first touch<br />to the final whistle.</p>
            <div className="hero__actions">
              <a className="button button--gold" href="#projects">View the highlights <ArrowDown /></a>
              <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
            </div>
          </div>
          <div className="hero__score">
            <span>SEASON 23—27</span><i /><span>VIT BHOPAL</span>
          </div>
          <p className="hero__scroll">Scroll to dribble <span /></p>
        </section>

        <section className="profile section" id="profile">
          <div className="section__inner grid-two">
            <div>
              <SectionLabel number="01">Player profile</SectionLabel>
              <h2>FULL-STACK.<br /><em>FULL PITCH.</em></h2>
            </div>
            <div className="profile__copy">
              <p>{profile.summary}</p>
              <div className="profile__facts">
                <div><small>POSITION</small><strong>{profile.role}</strong></div>
                <div><small>CURRENT CLUB</small><strong>{profile.club}</strong></div>
                <div><small>ACADEMY</small><strong>{profile.academy}</strong></div>
                <div><small>BASE</small><strong><MapPin /> {profile.location}</strong></div>
              </div>
            </div>
          </div>
          <div className="marquee" aria-hidden="true"><span>REACT · NEXT.JS · NODE.JS · TYPESCRIPT · POSTGRESQL · MONGODB · EXPRESS.JS · REST APIs ·&nbsp;</span></div>
        </section>

        <section className="formation section" id="formation">
          <div className="section__inner">
            <SectionLabel number="02">Technical formation</SectionLabel>
            <div className="formation__header">
              <h2>THE STARTING<br /><em>SEVEN.</em></h2>
              <p>A balanced system: creative on the interface, disciplined through the backend, composed under pressure.</p>
            </div>
            <div className="pitch">
              <div className="pitch__line pitch__line--mid" />
              <div className="pitch__circle" />
              <div className="pitch__box pitch__box--top" />
              <div className="pitch__box pitch__box--bottom" />
              {profile.skills.map((skill, index) => (
                <div className="player" key={skill.name} style={{ left: `${skill.x}%`, top: `${skill.y}%` }}>
                  <span>{index + 1}</span><strong>{skill.name}</strong><small>{skill.line}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="experience section" id="experience">
          <div className="trophy-caption trophy-caption--ucl">Champions League night</div>
          <div className="section__inner grid-two">
            <div>
              <SectionLabel number="03">Match experience</SectionLabel>
              <h2>BUILT IN<br /><em>THE REAL GAME.</em></h2>
            </div>
            <article className="experience__card">
              <div className="experience__season">CURRENT<br /><strong>XI</strong></div>
              <div>
                <span className="tag">Full-time attack</span>
                <h3>Full Stack Developer Intern</h3>
                <p className="experience__company">Eqaim Technology &amp; Services</p>
                <p>Building and refining production-facing features across modern frontend and backend stacks, with a focus on maintainable systems and useful product outcomes.</p>
                <ul><li><Code2 /> End-to-end feature delivery</li><li><Database /> Scalable API and data foundations</li></ul>
              </div>
            </article>
          </div>
        </section>

        <section className="projects section" id="projects">
          <div className="trophy-caption trophy-caption--world">World-class build standard</div>
          <div className="section__inner">
            <SectionLabel number="04">Selected highlights</SectionLabel>
            <div className="projects__heading">
              <h2>THE TROPHY<br /><em>CABINET.</em></h2>
              <p>Three builds. Three different problems. One standard: make every layer earn its place.</p>
            </div>
            <div className="project-list">
              {profile.projects.map((project) => (
                <article className="project" key={project.number}>
                  <span className="project__number">{project.number}</span>
                  <div className="project__body">
                    <small>{project.type}</small><h3>{project.title}</h3><p>{project.text}</p>
                    <div>{project.stack.map(item => <span key={item}>{item}</span>)}</div>
                  </div>
                  <ArrowUpRight className="project__arrow" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="academy section" id="academy">
          <div className="section__inner academy__layout">
            <div>
              <SectionLabel number="05">Academy years</SectionLabel>
              <h2>LEARNING<br /><em>THE SYSTEM.</em></h2>
            </div>
            <div className="academy__timeline">
              <article><span>2023</span><i /><div><small>KICK-OFF</small><h3>B.Tech · Computer Science</h3><p>VIT Bhopal University</p></div></article>
              <article><span>2026</span><i /><div><small>PROFESSIONAL DEBUT</small><h3>Full Stack Developer Intern</h3><p>Eqaim Technology &amp; Services</p></div></article>
              <article><span>2027</span><i /><div><small>NEXT FIXTURE</small><h3>Graduation</h3><p>May 2027 · Ready for what follows</p></div></article>
            </div>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="finale__wash" aria-hidden="true" />
          <div className="finale__sticky">
            <div className="finale__top">
              <div>
                <SectionLabel number="90+">Final attack</SectionLabel>
                <p className="finale__eyebrow">ONE LAST MOVE</p>
                <h2 className="finale__headline">PLAY IT<br /><em>FORWARD.</em></h2>
              </div>
              <p className="finale__lede">
                The ball waits on the left. One final scroll sends it across the pitch and into the far corner.
              </p>
            </div>

            <div className="finale__play" aria-hidden="true">
              <div className="finale__pitch">
                <span className="finale__halfway" />
                <span className="finale__centre-circle" />
                <span className="finale__runway" />
              </div>
              <div className="finale__launch">
                <span>FINAL TOUCH</span>
                <strong>Scroll to strike</strong>
                <i />
              </div>
              <div className="finale__goal">
                <span className="finale__goal-frame" />
                <span className="finale__goal-depth" />
                <small>FAR CORNER</small>
              </div>
              <div className="finale__impact">
                <span /><span /><span />
              </div>
              <div className="finale__goal-word">
                <span>90+4&apos;</span>
                <strong>GOAL</strong>
              </div>
            </div>

            <div className="finale__cta-row">
              <div>
                <span>FULL-TIME IS ONLY THE START</span>
                <p>Open to building ambitious products, useful systems and the next memorable release.</p>
              </div>
              <a className="button button--gold finale__cta" href={profile.linkedin} target="_blank" rel="noreferrer">
                Start a conversation <ArrowUpRight />
              </a>
            </div>

            <footer className="finale__footer">
              <div className="finale__identity">
                <img src="/assets/fc-barcelona.svg" alt="" />
                <div><strong>DIVYANSHU MITTAL</strong><small>FULL-STACK DEVELOPER · DELHI, INDIA</small></div>
              </div>
              <p>React · Next.js · Node.js · TypeScript</p>
              <a href="#home">Back to kick-off ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
