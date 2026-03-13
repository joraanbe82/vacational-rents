'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RENTAL_PROPERTIES } from '@/lib/data'
import { ArrowLeft } from 'lucide-react'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA, BG_ORB_GOLDEN, ADMIN_TEXTAREA_MIN_HEIGHT } from '@/lib/constants'
import ImageUploader from '@/components/admin/ImageUploader'
import { ImagePreview } from '@/types/ImageFile.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Municipality, MunicipalityResponse } from '@/types/api.types'

interface PropertyWithVisibility {
  id: string
  title: string
  location: string
  price: number
  description: string
  specs: {
    guests: number
    bedrooms: number
    bathrooms: number
  }
  images: string[]
  visible: boolean
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const initialProperty = RENTAL_PROPERTIES.find(p => p.id === id)
  const [property, setProperty] = useState<PropertyWithVisibility>(
    initialProperty
      ? { ...initialProperty, visible: true }
      : {
          id: '',
          title: '',
          location: '',
          price: 0,
          description: '',
          specs: { guests: 0, bedrooms: 0, bathrooms: 0 },
          images: [],
          visible: true,
        }
  )
  
  const [propertyImages, setPropertyImages] = useState<ImagePreview[]>(
    initialProperty?.images.map((url, index) => ({
      id: `existing-${index}`,
      url,
      isExisting: true
    })) || []
  )

  const [municipalities, setMunicipalities] = useState<Municipality[]>([])

  useEffect(() => {
    const loadMunicipalities = async () => {
      try {
        const res = await fetch('/api/municipalities')
        const data: MunicipalityResponse = await res.json()
        
        if (data.success && Array.isArray(data.data)) {
          setMunicipalities(data.data)
        }
      } catch {
        // Silently fail
      }
    }

    loadMunicipalities()
  }, [])

  if (!initialProperty) {
    return (
      <div className="space-y-4">
        <Link href="/admin/propiedades">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">
              Propiedad no encontrada
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setProperty(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSpecsChange = (field: string, value: number) => {
    setProperty(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [field]: value
      }
    }))
  }

  const handleImagesChange = (newImages: ImagePreview[]) => {
    setPropertyImages(newImages)
    setProperty(prev => ({
      ...prev,
      images: newImages.map(img => img.url)
    }))
  }

  const handleSave = () => {
    alert('Cambios guardados en memoria (sin base de datos)')
    router.push('/admin/propiedades')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/propiedades">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: TEXT_PRIMARY }}>Editar Propiedad</h1>
          <p className="mt-1" style={{ color: TEXT_SECONDARY }}>{property.title}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Título</label>
                <Input
                  value={property.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Municipio</label>
                <Select
                  value={property.location}
                  onValueChange={(value) => handleFieldChange('location', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((municipality) => (
                      <SelectItem key={municipality.id} value={municipality.name}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Precio por noche (€)</label>
                <Input
                  type="number"
                  value={property.price}
                  onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Descripción</label>
                <textarea
                  value={property.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    minHeight: `${ADMIN_TEXTAREA_MIN_HEIGHT}px`,
                    borderColor: BG_ORB_GOLDEN,
                    color: TEXT_PRIMARY
                  }}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Especificaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Huéspedes</label>
                <Input
                  type="number"
                  value={property.specs.guests}
                  onChange={(e) => handleSpecsChange('guests', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Habitaciones</label>
                <Input
                  type="number"
                  value={property.specs.bedrooms}
                  onChange={(e) => handleSpecsChange('bedrooms', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>Baños</label>
                <Input
                  type="number"
                  value={property.specs.bathrooms}
                  onChange={(e) => handleSpecsChange('bathrooms', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Galería de Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle>Galería de Imágenes</CardTitle>
              <CardDescription>
                Añade o elimina fotos del carrusel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader 
                images={propertyImages}
                onImagesChange={handleImagesChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={handleSave} 
                className="w-full"
                style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
              >
                Guardar Cambios
              </Button>
              <Link href="/admin/propiedades" className="block">
                <Button variant="outline" className="w-full" style={{ color: TEXT_SECONDARY }}>
                  Cancelar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p style={{ color: TEXT_SECONDARY }}>Título</p>
                <p className="font-semibold">{property.title || '-'}</p>
              </div>
              <div>
                <p style={{ color: TEXT_SECONDARY }}>Ubicación</p>
                <p className="font-semibold">{property.location || '-'}</p>
              </div>
              <div>
                <p style={{ color: TEXT_SECONDARY }}>Precio</p>
                <p className="font-semibold">{property.price}€/noche</p>
              </div>
              <div>
                <p style={{ color: TEXT_SECONDARY }}>Imágenes</p>
                <p className="font-semibold">{property.images.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
