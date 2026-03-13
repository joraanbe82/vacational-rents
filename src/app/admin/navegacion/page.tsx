'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { NavigationItem, NavigationResponse } from '@/types/api.types'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA } from '@/lib/constants'
import { Info } from 'lucide-react'

export default function NavegacionPage() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  useEffect(() => {
    const loadNavigationItems = async () => {
      try {
        const res = await fetch('/api/navigation')
        const data: NavigationResponse = await res.json()
        
        if (data.success && data.data) {
          setNavItems(data.data.items)
        } else {
          showToastMessage('Error al cargar la navegación', 'error')
        }
      } catch {
        showToastMessage('Error al cargar la navegación', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadNavigationItems()
  }, [])

  const handleToggleVisibility = (id: string) => {
    setNavItems(
      navItems.map(item =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    )
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: navItems })
      })

      const data: NavigationResponse = await res.json()

      if (data.success) {
        showToastMessage('✓ Cambios guardados correctamente', 'success')
      } else {
        showToastMessage(data.error || 'Error al guardar', 'error')
      }
    } catch {
      showToastMessage('Error al guardar los cambios', 'error')
    } finally {
      setIsSaving(false)
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
          Gestión de Navegación
        </h1>
        <p className="mt-2" style={{ color: TEXT_SECONDARY }}>
          Controla qué pestañas se muestran en la barra de navegación pública
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pestañas de Navegación</CardTitle>
          <CardDescription>
            Activa o desactiva las pestañas que aparecen en la navbar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
              style={{ 
                borderColor: TEXT_SECONDARY,
                opacity: item.visible ? 1 : 0.6
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium" style={{ color: TEXT_PRIMARY }}>
                    {item.label}
                  </p>
                  {item.protected && (
                    <div 
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: `${TEXT_SECONDARY}20`,
                        color: TEXT_SECONDARY
                      }}
                      title="La página de inicio no se puede ocultar"
                    >
                      <Info className="w-3 h-3" />
                      <span>Siempre visible</span>
                    </div>
                  )}
                </div>
                <p className="text-sm mt-1" style={{ color: TEXT_SECONDARY }}>
                  {item.href}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span 
                  className="text-sm font-medium"
                  style={{ color: item.visible ? 'green' : TEXT_SECONDARY }}
                >
                  {item.visible ? 'Visible' : 'Oculta'}
                </span>
                <Switch
                  checked={item.visible}
                  onCheckedChange={() => handleToggleVisibility(item.id)}
                  disabled={item.protected}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveChanges}
          disabled={isSaving}
          style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Toast de confirmación/error */}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2"
          style={{ 
            backgroundColor: toastType === 'success' ? 'green' : 'red', 
            color: 'white' 
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}
