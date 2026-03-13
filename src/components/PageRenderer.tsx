import Image from 'next/image'
import { PageContent } from '@/types/api.types'
import { BG_GRADIENT_CENTER, BG_GRADIENT_EDGE, BG_ORB_GOLDEN, TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA } from '@/lib/constants'

interface PageRendererProps {
  content: PageContent
}

export default function PageRenderer({ content }: PageRendererProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {content.hero.image ? (
          <>
            <Image
              src={content.hero.image}
              alt={content.hero.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: BG_GRADIENT_EDGE }} />
        )}
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-light mb-6" style={{ color: content.hero.image ? '#ffffff' : TEXT_PRIMARY }}>
            {content.hero.title}
          </h1>
          <p className="text-xl md:text-2xl font-light" style={{ color: content.hero.image ? '#ffffffcc' : TEXT_SECONDARY }}>
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Sections */}
      {content.sections.map((section, index) => (
        <section
          key={section.id}
          className="py-20 px-6"
          style={{ backgroundColor: index % 2 === 0 ? BG_GRADIENT_CENTER : BG_ORB_GOLDEN }}
        >
          <div className="max-w-6xl mx-auto">
            {section.image ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${section.imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
                <div className={section.imagePosition === 'right' ? 'md:order-2' : ''}>
                  <div className="relative h-96 rounded-3xl overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={section.imagePosition === 'right' ? 'md:order-1' : ''}>
                  <h2 className="text-4xl font-light mb-6" style={{ color: TEXT_PRIMARY }}>
                    {section.title}
                  </h2>
                  <p className="text-lg leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                    {section.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-light mb-6" style={{ color: TEXT_PRIMARY }}>
                  {section.title}
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  {section.description}
                </p>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Cards Grid */}
      {content.cards.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: BG_GRADIENT_CENTER }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  style={{ backgroundColor: BG_ORB_GOLDEN }}
                >
                  {card.image && (
                    <div className="relative h-48 mb-6 rounded-2xl overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold mb-4" style={{ color: TEXT_PRIMARY }}>
                    {card.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                    {card.description}
                  </p>
                  {card.link && (
                    <a
                      href={card.link}
                      className="inline-block mt-6 px-6 py-3 rounded-full font-semibold transition-all"
                      style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
                    >
                      Ver más
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      {content.contact.enabled && (
        <section className="py-20 px-6" style={{ backgroundColor: BG_GRADIENT_EDGE }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-light mb-6" style={{ color: TEXT_PRIMARY }}>
                  {content.contact.formTitle}
                </h2>
                <p className="text-lg mb-8" style={{ color: TEXT_SECONDARY }}>
                  {content.contact.formDescription}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEXT_SECONDARY }}>
                      Email
                    </p>
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="text-lg font-semibold hover:underline"
                      style={{ color: BG_ORB_TERRACOTA }}
                    >
                      {content.contact.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEXT_SECONDARY }}>
                      Teléfono
                    </p>
                    <a
                      href={`tel:${content.contact.phone}`}
                      className="text-lg font-semibold hover:underline"
                      style={{ color: BG_ORB_TERRACOTA }}
                    >
                      {content.contact.phone}
                    </a>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEXT_SECONDARY }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full p-4 rounded-xl outline-none transition-all"
                    style={{
                      backgroundColor: BG_GRADIENT_CENTER,
                      border: `2px solid ${BG_ORB_GOLDEN}`,
                      color: TEXT_PRIMARY
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEXT_SECONDARY }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full p-4 rounded-xl outline-none transition-all"
                    style={{
                      backgroundColor: BG_GRADIENT_CENTER,
                      border: `2px solid ${BG_ORB_GOLDEN}`,
                      color: TEXT_PRIMARY
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEXT_SECONDARY }}>
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full p-4 rounded-xl outline-none transition-all resize-none"
                    style={{
                      backgroundColor: BG_GRADIENT_CENTER,
                      border: `2px solid ${BG_ORB_GOLDEN}`,
                      color: TEXT_PRIMARY
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all"
                  style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
