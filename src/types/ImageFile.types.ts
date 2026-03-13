export interface ImagePreview {
  id: string
  file?: File
  url: string
  isExisting: boolean
}

export interface ImageUploaderProps {
  images: ImagePreview[]
  onImagesChange: (images: ImagePreview[]) => void
  maxImages?: number
}
