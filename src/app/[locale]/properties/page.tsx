import { getTranslations } from 'next-intl/server';
import PropertyCard from "@/components/PropertyCard";
import { RENTAL_PROPERTIES } from "@/lib/data";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ANIMATION_STAGGER_DELAY, BG_GRADIENT_CENTER, BG_GRADIENT_EDGE, BG_ORB_TERRACOTA, BG_ORB_GOLDEN, TEXT_PRIMARY, TEXT_SECONDARY } from '@/lib/constants';

interface SearchParams {
  type?: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export default async function PropertiesPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const filters = await searchParams;
  
  const t = await getTranslations({ locale, namespace: 'search' });

  // Construir resumen de filtros
  const filterSummary: string[] = [];
  
  if (filters.destination) {
    filterSummary.push(filters.destination);
  }
  
  if (filters.checkIn && filters.checkOut) {
    const checkInDate = new Date(filters.checkIn).toLocaleDateString(locale);
    const checkOutDate = new Date(filters.checkOut).toLocaleDateString(locale);
    filterSummary.push(`${checkInDate} - ${checkOutDate}`);
  }
  
  if (filters.guests) {
    const guestCount = parseInt(filters.guests);
    filterSummary.push(t(guestCount === 1 ? 'guestCount' : 'guestCount_plural', { count: guestCount }));
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 relative bg-golden-glow" style={{ color: TEXT_PRIMARY }}>
        {/* Fondo gradiente radial */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at center, ${BG_GRADIENT_CENTER} 0%, ${BG_GRADIENT_EDGE} 100%)`
          }}
        />
        
        {/* Orbes decorativos Costa del Sol */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Orbe superior derecha: Dorado cálido */}
          <div
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-[0.12]"
            style={{
              background: BG_ORB_GOLDEN,
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
        <div className="max-w-4xl mx-auto px-4">
          {/* Resumen de filtros */}
          {filterSummary.length > 0 && (
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-light mb-4" style={{ color: TEXT_PRIMARY }}>
                {filters.type === 'buy' ? t('buy') : t('rent')}
              </h1>
              <p className="text-lg" style={{ color: TEXT_SECONDARY }}>
                {filterSummary.join(' · ')}
              </p>
            </div>
          )}

          {/* Carruseles de propiedades */}
          <div className="pb-32 space-y-32 PropertyCard">
            {RENTAL_PROPERTIES.map((property, index) => (
              <div
                key={property.id}
                style={{ animationDelay: `${index * ANIMATION_STAGGER_DELAY}ms` }}
              >
                <PropertyCard
                  title={property.title}
                  images={property.images}
                  id={property.id}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
