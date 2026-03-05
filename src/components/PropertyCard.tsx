'use client'

import React, { useEffect, useCallback, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { CAROUSEL_TWEEN_FACTOR, CAROUSEL_MIN_SCALE, CAROUSEL_MAX_SCALE, PROPERTY_IMAGE_WIDTH, PROPERTY_IMAGE_HEIGHT, NAV_ARROW_SIZE, NAV_DOT_SIZE, NAV_DOT_ACTIVE_WIDTH, ANIMATION_FADE_DURATION, CAROUSEL_ROTATION_DEG, CAROUSEL_ROTATION_DEG_TABLET, CAROUSEL_ROTATION_DEG_MOBILE, CAROUSEL_TRANSLATE_Z, CAROUSEL_TRANSLATE_Z_MOBILE, CAROUSEL_LATERAL_OPACITY, CAROUSEL_LATERAL_BRIGHTNESS, CAROUSEL_PERSPECTIVE, CAROUSEL_BORDER_RADIUS_MOBILE, CAROUSEL_BORDER_RADIUS_DESKTOP } from '@/lib/constants'
import { PropertyProps } from '@/types/property.types'
import { EmblaEngine } from '@/types/embla.types'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'


export default function PropertyCard({ id, title, images }: PropertyProps) {
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);
  
  // Configuración con el plugin de rueda incluido
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'center',
      skipSnaps: false 
    }, 
    [WheelGesturesPlugin()] // Aquí es donde Windsurf debía activarlo
  )

  const tweenNodes = useRef<HTMLElement[]>([])

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode: HTMLElement) => {
      return slideNode.querySelector('.slide-inner') as HTMLElement
    })
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const applyTweenValues = useCallback((emblaApi: EmblaCarouselType) => {
    const engine = emblaApi.internalEngine() as EmblaEngine
    const scrollProgress = emblaApi.scrollProgress()
    const scrollSnaps = emblaApi.scrollSnapList()

    // Valores responsive para rotación y translateZ
    const rotationDeg = isMobile ? CAROUSEL_ROTATION_DEG_MOBILE : isTablet ? CAROUSEL_ROTATION_DEG_TABLET : CAROUSEL_ROTATION_DEG
    const translateZ = isMobile ? CAROUSEL_TRANSLATE_Z_MOBILE : CAROUSEL_TRANSLATE_Z

    scrollSnaps.forEach((scrollSnap: number, index: number) => {
      let diffToTarget = scrollSnap - scrollProgress

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopPoint: { index: number; target: () => number }) => {
          const target = loopPoint.target()
          if (index === loopPoint.index && target !== 0) {
            const sign = Math.sign(target)
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
          }
        })
      }

      const tweenValue = 1 - Math.abs(diffToTarget * CAROUSEL_TWEEN_FACTOR)
      const slide = tweenNodes.current[index]
      
      if (slide) {
        // Interpolaciones para coverflow 3D
        const scale = Math.max(CAROUSEL_MIN_SCALE, Math.min(CAROUSEL_MAX_SCALE, tweenValue))
        const opacity = CAROUSEL_LATERAL_OPACITY + (1 - CAROUSEL_LATERAL_OPACITY) * tweenValue
        const brightness = CAROUSEL_LATERAL_BRIGHTNESS + (1 - CAROUSEL_LATERAL_BRIGHTNESS) * tweenValue
        
        // Rotación: positiva a la izquierda, negativa a la derecha
        const rotateY = diffToTarget * rotationDeg * -1
        const translateZValue = (1 - tweenValue) * translateZ * -1
        
        // Aplicar todas las transformaciones simultáneamente
        slide.style.transform = `perspective(${CAROUSEL_PERSPECTIVE}px) rotateY(${rotateY}deg) translateZ(${translateZValue}px) scale(${scale})`
        slide.style.opacity = opacity.toString()
        slide.style.filter = `brightness(${brightness})`
        slide.style.zIndex = Math.round(tweenValue * 10).toString()
        
        // Sombra dinámica
        if (tweenValue > 0.95) {
          slide.style.boxShadow = '0 30px 80px rgba(0,0,0,0.20), 0 10px 30px rgba(0,0,0,0.10)'
        } else {
          slide.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'
        }
      }
    })
  }, [isMobile, isTablet])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return

    setTweenNodes(emblaApi)
    applyTweenValues(emblaApi)
    onSelect(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', applyTweenValues)
      .on('reInit', onSelect)
      .on('scroll', applyTweenValues)
      .on('select', onSelect)
  }, [emblaApi, setTweenNodes, applyTweenValues, onSelect])

  return (
    <div 
      ref={elementRef}
      className={`w-full group transition-all ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDuration: `${ANIMATION_FADE_DURATION}ms` }}
    >
      <h2 className="text-xl font-medium mb-8 text-slate-800 tracking-tight text-center">
        {title}
      </h2>
      
      {/* Contenedor del carrusel con flechas */}
      <div className="relative">
        <div 
          className="overflow-hidden py-12" 
          ref={emblaRef}
          style={{ 
            perspective: `${CAROUSEL_PERSPECTIVE}px`,
            perspectiveOrigin: 'center center'
          }}
        >
          <div className="flex touch-pan-y">
            {images.map((url, index) => {
              const borderRadius = isMobile || isTablet ? CAROUSEL_BORDER_RADIUS_MOBILE : CAROUSEL_BORDER_RADIUS_DESKTOP;
              
              return (
              <div 
                key={index} 
                className="flex-[0_0_88%] md:flex-[0_0_78%] lg:flex-[0_0_60%] min-w-0 overflow-hidden"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <Link 
                  href={`/${locale}/property/${id}`} 
                  className="block overflow-hidden"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  <div 
                    className="slide-inner origin-center transition-all duration-300 ease-out cursor-pointer overflow-hidden bg-transparent"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    <Image
                      src={url} 
                      alt={title}
                      className="w-full h-[260px] md:h-[360px] lg:h-auto lg:aspect-[4/3] object-cover select-none pointer-events-none"
                      style={{ borderRadius: `${borderRadius}px` }}
                      draggable="false"
                      width={PROPERTY_IMAGE_WIDTH}
                      height={PROPERTY_IMAGE_HEIGHT}
                    />
                  </div>
                </Link>
              </div>
              );
            })}
          </div>
        </div>

        {/* Flechas de navegación - Solo desktop, visibles en hover */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0 shadow-lg"
          style={{ width: NAV_ARROW_SIZE, height: NAV_ARROW_SIZE }}
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0 shadow-lg"
          style={{ width: NAV_ARROW_SIZE, height: NAV_ARROW_SIZE }}
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Dots indicadores */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="transition-all duration-250 ease-out"
            style={{
              width: index === selectedIndex ? NAV_DOT_ACTIVE_WIDTH : NAV_DOT_SIZE,
              height: NAV_DOT_SIZE,
              borderRadius: NAV_DOT_SIZE / 2,
              backgroundColor: index === selectedIndex ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
              minWidth: NAV_DOT_SIZE,
              minHeight: NAV_DOT_SIZE
            }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}