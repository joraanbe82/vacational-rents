'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RENTAL_PROPERTIES } from '@/lib/data'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { ADMIN_TEXTAREA_MIN_HEIGHT, ADMIN_DEFAULT_GUESTS, ADMIN_DEFAULT_BEDROOMS, ADMIN_DEFAULT_BATHROOMS } from '@/lib/constants'
import { PropertyWithVisibility } from '@/types/admin.types'

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<PropertyWithVisibility[]>(
    RENTAL_PROPERTIES.map(p => ({ ...p, visible: true }))
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: 0,
    description: '',
    guests: ADMIN_DEFAULT_GUESTS,
    bedrooms: ADMIN_DEFAULT_BEDROOMS,
    bathrooms: ADMIN_DEFAULT_BATHROOMS,
  })

  const handleAddProperty = () => {
    if (!newProperty.title.trim()) return

    const property: PropertyWithVisibility = {
      id: Math.max(...properties.map(p => parseInt(p.id)), 0) + 1 + '',
      title: newProperty.title,
      location: newProperty.location,
      price: newProperty.price,
      description: newProperty.description,
      specs: { 
        guests: newProperty.guests, 
        bedrooms: newProperty.bedrooms, 
        bathrooms: newProperty.bathrooms 
      },
      images: [],
      visible: true,
    }

    setProperties([...properties, property])
    setNewProperty({
      title: '',
      location: '',
      price: 0,
      description: '',
      guests: ADMIN_DEFAULT_GUESTS,
      bedrooms: ADMIN_DEFAULT_BEDROOMS,
      bathrooms: ADMIN_DEFAULT_BATHROOMS,
    })
    setShowAddForm(false)
  }

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id))
  }

  const handleToggleVisibility = (id: string) => {
    setProperties(
      properties.map(p =>
        p.id === id ? { ...p, visible: !p.visible } : p
      )
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Propiedades</h1>
        <p className="text-slate-600 mt-2">Administra todas tus propiedades de alquiler</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Añadir Nueva Propiedad</CardTitle>
          <CardDescription>
            Crea una nueva propiedad para tu catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Propiedad
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700">Título</label>
                  <Input
                    placeholder="Nombre de la propiedad"
                    value={newProperty.title}
                    onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700">Ubicación</label>
                  <Input
                    placeholder="Ciudad, País"
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Precio por noche ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty({ ...newProperty, price: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Huéspedes</label>
                  <Input
                    type="number"
                    min="1"
                    value={newProperty.guests}
                    onChange={(e) => setNewProperty({ ...newProperty, guests: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Habitaciones</label>
                  <Input
                    type="number"
                    min="1"
                    value={newProperty.bedrooms}
                    onChange={(e) => setNewProperty({ ...newProperty, bedrooms: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Baños</label>
                  <Input
                    type="number"
                    min="1"
                    value={newProperty.bathrooms}
                    onChange={(e) => setNewProperty({ ...newProperty, bathrooms: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700">Descripción</label>
                  <textarea
                    className={`w-full min-h-[${ADMIN_TEXTAREA_MIN_HEIGHT}px] px-3 py-2 border border-slate-200 rounded-md text-sm`}
                    placeholder="Descripción de la propiedad"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowAddForm(false)
                    setNewProperty({
                      title: '',
                      location: '',
                      price: 0,
                      description: '',
                      guests: ADMIN_DEFAULT_GUESTS,
                      bedrooms: ADMIN_DEFAULT_BEDROOMS,
                      bathrooms: ADMIN_DEFAULT_BATHROOMS,
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddProperty}>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Propiedad
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Propiedades ({properties.length})
        </h2>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-500">
                No hay propiedades registradas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {properties.map((property) => (
              <Card key={property.id} className={property.visible ? '' : 'opacity-60'}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {property.title}
                        </h3>
                        {!property.visible && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Oculta
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {property.location}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span>${property.price}/noche</span>
                        <span>{property.specs.bedrooms} habitaciones</span>
                        <span>{property.specs.guests} huéspedes</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleVisibility(property.id)}
                        title={property.visible ? 'Ocultar' : 'Mostrar'}
                      >
                        {property.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>

                      <Link href={`/admin/propiedades/${property.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
