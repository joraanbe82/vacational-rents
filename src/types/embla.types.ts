export interface EmblaApiType {
  slideNodes(): HTMLElement[];
  internalEngine(): EmblaEngine;
  scrollProgress(): number;
  scrollSnapList(): number[];
  slidesInView(): number[];
  on(event: string, callback: (api: EmblaApiType) => void): void;
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
