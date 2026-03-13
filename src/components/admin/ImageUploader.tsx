'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImagePreview } from '@/types/ImageFile.types'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_GOLDEN } from '@/lib/constants'

interface ImageUploaderProps {
  images: ImagePreview[]
  onImagesChange: (images: ImagePreview[]) => void
}

export default function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages: ImagePreview[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      isExisting: false
    }))

    onImagesChange([...images, ...newImages])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleRemoveImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    if (imageToRemove && !imageToRemove.isExisting && imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    onImagesChange(images.filter(img => img.id !== id))
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Zona de drag & drop */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
        style={{
          borderColor: isDragging ? BG_ORB_GOLDEN : TEXT_SECONDARY,
          backgroundColor: isDragging ? `${BG_ORB_GOLDEN}20` : 'transparent'
        }}
      >
        <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: TEXT_SECONDARY }} />
        <p className="text-sm font-medium mb-1" style={{ color: TEXT_PRIMARY }}>
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
          Formatos soportados: JPG, PNG, WebP
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Grid de miniaturas */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border"
              style={{ borderColor: BG_ORB_GOLDEN }}
            >
              {/* Número de orden */}
              <div
                className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10"
                style={{ backgroundColor: BG_ORB_GOLDEN, color: TEXT_PRIMARY }}
              >
                {index + 1}
              </div>

              {/* Botón eliminar */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                onClick={() => handleRemoveImage(image.id)}
              >
                <X className="w-4 h-4 text-red-600" />
              </Button>

              {/* Preview de la imagen */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-center" style={{ color: TEXT_SECONDARY }}>
          {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} seleccionada{images.length === 1 ? '' : 's'}
        </p>
      )}
    </div>
  )
}
