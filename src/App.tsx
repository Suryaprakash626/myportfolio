import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Code2, Github, Linkedin, Mail, Menu, MoveUpRight, X } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeExperience from './components/ThreeExperience'
import ProjectCard from './components/ProjectCard'
import { capabilities, profile, projects } from './data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const experimentModes = [
  { id: 'geometry' as const, name: '01 / PROCEDURAL GEOMETRY', title: 'Shape is a language.', text: 'Generate complex forms from mathematical rules, then bring them to life with light, material and motion.' },
  { id: 'shader' as const, name: '02 / GLSL SHADERS', title: 'Pixels with purpose.', text: 'Vertex displacement, Fresnel response and time-based colour fields turn a surface into a living material.' },
  { id: 'particles' as const, name: '03 / PARTICLE SYSTEMS', title: 'Order inside chaos.', text: 'A field of points becomes an instrument for atmosphere, scale and interaction.' },
]

function App() {
  const [activeExperiment, setActiveExperiment] = useState<(typeof experimentModes)[number]['id']>('geometry')
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker, .hero-title-line, .hero-description, .hero-actions', {
        y: 28, opacity: 0, duration: 1, stagger: 0.13, ease: 'power3.out', delay: 0.2,
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 36, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        })
      })
      gsap.to('.hero-orbit-note', {
        y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
    })

    const updateProgress = () => {
      if (!progressRef.current) return
      const available = document.documentElement.scrollHeight - window.innerHeight
      const progress = available > 0 ? window.scrollY / available : 0
      progressRef.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => {
      window.removeEventListener('scroll', updateProgress)
      ctx.revert()
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <div className="scroll-progress" ref={progressRef} />
      <header className="site-header">
        <a className="brand-mark" href="#home" onClick={closeMenu} aria-label="Suryaprakash home"><span>SP</span><i /></a>
        <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work<span>01</span></a>
          <a href="#experiments" onClick={closeMenu}>Experiments<span>02</span></a>
          <a href="#about" onClick={closeMenu}>About<span>03</span></a>
          <a href="#contact" onClick={closeMenu}>Contact<span>04</span></a>
        </nav>
        <a className="header-availability" href="#contact"><span /> OPEN TO OPPORTUNITIES</a>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-grid" />
          <div className="hero-scene-wrap">
            <ThreeExperience mode="hero" className="hero-scene" />
            <div className="scene-vignette" />
          </div>
          <div className="hero-content">
            <div className="hero-kicker"><span className="eyebrow-dot" /> CREATIVE DEVELOPER / THREE.JS & WEBGL</div>
            <h1 className="hero-title">
              <span className="hero-title-line">I BUILD WORLDS</span>
              <span className="hero-title-line title-outline">BEYOND THE</span>
              <span className="hero-title-line">SCREEN<span className="title-period">.</span></span>
            </h1>
            <p className="hero-description">I’m Suryaprakash — a developer exploring the intersection of code, 3D and interaction. Turning ideas into experiences you can move through.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <ArrowUpRight size={16} /></a>
              <a className="button button-quiet" href="#experiments">Enter the experiments <ArrowDownRight size={16} /></a>
            </div>
          </div>
          <div className="hero-side-note hero-orbit-note"><span>REAL-TIME GRAPHICS</span><span className="side-note-line" /><span>001 — 003</span></div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /><span className="hero-location">POLLACHI / INDIA</span></div>
          <div className="hero-coordinate">13°04' N&nbsp; / &nbsp;80°16' E</div>
        </section>

        <section className="intro-strip" aria-label="Focus areas">
          <div className="intro-strip-label">CURRENTLY EXPLORING</div>
          <div className="ticker-window"><div className="ticker-track"><span>THREE.JS</span><b>✳</b><span>WEBGL</span><b>✳</b><span>GLSL SHADERS</span><b>✳</b><span>PROCEDURAL 3D</span><b>✳</b><span>BLENDER</span><b>✳</b><span>THREE.JS</span><b>✳</b><span>WEBGL</span><b>✳</b><span>GLSL SHADERS</span><b>✳</b><span>PROCEDURAL 3D</span><b>✳</b><span>BLENDER</span><b>✳</b></div></div>
        </section>

        <section className="section work-section" id="work">
          <div className="section-heading" data-reveal>
            <div><span className="section-index">01 / SELECTED WORK</span><h2>Things I’ve<br /><em>put into motion.</em></h2></div>
            <p className="section-heading-aside">A selection of projects where software meets space, interaction and problem-solving.</p>
          </div>
          <div className="projects-list">{projects.map((project) => <ProjectCard key={project.number} project={project} />)}</div>
        </section>

        <section className="experiments-section" id="experiments">
          <div className="section experiments-inner">
            <div className="section-heading" data-reveal>
              <div><span className="section-index">02 / THE PLAYGROUND</span><h2>Curiosity, rendered<br /><em>in real time.</em></h2></div>
              <p className="section-heading-aside">Not a video. Not a mock-up. A live Three.js canvas responding to its own time, geometry and your cursor.</p>
            </div>
            <div className="experiment-layout" data-reveal>
              <div className="experiment-stage">
                <ThreeExperience key={activeExperiment} mode={activeExperiment} className="experiment-canvas" />
                <div className="stage-topline"><span>LIVE WEBGL / 60 FPS TARGET</span><span className="live-indicator"><i /> RENDERING</span></div>
                <div className="stage-bottomline"><span>MOVE YOUR CURSOR TO INTERACT</span><span>THREE.JS / {activeExperiment.toUpperCase()}</span></div>
                <div className="stage-crosshair">+</div>
              </div>
              <div className="experiment-details">
                <div className="experiment-tabs">{experimentModes.map((experiment) => <button key={experiment.id} className={activeExperiment === experiment.id ? 'experiment-tab active' : 'experiment-tab'} onClick={() => setActiveExperiment(experiment.id)}><span>{experiment.name}</span><ArrowUpRight size={15} /></button>)}</div>
                {experimentModes.filter((experiment) => experiment.id === activeExperiment).map((experiment) => <div className="experiment-description" key={experiment.id}><span className="section-index">INTERACTIVE STUDY / 0{experimentModes.findIndex((item) => item.id === experiment.id) + 1}</span><h3>{experiment.title}</h3><p>{experiment.text}</p><span className="experiment-hint"><span className="hint-dot" /> TRY MOVING YOUR CURSOR</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="section-heading" data-reveal>
            <div><span className="section-index">03 / A LITTLE ABOUT ME</span><h2>Developer by study.<br /><em>Maker by instinct.</em></h2></div>
            <div className="about-symbol"><Code2 size={36} strokeWidth={1} /><span>CODE / CREATE / REPEAT</span></div>
          </div>
          <div className="about-grid" data-reveal>
            <div className="about-lead"><span className="large-quote">“</span><p>I’m an Information Technology student interested in building digital experiences that feel less like pages and more like places.</p></div>
            <div className="about-copy"><p>My work sits around frontend development, 3D modelling and interactive applications. I enjoy figuring out how things work — from the structure of a web app to the geometry of a virtual space.</p><p>Recently, I’ve been focusing on Three.js and exploring how real-time 3D can make the web more expressive, useful and memorable.</p><div className="education-line"><span>EDUCATION</span><div><strong>B.Tech — Information Technology</strong><small>Dr. Mahalingam College of Engineering and Technology, Pollachi · 2023–2027</small></div></div></div>
          </div>
        </section>

        <section className="capabilities-section">
          <div className="section capabilities-inner">
            <div className="capabilities-head" data-reveal><span className="section-index">04 / TOOLS & TECHNOLOGIES</span><h2>My current<br /><em>toolkit.</em></h2><p>Technologies I’ve worked with, and the direction I’m actively exploring.</p></div>
            <div className="capabilities-grid" data-reveal>{capabilities.map((skill, index) => <div className="capability" key={skill.label}><span className="capability-number">0{index + 1}</span><div><small>{skill.group}</small><strong>{skill.label}</strong><span>{skill.note}</span></div><MoveUpRight size={16} /></div>)}</div>
          </div>
        </section>

        <section className="experience-section section">
          <div className="experience-header" data-reveal><span className="section-index">05 / EXPERIENCE</span><h2>Where I’ve<br /><em>contributed.</em></h2></div>
          <div className="experience-item" data-reveal><div className="experience-date">JUNE 2025</div><div className="experience-info"><h3>Web Development Intern</h3><strong>CUBE AI SOLUTIONS <span>— ERODE</span></strong><p>Worked with a team of engineers on the company webpage, contributing to its development using React.</p></div><span className="experience-type">INTERNSHIP</span></div>
          <div className="experience-item achievement-row" data-reveal><div className="experience-date">JUNE 2025</div><div className="experience-info"><h3>Technofete’25 — Second Prize</h3><strong>COLLEGE EVENT</strong><p>Recognized with second prize at the college event.</p></div><span className="experience-type">ACHIEVEMENT</span></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-glow" />
          <div className="section contact-inner" data-reveal>
            <span className="section-index">06 / HAVE A PROJECT IN MIND?</span>
            <h2>Let’s make<br /><em>something move.</em></h2>
            <p>I’m interested in opportunities around creative development, interactive 3D and frontend engineering. Have something interesting in mind? Let’s talk.</p>
            <button className="contact-email" onClick={copyEmail}><span>{profile.email}</span>{copied ? 'COPIED ✓' : <><Mail size={18} /><ArrowUpRight size={18} /></>}</button>
            <div className="contact-bottom"><div className="social-links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GITHUB <ArrowUpRight size={13} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LINKEDIN <ArrowUpRight size={13} /></a><a href={profile.resume} download><ArrowDown size={16} /> RESUME <ArrowUpRight size={13} /></a></div><a className="back-top" href="#home">BACK TO TOP <ArrowUpRight size={14} /></a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><a className="brand-mark footer-mark" href="#home"><span>SP</span><i /></a><span>DESIGNED & BUILT BY SURYAPRAKASH B</span><span>© 2026 / KEEP EXPERIMENTING</span></footer>
    </div>
  )
}

export default App
