'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-golden-glow">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-soft-oatmeal border-t-dusty-cocoa rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dusty-cocoa">Cargando...</p>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="flex h-screen bg-golden-glow">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
