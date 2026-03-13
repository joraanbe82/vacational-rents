'use client'

import { useState, useEffect } from 'react'
import { PageContent } from '@/types/api.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { BG_ORB_TERRACOTA, TEXT_PRIMARY } from '@/lib/constants'

interface PageEditorTabsProps {
  slug: 'guides' | 'excursions' | 'about' | 'owners' | 'contact'
  title: string
}

export default function PageEditorTabs({ slug, title }: PageEditorTabsProps) {
  const [content, setContent] = useState<PageContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadContent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const loadContent = async () => {
    try {
      const res = await fetch(`/api/pages/${slug}`)
      const data = await res.json()
      if (data.success) {
        setContent(data.data)
      }
    } catch {
      alert('Error al cargar el contenido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return
    
    setIsSaving(true)
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })
      
      const data = await res.json()
      if (data.success) {
        alert('✓ Página actualizada correctamente')
        setHasChanges(false)
      } else {
        alert('Error al guardar los cambios')
      }
    } catch {
      alert('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  const updateContent = (updates: Partial<PageContent>) => {
    setContent(prev => prev ? { ...prev, ...updates } : null)
    setHasChanges(true)
  }

  if (isLoading) {
    return <div className="p-8">Cargando...</div>
  }

  if (!content) {
    return <div className="p-8">Error al cargar el contenido</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: TEXT_PRIMARY }}>{title}</h2>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          style={{ 
            backgroundColor: BG_ORB_TERRACOTA, 
            color: TEXT_PRIMARY,
            opacity: !hasChanges || isSaving ? 0.5 : 1,
            pointerEvents: !hasChanges || isSaving ? 'none' : 'auto'
          }}
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Título</label>
            <Input
              value={content.hero.title}
              onChange={(e) => updateContent({ hero: { ...content.hero, title: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Subtítulo</label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateContent({ hero: { ...content.hero, subtitle: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">URL de Imagen</label>
            <Input
              value={content.hero.image}
              onChange={(e) => updateContent({ hero: { ...content.hero, image: e.target.value } })}
              placeholder="/images/hero-placeholder.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Secciones de Contenido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.sections.map((section, index) => (
            <div key={section.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={20} className="text-gray-400" />
                  <span className="font-bold">Sección {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newSections = content.sections.filter((_, i) => i !== index)
                    updateContent({ sections: newSections })
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Título</label>
                <Input
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...content.sections]
                    newSections[index] = { ...section, title: e.target.value }
                    updateContent({ sections: newSections })
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Descripción</label>
                <Textarea
                  value={section.description}
                  rows={4}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const newSections = [...content.sections]
                    newSections[index] = { ...section, description: e.target.value }
                    updateContent({ sections: newSections })
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">URL de Imagen</label>
                  <Input
                    value={section.image}
                    onChange={(e) => {
                      const newSections = [...content.sections]
                      newSections[index] = { ...section, image: e.target.value }
                      updateContent({ sections: newSections })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Posición de Imagen</label>
                  <select
                    value={section.imagePosition}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const newSections = [...content.sections]
                      newSections[index] = { ...section, imagePosition: e.target.value as 'left' | 'right' }
                      updateContent({ sections: newSections })
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            onClick={() => {
              const newSection = {
                id: `section-${Date.now()}`,
                title: '',
                description: '',
                image: '',
                imagePosition: 'left' as const
              }
              updateContent({ sections: [...content.sections, newSection] })
            }}
            variant="outline"
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Añadir Sección
          </Button>
        </CardContent>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.cards.map((card, index) => (
              <div key={card.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Card {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCards = content.cards.filter((_, i) => i !== index)
                      updateContent({ cards: newCards })
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <Input
                  placeholder="Título"
                  value={card.title}
                  onChange={(e) => {
                    const newCards = [...content.cards]
                    newCards[index] = { ...card, title: e.target.value }
                    updateContent({ cards: newCards })
                  }}
                />
                
                <Textarea
                  placeholder="Descripción"
                  value={card.description}
                  rows={3}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const newCards = [...content.cards]
                    newCards[index] = { ...card, description: e.target.value }
                    updateContent({ cards: newCards })
                  }}
                />
                
                <Input
                  placeholder="URL de imagen"
                  value={card.image}
                  onChange={(e) => {
                    const newCards = [...content.cards]
                    newCards[index] = { ...card, image: e.target.value }
                    updateContent({ cards: newCards })
                  }}
                />
                
                <Input
                  placeholder="Link (opcional)"
                  value={card.link}
                  onChange={(e) => {
                    const newCards = [...content.cards]
                    newCards[index] = { ...card, link: e.target.value }
                    updateContent({ cards: newCards })
                  }}
                />
              </div>
            ))}
          </div>
          
          <Button
            onClick={() => {
              const newCard = {
                id: `card-${Date.now()}`,
                title: '',
                description: '',
                image: '',
                link: ''
              }
              updateContent({ cards: [...content.cards, newCard] })
            }}
            variant="outline"
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Añadir Card
          </Button>
        </CardContent>
      </Card>

      {/* Contact Section - Solo visible en página de contacto */}
      {slug === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Sección de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.contact.enabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ contact: { ...content.contact, enabled: e.target.checked } })}
                className="w-4 h-4"
              />
              <label className="text-sm font-bold">Mostrar formulario de contacto</label>
            </div>
            
            {content.contact.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <Input
                      value={content.contact.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ contact: { ...content.contact, email: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Teléfono</label>
                    <Input
                      value={content.contact.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ contact: { ...content.contact, phone: e.target.value } })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Título del Formulario</label>
                  <Input
                    value={content.contact.formTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ contact: { ...content.contact, formTitle: e.target.value } })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Descripción del Formulario</label>
                  <Textarea
                    value={content.contact.formDescription}
                    rows={3}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent({ contact: { ...content.contact, formDescription: e.target.value } })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold">Meta Título</label>
              <span className="text-xs text-gray-500">{content.seo.metaTitle.length}/60</span>
            </div>
            <Input
              value={content.seo.metaTitle}
              maxLength={60}
              onChange={(e) => updateContent({ seo: { ...content.seo, metaTitle: e.target.value } })}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold">Meta Descripción</label>
              <span className="text-xs text-gray-500">{content.seo.metaDescription.length}/160</span>
            </div>
            <Textarea
              value={content.seo.metaDescription}
              maxLength={160}
              rows={3}
              onChange={(e) => updateContent({ seo: { ...content.seo, metaDescription: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
