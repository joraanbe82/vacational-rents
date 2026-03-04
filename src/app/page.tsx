import PropertyCard from "@/components/PropertyCard";
import { RENTAL_PROPERTIES } from "@/lib/data";


export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="py-20 px-6 text-center mb-8">
        <h1 className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 mb-4">
          Curated Stays
        </h1>
        <p className="text-4xl font-light tracking-tight text-black sm:text-5xl">
          Exceptional Architecture & Design
        </p>
      </header>

      {/* Ajustado a 4xl para un equilibrio perfecto entre tamaño y visibilidad lateral */}
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
