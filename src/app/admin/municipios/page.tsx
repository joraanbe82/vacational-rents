'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Municipality, MunicipalityResponse } from '@/types/api.types'
import { Plus, Trash2, Check, X } from 'lucide-react'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA, BG_ORB_GOLDEN } from '@/lib/constants'

export default function MunicipiosPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [newMunicipalityName, setNewMunicipalityName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMunicipalities()
  }, [])

  const loadMunicipalities = async () => {
    try {
      const res = await fetch('/api/municipalities')
      const data: MunicipalityResponse = await res.json()
      
      if (data.success && Array.isArray(data.data)) {
        setMunicipalities(data.data)
      }
    } catch {
      alert('Error al cargar los municipios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMunicipality = async () => {
    if (!newMunicipalityName.trim()) return

    try {
      const res = await fetch('/api/municipalities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newMunicipalityName.trim() })
      })

      const data: MunicipalityResponse = await res.json()

      if (data.success && data.data && !Array.isArray(data.data)) {
        setMunicipalities([...municipalities, data.data])
        setNewMunicipalityName('')
      } else {
        alert(data.error || 'Error al añadir el municipio')
      }
    } catch {
      alert('Error al añadir el municipio')
    }
  }

  const handleDeleteMunicipality = async (id: string) => {
    const municipality = municipalities.find(m => m.id === id)
    if (!municipality) return

    const confirmed = window.confirm(
      `¿Eliminar "${municipality.name}"?\n\nLas propiedades asociadas quedarán sin municipio asignado.`
    )

    if (!confirmed) return

    try {
      const res = await fetch(`/api/municipalities/${id}`, {
        method: 'DELETE'
      })

      const data: MunicipalityResponse = await res.json()

      if (data.success) {
        setMunicipalities(municipalities.filter(m => m.id !== id))
      } else {
        alert(data.error || 'Error al eliminar el municipio')
      }
    } catch {
      alert('Error al eliminar el municipio')
    }
  }

  const handleStartEdit = (municipality: Municipality) => {
    setEditingId(municipality.id)
    setEditingName(municipality.name)
  }

  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingId) return

    try {
      const res = await fetch(`/api/municipalities/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editingName.trim() })
      })

      const data: MunicipalityResponse = await res.json()

      if (data.success && data.data && !Array.isArray(data.data)) {
        setMunicipalities(
          municipalities.map(m =>
            m.id === editingId ? data.data as Municipality : m
          )
        )
        setEditingId(null)
        setEditingName('')
      } else {
        alert(data.error || 'Error al editar el municipio')
      }
    } catch {
      alert('Error al editar el municipio')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: TEXT_SECONDARY }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: TEXT_PRIMARY }}>
          Gestión de Municipios
        </h1>
        <p className="mt-2" style={{ color: TEXT_SECONDARY }}>
          Administra los municipios disponibles en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Municipio</CardTitle>
          <CardDescription>
            Crea un nuevo municipio para el sistema de propiedades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del municipio"
              value={newMunicipalityName}
              onChange={(e) => setNewMunicipalityName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddMunicipality()
              }}
              className="flex-1"
            />
            <Button 
              onClick={handleAddMunicipality}
              style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Municipios ({municipalities.length})</CardTitle>
          <CardDescription>
            Haz clic en un nombre para editarlo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {municipalities.length === 0 ? (
            <p className="text-center py-8" style={{ color: TEXT_SECONDARY }}>
              No hay municipios registrados
            </p>
          ) : (
            <div className="space-y-2">
              {municipalities.map((municipality) => (
                <div
                  key={municipality.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: BG_ORB_GOLDEN }}
                >
                  {editingId === municipality.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveEdit}
                        style={{ color: 'green' }}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        style={{ color: TEXT_SECONDARY }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(municipality)}
                        className="flex-1 text-left font-medium transition-colors"
                        style={{ color: TEXT_PRIMARY }}
                        onMouseEnter={(e) => e.currentTarget.style.color = BG_ORB_TERRACOTA}
                        onMouseLeave={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
                      >
                        {municipality.name}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMunicipality(municipality.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
