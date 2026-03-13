'use client'

import Link from 'next/link'
import { BG_ORB_TERRACOTA, TEXT_SECONDARY } from '@/lib/constants'

interface BackToGalleryLinkProps {
  href: string
  text: string
}

export default function BackToGalleryLink({ href, text }: BackToGalleryLinkProps) {
  return (
    <Link 
      href={href} 
      className="text-sm font-medium transition-colors" 
      style={{ color: TEXT_SECONDARY }} 
      onMouseEnter={(e) => e.currentTarget.style.color = BG_ORB_TERRACOTA} 
      onMouseLeave={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
    >
      ← {text}
    </Link>
  )
}
