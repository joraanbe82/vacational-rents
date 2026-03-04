import { getTranslations } from 'next-intl/server';
import PropertyCard from "@/components/PropertyCard";
import { RENTAL_PROPERTIES } from "@/lib/data";
import LanguageSwitcher from '@/components/LanguageSwitcher';


export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="py-20 px-6 text-center mb-8 relative">
        <div className="absolute top-8 right-8">
          <LanguageSwitcher />
        </div>
        <h1 className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 mb-4">
          {t('title')}
        </h1>
        <p className="text-4xl font-light tracking-tight text-black sm:text-5xl">
          {t('subtitle')}
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 pb-32 space-y-32">
        {RENTAL_PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            title={property.title}
            images={property.images}
            id={property.id}
          />
        ))}
      </div>
    </main>
  );
}
