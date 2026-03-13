'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Home, Building2, Bell, ClipboardList, MapPin, Navigation, Settings, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [pendingReservas, setPendingReservas] = useState(0)
  const [pendingSolicitudes, setPendingSolicitudes] = useState(0)

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const fetchPendingCounts = async () => {
      try {
        const [resCheckins, resSolicitudes] = await Promise.all([
          fetch('/api/checkins'),
          fetch('/api/solicitudes')
        ])
        
        const dataCheckins = await resCheckins.json()
        if (dataCheckins.success && Array.isArray(dataCheckins.data)) {
          const pending = dataCheckins.data.filter((c: { status: string }) => c.status === 'pending').length
          setPendingReservas(pending)
        }
        
        const dataSolicitudes = await resSolicitudes.json()
        if (dataSolicitudes.success && Array.isArray(dataSolicitudes.data)) {
          const pending = dataSolicitudes.data.filter((s: { status: string }) => s.status === 'pending').length
          setPendingSolicitudes(pending)
        }
      } catch {
        // Silently fail
      }
    }
    fetchPendingCounts()
  }, [])

  return (
    <aside className="w-64 bg-deep-espresso text-golden-glow flex flex-col h-screen">
      <div className="p-6 border-b border-dusty-cocoa">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-warm-sand text-sm mt-1">Vacational Rents</p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <Link href="/admin/dashboard">
          <Button
            variant={isActive('/admin/dashboard') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Home size={18} />
            Dashboard
          </Button>
        </Link>

        <Link href="/admin/propiedades">
          <Button
            variant={isActive('/admin/propiedades') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Building2 size={18} />
            Propiedades
          </Button>
        </Link>

        <Link href="/admin/solicitudes">
          <Button
            variant={isActive('/admin/solicitudes') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2 relative"
          >
            <Bell size={18} />
            Solicitudes
            {pendingSolicitudes > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingSolicitudes}
              </span>
            )}
          </Button>
        </Link>

        <Link href="/admin/reservas">
          <Button
            variant={isActive('/admin/reservas') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2 relative"
          >
            <ClipboardList size={18} />
            Reservas
            {pendingReservas > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingReservas}
              </span>
            )}
          </Button>
        </Link>

        <Link href="/admin/municipios">
          <Button
            variant={isActive('/admin/municipios') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <MapPin size={18} />
            Municipios
          </Button>
        </Link>

        <Link href="/admin/navegacion">
          <Button
            variant={isActive('/admin/navegacion') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Navigation size={18} />
            Navegación
          </Button>
        </Link>

        <Link href="/admin/configuracion">
          <Button
            variant={isActive('/admin/configuracion') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Settings size={18} />
            Configuración
          </Button>
        </Link>
      </nav>

      <div className="p-6 border-t border-dusty-cocoa">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-dusty-cocoa/20"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <LogOut size={18} />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
