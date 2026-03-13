'use client'

import { useEffect, useState } from 'react'
import { BookingRequest } from '@/types/api.types'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Clock } from 'lucide-react'
import { BG_ORB_GOLDEN, BG_ORB_TERRACOTA, TEXT_PRIMARY, TEXT_SECONDARY } from '@/lib/constants'

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all')

  useEffect(() => {
    loadSolicitudes()
  }, [])

  const loadSolicitudes = async () => {
    try {
      const res = await fetch('/api/solicitudes')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setSolicitudes(data.data)
      }
    } catch {
      alert('Error al cargar las solicitudes')
    } finally {
      setLoading(false)
    }
  }

  const confirmSolicitud = async (id: string) => {
    try {
      const res = await fetch(`/api/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm' })
      })
      const data = await res.json()
      if (data.success) {
        await loadSolicitudes()
      } else {
        alert(data.error || 'Error al confirmar la solicitud')
      }
    } catch {
      alert('Error al confirmar la solicitud')
    }
  }

  const rejectSolicitud = async (id: string) => {
    if (!confirm('¿Rechazar esta solicitud?')) return
    
    try {
      const res = await fetch(`/api/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      })
      const data = await res.json()
      if (data.success) {
        await loadSolicitudes()
      } else {
        alert(data.error || 'Error al rechazar la solicitud')
      }
    } catch {
      alert('Error al rechazar la solicitud')
    }
  }

  const deleteSolicitud = async (id: string) => {
    if (!confirm('¿Eliminar esta solicitud? Esta acción no se puede deshacer')) return
    
    try {
      const res = await fetch(`/api/solicitudes/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        await loadSolicitudes()
      } else {
        alert(data.error || 'Error al eliminar la solicitud')
      }
    } catch {
      alert('Error al eliminar la solicitud')
    }
  }

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/es/check-in/property?token=${token}`
    navigator.clipboard.writeText(link)
    alert('Link copiado al portapapeles')
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: BG_ORB_GOLDEN, text: TEXT_SECONDARY },
      confirmed: { bg: '#22c55e33', text: '#16a34a' },
      rejected: { bg: '#ef444433', text: '#dc2626' }
    }
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      rejected: 'Rechazada'
    }
    const style = styles[status as keyof typeof styles]
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expirado'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m restantes`
  }

  const filteredSolicitudes = solicitudes.filter(s => filter === 'all' || s.status === filter)

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Solicitudes de Reserva</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Solicitudes de Reserva</h1>
        <p className="text-gray-600">Gestiona las solicitudes de reserva de tus propiedades</p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Todas ({solicitudes.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pendientes ({solicitudes.filter(s => s.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'confirmed' ? 'default' : 'outline'}
          onClick={() => setFilter('confirmed')}
          size="sm"
        >
          Confirmadas ({solicitudes.filter(s => s.status === 'confirmed').length})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
          size="sm"
        >
          Rechazadas ({solicitudes.filter(s => s.status === 'rejected').length})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredSolicitudes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay solicitudes que mostrar</p>
          </div>
        ) : (
          filteredSolicitudes.map(solicitud => {
            const isExpired = solicitud.tokenExpiresAt && new Date(solicitud.tokenExpiresAt) < new Date()

            return (
              <div key={solicitud.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold" style={{ color: TEXT_PRIMARY }}>{solicitud.id}</h3>
                        {getStatusBadge(solicitud.status)}
                      </div>
                      <p className="text-xl font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
                        {solicitud.propertyName}
                      </p>
                      <div className="space-y-1 text-sm" style={{ color: TEXT_SECONDARY }}>
                        <p><span className="font-semibold">Fechas:</span> {solicitud.checkInDate} → {solicitud.checkOutDate} ({solicitud.nights} noches)</p>
                        <p><span className="font-semibold">Email:</span> {solicitud.email}</p>
                        <p><span className="font-semibold">Teléfono:</span> {solicitud.phone}</p>
                        <p className="text-xs">Solicitado el {formatDate(solicitud.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {solicitud.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => confirmSolicitud(solicitud.id)}
                        className="flex-1"
                        style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
                      >
                        Confirmar y generar link
                      </Button>
                      <Button
                        onClick={() => rejectSolicitud(solicitud.id)}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Rechazar
                      </Button>
                    </div>
                  )}

                  {solicitud.status === 'confirmed' && solicitud.checkinToken && (
                    <div className="mt-4 p-4 rounded-xl space-y-3" style={{ backgroundColor: `${BG_ORB_GOLDEN}33` }}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>Link de Check-in</span>
                        {solicitud.tokenExpiresAt && (
                          <span className="text-xs flex items-center gap-1" style={{ color: isExpired ? '#dc2626' : TEXT_SECONDARY }}>
                            <Clock size={14} />
                            {getTimeRemaining(solicitud.tokenExpiresAt)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={`${window.location.origin}/es/check-in/property?token=${solicitud.checkinToken}`}
                          readOnly
                          className="flex-1 px-3 py-2 text-xs rounded-lg border"
                          style={{ backgroundColor: 'white', color: TEXT_SECONDARY }}
                        />
                        <Button
                          onClick={() => copyLink(solicitud.checkinToken!)}
                          size="sm"
                          variant="outline"
                        >
                          <Copy size={16} />
                        </Button>
                      </div>

                      {solicitud.checkinCompletedAt && (
                        <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>
                          ✓ Check-in completado el {formatDate(solicitud.checkinCompletedAt)}
                        </p>
                      )}

                      {isExpired && !solicitud.checkinCompletedAt && (
                        <p className="text-xs font-semibold" style={{ color: '#dc2626' }}>
                          ⚠ Este link ha expirado
                        </p>
                      )}
                    </div>
                  )}

                  {solicitud.status === 'rejected' && (
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => deleteSolicitud(solicitud.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
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
