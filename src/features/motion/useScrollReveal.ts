import { useEffect } from 'react'

export function useScrollReveal(routeKey = '') {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((target) => target.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [routeKey])
}
