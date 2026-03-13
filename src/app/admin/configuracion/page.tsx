'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactInfo, ContactResponse } from '@/types/api.types'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA } from '@/lib/constants'
import PageEditorTabs from '@/components/admin/PageEditorTabs'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'guides' | 'excursions' | 'about' | 'owners' | 'contact-page'>('contact')
  const [config, setConfig] = useState<ContactInfo>({
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    brandName: '',
    copyright: ''
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const res = await fetch('/api/contact')
        const data: ContactResponse = await res.json()
        
        if (data.success && data.data) {
          setConfig(data.data)
        } else {
          showToastMessage('Error al cargar la configuración', 'error')
        }
      } catch {
        showToastMessage('Error al cargar la configuración', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadContactInfo()
  }, [])

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleFieldChange = (field: keyof ContactInfo, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSave = async () => {
    const newErrors: Partial<Record<keyof ContactInfo, string>> = {}

    if (!validateEmail(config.email)) {
      newErrors.email = 'Formato de email inválido'
    }

    if (!config.phone.trim()) {
      newErrors.phone = 'El teléfono no puede estar vacío'
    }

    if (!config.brandName.trim()) {
      newErrors.brandName = 'El nombre de la marca no puede estar vacío'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      const data: ContactResponse = await res.json()

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

  const tabs = [
    { id: 'contact' as const, label: 'Información de Contacto' },
    { id: 'guides' as const, label: 'Guías' },
    { id: 'excursions' as const, label: 'Excursiones' },
    { id: 'about' as const, label: 'Sobre Nosotros' },
    { id: 'owners' as const, label: 'Propietarios' },
    { id: 'contact-page' as const, label: 'Página de Contacto' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: TEXT_PRIMARY }}>
          Configuración del Sitio
        </h1>
        <p className="mt-2" style={{ color: TEXT_SECONDARY }}>
          Administra la información de contacto y contenido de páginas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 font-semibold whitespace-nowrap transition-all"
            style={{
              color: activeTab === tab.id ? TEXT_PRIMARY : TEXT_SECONDARY,
              borderBottom: activeTab === tab.id ? `3px solid ${BG_ORB_TERRACOTA}` : '3px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'contact' && (
        <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
          <CardDescription>
            Esta información se mostrará en el footer de la web pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: TEXT_PRIMARY }}>
              Nombre de la empresa / marca
            </label>
            <Input
              value={config.brandName}
              onChange={(e) => handleFieldChange('brandName', e.target.value)}
              placeholder="Costa del Sol"
            />
            {errors.brandName && (
              <p className="text-sm text-red-600 mt-1">{errors.brandName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: TEXT_PRIMARY }}>
              Email de contacto
            </label>
            <Input
              type="email"
              value={config.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="info@costadelsol.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: TEXT_PRIMARY }}>
              Teléfono
            </label>
            <Input
              type="tel"
              value={config.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="+34 952 123 456"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: TEXT_PRIMARY }}>
              Dirección línea 1
            </label>
            <Input
              value={config.addressLine1}
              onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
              placeholder="Marbella, Málaga"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: TEXT_PRIMARY }}>
              Dirección línea 2 (ciudad, país)
            </label>
            <Input
              value={config.addressLine2}
              onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
              placeholder="España"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: TEXT_PRIMARY }}>
              Texto de copyright
            </label>
            <Input
              value={config.copyright}
              onChange={(e) => handleFieldChange('copyright', e.target.value)}
              placeholder="Todos los derechos reservados"
            />
          </div>
        </CardContent>
        </Card>
      )}

      {activeTab === 'guides' && (
        <PageEditorTabs slug="guides" title="Guías de la Costa del Sol" />
      )}

      {activeTab === 'excursions' && (
        <PageEditorTabs slug="excursions" title="Excursiones" />
      )}

      {activeTab === 'about' && (
        <PageEditorTabs slug="about" title="Sobre Nosotros" />
      )}

      {activeTab === 'owners' && (
        <PageEditorTabs slug="owners" title="Propietarios" />
      )}

      {activeTab === 'contact-page' && (
        <PageEditorTabs slug="contact" title="Página de Contacto" />
      )}

      {activeTab === 'contact' && (
        <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        </div>
      )}

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
