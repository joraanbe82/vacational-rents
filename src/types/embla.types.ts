export interface EmblaApiType {
  slideNodes(): HTMLElement[];
  internalEngine(): EmblaEngine;
  scrollProgress(): number;
  scrollSnapList(): number[];
  slidesInView(): number[];
  selectedScrollSnap(): number;
  canScrollPrev(): boolean;
  canScrollNext(): boolean;
  scrollPrev(): void;
  scrollNext(): void;
  scrollTo(index: number): void;
  on(event: string, callback: (api: EmblaApiType) => void): EmblaApiType;
}

export interface EmblaEngine {
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
