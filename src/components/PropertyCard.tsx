'use client'

import React, { useEffect, useCallback, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import Image from 'next/image'
import Link from 'next/link'

interface PropertyProps {
  id: string;
  title: string;
  images: string[];
}

interface EmblaApiType {
  slideNodes(): HTMLElement[];
  internalEngine(): EmblaEngine;
  scrollProgress(): number;
  scrollSnapList(): number[];
  slidesInView(): number[];
  on(event: string, callback: (api: EmblaApiType) => void): void;
}

interface EmblaEngine {
  options: {
    loop: boolean;
  };
  slideLooper: {
    loopPoints: Array<{
      index: number;
      target: () => number;
    }>;
  };
}

const TWEEN_FACTOR = 1.2;

export default function PropertyCard({ id, title, images }: PropertyProps) {
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

  const setTweenNodes = useCallback((emblaApi: EmblaApiType) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode: HTMLElement) => {
      return slideNode.querySelector('.slide-inner') as HTMLElement
    })
  }, [])

  const applyTweenValues = useCallback((emblaApi: EmblaApiType) => {
    const engine = emblaApi.internalEngine() as EmblaEngine
    const scrollProgress = emblaApi.scrollProgress()
    const scrollSnaps = emblaApi.scrollSnapList()

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

      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR)
      const scale = Math.max(0.8, Math.min(1, tweenValue)).toString()
      const slide = tweenNodes.current[index]
      
      if (slide) {
        slide.style.transform = `scale(${scale})`
      }
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenNodes(emblaApi)
    applyTweenValues(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', applyTweenValues)
      .on('scroll', applyTweenValues)
  }, [emblaApi, setTweenNodes, applyTweenValues])

  return (
    <div className="w-full group">
      <h2 className="text-xl font-medium mb-8 text-slate-800 tracking-tight text-center">
        {title}
      </h2>
      
      {/* El viewport ahora captura los gestos de rueda gracias al plugin */}
      <div className="overflow-hidden py-12" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((url, index) => (
            <div 
              key={index} 
              className="flex-[0_0_60%] min-w-0"
            >
              <Link href={`/property/${id}`} className="block">
                <div className="slide-inner origin-center transition-transform duration-200 ease-out cursor-pointer">
                  <Image
                    src={url} 
                    alt={title}
                    className="w-full aspect-[4/3] object-cover rounded-[2.5rem] select-none pointer-events-none shadow-sm"
                    draggable="false"
                    width={800}
                    height={600}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}