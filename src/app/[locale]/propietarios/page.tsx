import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageRenderer from '@/components/PageRenderer'
import { PageContent } from '@/types/api.types'

async function getPageContent(): Promise<PageContent | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pages/owners`, {
      cache: 'no-store'
    })
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent()
  
  if (!content) {
    return {
      title: 'Propietarios - Vacational Rents',
      description: 'Información para propietarios'
    }
  }

  return {
    title: content.seo.metaTitle,
    description: content.seo.metaDescription
  }
}

export default async function PropietariosPage({ 
  params 
}: { 
  params: Promise<{ locale: string }>;
}) {
  await params
  const content = await getPageContent()

  if (!content) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>Error al cargar el contenido</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <PageRenderer content={content} />
      </main>
      <Footer />
    </>
  )
}
