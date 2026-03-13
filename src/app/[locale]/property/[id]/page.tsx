import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { RENTAL_PROPERTIES } from '@/lib/data';
import BookingCalendar from '@/components/BookingCalendar';
import Navbar from '@/components/Navbar';
import BackToGalleryLink from '@/components/BackToGalleryLink';
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA, BG_ORB_GOLDEN } from '@/lib/constants';

export default async function PropertyPage({ 
    params 
}: { 
    params: Promise<{ id: string; locale: string }> 
}) {
    const { id, locale } = await params;
    const property = RENTAL_PROPERTIES.find((p) => p.id === id);

    if (!property) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'property' });

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-44">              
                <nav className="p-8 flex justify-between items-center max-w-[1400px] mx-auto">
                <BackToGalleryLink href={`/${locale}`} text={t('backToGallery')} />
                <div className="h-px flex-1 mx-8 hidden md:block" style={{ backgroundColor: BG_ORB_GOLDEN }}></div>
                <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: BG_ORB_TERRACOTA }}>
                    {t('stayDetails')}
                </span>
            </nav>

            <div className="max-w-[1400px] mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7 space-y-8">
                    {property.images.map((img, idx) => (
                        <div key={idx} className="overflow-hidden rounded-[2.5rem]">
                            <Image
                                src={img}
                                alt={`${property.title} - view ${idx + 1}`}
                                width={1200}
                                height={900}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                priority={idx === 0}
                            />
                        </div>
                    ))}
                </div>

                <aside className="lg:col-span-5">
                    <div className="lg:sticky lg:top-12 space-y-12">
                        <header>
                            <h1 className="text-5xl font-light tracking-tight mb-4" style={{ color: TEXT_PRIMARY }}>
                                {property.title}
                            </h1>
                            <p className="text-xl font-light" style={{ color: TEXT_SECONDARY }}>{property.location}</p>
                        </header>

                        <div className="grid grid-cols-3 border-y py-8" style={{ borderColor: BG_ORB_GOLDEN }}>
                            <div className="text-center">
                                <span className="block text-2xl font-semibold" style={{ color: TEXT_PRIMARY }}>{property.specs.guests}</span>
                                <span className="text-[10px] uppercase tracking-widest" style={{ color: BG_ORB_TERRACOTA }}>{t('guests')}</span>
                            </div>
                            <div className="text-center border-x" style={{ borderColor: BG_ORB_GOLDEN }}>
                                <span className="block text-2xl font-semibold" style={{ color: TEXT_PRIMARY }}>{property.specs.bedrooms}</span>
                                <span className="text-[10px] uppercase tracking-widest" style={{ color: BG_ORB_TERRACOTA }}>{t('bedrooms')}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-semibold" style={{ color: TEXT_PRIMARY }}>{property.specs.bathrooms}</span>
                                <span className="text-[10px] uppercase tracking-widest" style={{ color: BG_ORB_TERRACOTA }}>{t('baths')}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-widest font-semibold" style={{ color: TEXT_PRIMARY }}>{t('aboutSpace')}</h3>
                            <p className="text-lg leading-relaxed font-light" style={{ color: TEXT_SECONDARY }}>
                                {property.description}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: BG_ORB_TERRACOTA }}>
                                {t('selectDates')}
                            </h3>
                            <BookingCalendar pricePerNight={property.price} propertyId={property.id} propertyName={property.title} />
                        </div>
                    </div>
                </aside>
            </div>
            </main>
        </>
    );
}
