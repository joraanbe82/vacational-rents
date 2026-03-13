import NavbarClient from './NavbarClient'
import { NavigationResponse } from '@/types/api.types'

async function getNavigationItems() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/navigation`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch navigation')
    }
    
    const data: NavigationResponse = await res.json()
    return data.data?.items || []
  } catch {
    return [
      { id: 'home', label: 'Inicio', href: '/', visible: true, protected: true },
      { id: 'guides', label: 'Guías', href: '/guias', visible: true, protected: false },
      { id: 'dayTrips', label: 'Excursiones', href: '/excursiones', visible: true, protected: false },
      { id: 'about', label: 'Sobre Nosotros', href: '/sobre-nosotros', visible: true, protected: false },
      { id: 'homeOwner', label: 'Propietarios', href: '/propietarios', visible: true, protected: false },
      { id: 'contact', label: 'Contacto', href: '/contacto', visible: true, protected: false }
    ]
  }
}

export default async function Navbar() {
  const navItems = await getNavigationItems()
  
  return <NavbarClient navItems={navItems} />
}
