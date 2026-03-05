'use client'

import { BG_GRADIENT_CENTER, BG_GRADIENT_EDGE, BG_ORB_TURQUOISE, BG_ORB_TERRACOTA, BG_ORB_GOLDEN } from '@/lib/constants'

export default function BackgroundLayer() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Capa base: Gradiente radial */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${BG_GRADIENT_CENTER} 0%, ${BG_GRADIENT_EDGE} 100%)`
        }}
      />

      {/* Capa de textura: Ruido SVG */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Capa de orbes - Paleta Costa del Sol */}
      {/* Orbe superior derecha: Azul turquesa mediterráneo */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-[0.12]"
        style={{
          background: BG_ORB_TURQUOISE,
          filter: 'blur(120px)'
        }}
      />

      {/* Orbe centro izquierda: Terracota andaluza */}
      <div
        className="absolute top-[40%] left-[-8%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.10]"
        style={{
          background: BG_ORB_TERRACOTA,
          filter: 'blur(130px)'
        }}
      />

      {/* Orbe inferior centro: Blanco dorado cálido */}
      <div
        className="absolute bottom-[-15%] left-[50%] translate-x-[-50%] w-[550px] h-[550px] md:w-[750px] md:h-[750px] rounded-full opacity-[0.08]"
        style={{
          background: BG_ORB_GOLDEN,
          filter: 'blur(140px)'
        }}
      />
    </div>
  )
}
