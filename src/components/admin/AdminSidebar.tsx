'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Home, Building2, LogOut } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Vacational Rents</p>
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
      </nav>

      <div className="p-6 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-400 hover:text-red-300"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <LogOut size={18} />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
