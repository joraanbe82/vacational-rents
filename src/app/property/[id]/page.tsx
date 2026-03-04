import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RENTAL_PROPERTIES } from '@/lib/data';
import BookingCalendar from '@/components/BookingCalendar';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = RENTAL_PROPERTIES.find((p) => p.id === id);

    if (!property) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="p-8 flex justify-between items-center max-w-[1400px] mx-auto">
                <Link href="/" className="text-sm font-medium text-black hover:opacity-60 transition-opacity">
                    ← Back to gallery
                </Link>
                <div className="h-px flex-1 bg-gray-100 mx-8 hidden md:block"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
                    Stay Details
                </span>
            </nav>

            <div className="max-w-[1400px] mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Gallery: 7/12 columns */}
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

                {/* Sidebar Info: 5/12 columns */}
                <aside className="lg:col-span-5">
                    <div className="lg:sticky lg:top-12 space-y-12">
                        <header>
                            <h1 className="text-5xl font-light tracking-tight text-black mb-4">
                                {property.title}
                            </h1>
                            <p className="text-xl text-gray-500 font-light">{property.location}</p>
                        </header>

                        <div className="grid grid-cols-3 border-y border-gray-100 py-8">
                            <div className="text-center">
                                <span className="block text-2xl font-semibold text-black">{property.specs.guests}</span>
                                <span className="text-[10px] uppercase tracking-widest text-gray-600">Guests</span>
                            </div>
                            <div className="text-center border-x border-gray-100">
                                <span className="block text-2xl font-semibold text-black">{property.specs.bedrooms}</span>
                                <span className="text-[10px] uppercase tracking-widest text-gray-600">Bedrooms</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-semibold text-black">{property.specs.bathrooms}</span>
                                <span className="text-[10px] uppercase tracking-widest text-gray-600">Baths</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-900">About the space</h3>
                            <p className="text-lg text-gray-600 leading-relaxed font-light">
                                {property.description}
                            </p>
                        </div>

                                    <div className="space-y-8">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400">
                                Select Dates
                            </h3>
                            <BookingCalendar pricePerNight={property.price} propertyId={property.id} />

                            <button
                                disabled={!property.price}
                                className="w-full bg-black text-white py-6 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:bg-gray-200"
                            >
                                Confirm Reservation
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}