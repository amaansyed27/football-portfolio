import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePortfolioMotion(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero__kicker, .hero__role, .hero__actions',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.05, stagger: 0.14, ease: 'power3.out' },
      )

      gsap.fromTo(
        '.hero h1 span, .hero h1 strong',
        { yPercent: 115, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.12, ease: 'power4.out' },
      )

      gsap.to('.hero__content', {
        yPercent: 24,
        scale: 0.94,
        opacity: 0.28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to('.hero__stadium', {
        yPercent: 18,
        scale: 1.16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      gsap.utils.toArray<HTMLElement>('.section').forEach((section) => {
        const headingPieces = section.querySelectorAll('.section-label, h2')
        if (headingPieces.length) {
          gsap.fromTo(
            headingPieces,
            { opacity: 0, y: 110, clipPath: 'inset(0 0 100% 0)' },
            {
              opacity: 1,
              y: 0,
              clipPath: 'inset(0 0 0% 0)',
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                end: 'top 38%',
                scrub: 1,
              },
            },
          )
        }
      })

      gsap.fromTo(
        '.profile__copy > p',
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.profile', start: 'top 70%', end: 'center 55%', scrub: 1 },
        },
      )

      gsap.fromTo(
        '.profile__facts > div',
        { opacity: 0, y: 55 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '.profile__facts', start: 'top 88%', end: 'bottom 66%', scrub: 1 },
        },
      )

      gsap.fromTo(
        '.pitch',
        { opacity: 0, rotateX: 28, scale: 0.82, transformPerspective: 900 },
        {
          opacity: 1,
          rotateX: 5,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.formation', start: 'top 68%', end: 'center 52%', scrub: 1.1 },
        },
      )

      gsap.fromTo(
        '.player',
        { opacity: 0, scale: 0.2, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: { amount: 0.75, from: 'center' },
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '.pitch', start: 'top 72%', toggleActions: 'play none none reverse' },
        },
      )

      gsap.fromTo(
        '.experience__card',
        { opacity: 0, xPercent: 38, rotateY: -8, transformPerspective: 1200 },
        {
          opacity: 1,
          xPercent: 0,
          rotateY: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.experience', start: 'top 72%', end: 'center 48%', scrub: 1 },
        },
      )

      gsap.fromTo(
        '.project',
        { opacity: 0, x: 150 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.project-list', start: 'top 78%', toggleActions: 'play none none reverse' },
        },
      )

      gsap.to('.project-list', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: { trigger: '.projects', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

      gsap.fromTo(
        '.academy__timeline article',
        { opacity: 0, x: 90 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.academy__timeline', start: 'top 78%', toggleActions: 'play none none reverse' },
        },
      )

      gsap.fromTo(
        '.contact__overline, .contact h2, .contact .button, .contact footer',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          ease: 'none',
          scrollTrigger: { trigger: '.contact', start: 'top 68%', end: 'center 48%', scrub: 1 },
        },
      )

      gsap.fromTo(
        '.contact__shot-cue',
        { opacity: 0, x: 70 },
        {
          opacity: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.contact', start: 'top 92%', end: 'top 58%', scrub: 1 },
        },
      )

      gsap.to('.contact__shot-cue', {
        opacity: 0,
        x: -45,
        scale: 0.92,
        ease: 'none',
        scrollTrigger: { trigger: '.contact', start: '34% center', end: '48% center', scrub: 1 },
      })

      gsap.fromTo(
        '.goal-callout__panel',
        { opacity: 0, scale: 0.52, rotate: -5, clipPath: 'inset(0 48% 0 48%)' },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          clipPath: 'inset(0 0% 0 0%)',
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact', start: '48% center', end: '66% center', scrub: 0.8 },
        },
      )

      gsap.to('.goal-callout__panel', {
        opacity: 0.12,
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: '.contact', start: '68% center', end: 'bottom top', scrub: 1 },
      })

      const finaleFlash = gsap.timeline({
        scrollTrigger: {
          trigger: '.contact',
          start: '49% center',
          end: '69% center',
          scrub: 0.8,
        },
      })
      finaleFlash
        .to('.contact__lights', { opacity: 1, filter: 'brightness(2.1) saturate(1.35)', duration: 0.22 })
        .to('.contact__lights', { opacity: 0.5, filter: 'brightness(1) saturate(1)', duration: 0.78 })

      gsap.to('.marquee span', {
        xPercent: -28,
        ease: 'none',
        scrollTrigger: { trigger: '.profile', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, document.body)

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 160)
    return () => {
      window.clearTimeout(refreshTimer)
      context.revert()
    }
  }, [enabled])
}
