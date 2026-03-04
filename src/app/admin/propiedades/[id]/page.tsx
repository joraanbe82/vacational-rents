'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RENTAL_PROPERTIES } from '@/lib/data'
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'

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
  const [newImageUrl, setNewImageUrl] = useState('')

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

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return
    setProperty(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl]
    }))
    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...property.images]
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]]
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
    }
    setProperty(prev => ({
      ...prev,
      images: newImages
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
          <h1 className="text-3xl font-bold text-slate-900">Editar Propiedad</h1>
          <p className="text-slate-600 mt-1">{property.title}</p>
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
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={property.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ubicación</label>
                <Input
                  value={property.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Precio por Noche ($)</label>
                <Input
                  type="number"
                  value={property.price}
                  onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  value={property.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-950"
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
                <label className="text-sm font-medium">Huéspedes</label>
                <Input
                  type="number"
                  value={property.specs.guests}
                  onChange={(e) => handleSpecsChange('guests', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Habitaciones</label>
                <Input
                  type="number"
                  value={property.specs.bedrooms}
                  onChange={(e) => handleSpecsChange('bedrooms', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Baños</label>
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
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="URL de la imagen"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddImage()
                  }}
                />
                <Button onClick={handleAddImage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir
                </Button>
              </div>

              {property.images.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No hay imágenes añadidas
                </p>
              ) : (
                <div className="space-y-2">
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border border-slate-200 rounded-md"
                    >
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 truncate">{image}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveImage(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveImage(index, 'down')}
                          disabled={index === property.images.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <Button onClick={handleSave} className="w-full">
                Guardar Cambios
              </Button>
              <Link href="/admin/propiedades" className="block">
                <Button variant="outline" className="w-full">
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
                <p className="text-slate-600">Título</p>
                <p className="font-semibold">{property.title || '-'}</p>
              </div>
              <div>
                <p className="text-slate-600">Ubicación</p>
                <p className="font-semibold">{property.location || '-'}</p>
              </div>
              <div>
                <p className="text-slate-600">Precio</p>
                <p className="font-semibold">${property.price}/noche</p>
              </div>
              <div>
                <p className="text-slate-600">Imágenes</p>
                <p className="font-semibold">{property.images.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
