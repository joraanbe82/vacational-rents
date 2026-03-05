import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, isVisible])

  return { elementRef, isVisible }
}
