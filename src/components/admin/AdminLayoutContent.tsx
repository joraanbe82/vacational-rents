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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #1e293b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#64748b' }}>Cargando...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
