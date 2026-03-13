import { NavItem } from '@/types/Navigation.types'

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'Inicio',
    href: '/',
    visible: true,
    canHide: false
  },
  {
    key: 'guides',
    label: 'Guías',
    href: '/guias',
    visible: true,
    canHide: true
  },
  {
    key: 'dayTrips',
    label: 'Excursiones',
    href: '/excursiones',
    visible: true,
    canHide: true
  },
  {
    key: 'about',
    label: 'Sobre Nosotros',
    href: '/sobre-nosotros',
    visible: true,
    canHide: true
  },
  {
    key: 'homeOwner',
    label: 'Propietarios',
    href: '/propietarios',
    visible: true,
    canHide: true
  },
  {
    key: 'contact',
    label: 'Contacto',
    href: '/contacto',
    visible: true,
    canHide: true
  }
]
