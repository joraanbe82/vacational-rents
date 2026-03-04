'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else if (result?.ok) {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          Panel de Administración
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem' }}>
          Inicia sesión para acceder al panel de control
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@vacational-rents.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%',
                height: '2.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #e2e8f0',
                background: 'white',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%',
                height: '2.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #e2e8f0',
                background: 'white',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '2.5rem',
              background: '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div style={{
            padding: '1rem',
            background: '#f1f5f9',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: '#475569'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '0.25rem', margin: 0 }}>Credenciales de demostración:</p>
            <p style={{ margin: '0.25rem 0' }}>Email: admin@vacational-rents.com</p>
            <p style={{ margin: '0.25rem 0' }}>Contraseña: admin123</p>
          </div>
        </form>
      </div>
    </div>
  )
}
