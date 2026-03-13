import FooterClient from './FooterClient'
import { ContactResponse } from '@/types/api.types'

async function getContactInfo() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/contact`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch contact info')
    }
    
    const data: ContactResponse = await res.json()
    return data.data || {
      email: 'info@costadelsol.com',
      phone: '+34 952 123 456',
      addressLine1: 'Marbella, Costa del Sol',
      addressLine2: 'España',
      brandName: 'Costa del Sol',
      copyright: 'Todos los derechos reservados'
    }
  } catch {
    return {
      email: 'info@costadelsol.com',
      phone: '+34 952 123 456',
      addressLine1: 'Marbella, Costa del Sol',
      addressLine2: 'España',
      brandName: 'Costa del Sol',
      copyright: 'Todos los derechos reservados'
    }
  }
}

export default async function Footer() {
  const contactInfo = await getContactInfo()
  
  return <FooterClient contactInfo={contactInfo} />
}
