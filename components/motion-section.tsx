'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MotionSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-motion="reveal"]').forEach((element) => {
        gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-motion="line"]').forEach((element) => {
        gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, duration: 1.25, ease: 'power3.inOut', scrollTrigger: { trigger: element, start: 'top 90%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-motion="image"]').forEach((element) => {
        gsap.fromTo(element, { clipPath: 'inset(0 0 100% 0)', scale: 1.07 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.35, ease: 'power3.inOut', scrollTrigger: { trigger: element, start: 'top 86%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.fromTo(element, { y: -26 }, { y: 34, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
      })
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.fromTo(Array.from(group.children), { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 84%', once: true } })
      })
    }, root)
    return () => context.revert()
  }, [])

  return <div ref={root} className={className}>{children}</div>
}
