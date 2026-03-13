import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { BG_GRADIENT_CENTER, TEXT_PRIMARY } from '@/lib/constants';


export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen" style={{ backgroundColor: BG_GRADIENT_CENTER, color: TEXT_PRIMARY }}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-bg.jpg')"
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full px-4 py-32 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight leading-tight mx-auto">
                {tHero('title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide mx-auto">
                {tHero('subtitle')}
              </p>
            </div>

            {/* SearchBar integrado */}
            <SearchBar />
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
