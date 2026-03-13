'use client'

import { useEffect, useState } from 'react'
import { CheckinRecord } from '@/types/api.types'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function ReservasPage() {
  const [checkins, setCheckins] = useState<CheckinRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    loadCheckins()
  }, [])

  const loadCheckins = async () => {
    try {
      const res = await fetch('/api/checkins')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setCheckins(data.data)
      }
    } catch {
      alert('Error al cargar las reservas')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/checkins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        await loadCheckins()
      } else {
        alert(data.error || 'Error al actualizar el estado')
      }
    } catch {
      alert('Error al actualizar el estado')
    }
  }

  const deleteCheckin = async (id: string) => {
    if (!confirm('¿Eliminar este registro? Esta acción no se puede deshacer')) {
      return
    }
    try {
      const res = await fetch(`/api/checkins/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        await loadCheckins()
      } else {
        alert(data.error || 'Error al eliminar el registro')
      }
    } catch {
      alert('Error al eliminar el registro')
    }
  }

  const filteredCheckins = checkins
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      const mainGuest = c.guests.find(g => g.id === c.mainGuest)
      return (
        c.id.toLowerCase().includes(term) ||
        (mainGuest && `${mainGuest.firstName} ${mainGuest.lastName}`.toLowerCase().includes(term))
      )
    })

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    }
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Reservas</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reservas de Check-in</h1>
        <p className="text-gray-600">Gestiona los registros de check-in de tus propiedades</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todos ({checkins.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            size="sm"
          >
            Pendientes ({checkins.filter(c => c.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            onClick={() => setFilter('confirmed')}
            size="sm"
          >
            Confirmados ({checkins.filter(c => c.status === 'confirmed').length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setFilter('cancelled')}
            size="sm"
          >
            Cancelados ({checkins.filter(c => c.status === 'cancelled').length})
          </Button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          className="flex-1 px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de reservas */}
      <div className="space-y-4">
        {filteredCheckins.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay reservas que mostrar</p>
          </div>
        ) : (
          filteredCheckins.map(checkin => {
            const mainGuest = checkin.guests.find(g => g.id === checkin.mainGuest)
            const isExpanded = expandedId === checkin.id

            return (
              <div key={checkin.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{checkin.id}</h3>
                        {getStatusBadge(checkin.status)}
                      </div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Huésped principal:</span>{' '}
                        {mainGuest ? `${mainGuest.firstName} ${mainGuest.lastName}` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {checkin.guests.length} huésped{checkin.guests.length !== 1 ? 'es' : ''} • Registrado el {formatDate(checkin.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(isExpanded ? null : checkin.id)}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCheckin(checkin.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>

                  {/* Cambiar estado */}
                  <div className="flex gap-2 mb-4">
                    <select
                      value={checkin.status}
                      onChange={(e) => updateStatus(checkin.id, e.target.value as 'pending' | 'confirmed' | 'cancelled')}
                      className="px-3 py-2 border rounded-lg text-sm font-medium"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  {/* Detalles expandidos */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t space-y-6">
                      <div>
                        <h4 className="font-bold mb-2">Propiedad</h4>
                        <p className="text-sm text-gray-600">ID: {checkin.propertyId}</p>
                      </div>

                      {checkin.guests.map((guest, index) => (
                        <div key={guest.id} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3">
                            Huésped {index + 1} {guest.id === checkin.mainGuest && '(Principal)'}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-semibold">Nombre:</span> {guest.firstName} {guest.lastName}
                            </div>
                            <div>
                              <span className="font-semibold">Email:</span> {guest.email}
                            </div>
                            <div>
                              <span className="font-semibold">Teléfono:</span> {guest.phone}
                            </div>
                            <div>
                              <span className="font-semibold">Documento:</span> {guest.documentType} - {guest.documentNumber}
                            </div>
                            <div>
                              <span className="font-semibold">Fecha de expedición:</span> {guest.issueDate}
                            </div>
                            <div>
                              <span className="font-semibold">Fecha de nacimiento:</span> {guest.birthDate}
                            </div>
                            <div>
                              <span className="font-semibold">Nacionalidad:</span> {guest.nationality}
                            </div>
                            {guest.address && (
                              <>
                                <div className="col-span-full">
                                  <span className="font-semibold">Dirección:</span> {guest.address.street}
                                  {guest.address.extra && `, ${guest.address.extra}`}
                                </div>
                                <div>
                                  <span className="font-semibold">Ciudad:</span> {guest.address.city}
                                </div>
                                <div>
                                  <span className="font-semibold">Código postal:</span> {guest.address.postalCode}
                                </div>
                                <div>
                                  <span className="font-semibold">País:</span> {guest.address.country}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
