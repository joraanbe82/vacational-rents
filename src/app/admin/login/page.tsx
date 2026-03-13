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
    <div className="min-h-screen bg-golden-glow flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-deep-espresso mb-2">
          Panel de Administración
        </h1>
        <p className="text-sm text-dusty-cocoa mb-8">
          Inicia sesión para acceder al panel de control
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-deep-espresso">
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
              className="w-full h-10 rounded-md border border-warm-sand bg-white px-3 text-sm text-deep-espresso focus:outline-none focus:ring-2 focus:ring-dusty-cocoa focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-deep-espresso">
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
              className="w-full h-10 rounded-md border border-warm-sand bg-white px-3 text-sm text-deep-espresso focus:outline-none focus:ring-2 focus:ring-dusty-cocoa focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-dusty-cocoa hover:bg-warm-sand text-white rounded-md text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div className="p-4 bg-soft-oatmeal rounded-md text-xs text-dusty-cocoa">
            <p className="font-semibold mb-1">Credenciales de demostración:</p>
            <p className="my-1">Email: admin@vacational-rents.com</p>
            <p className="my-1">Contraseña: admin123</p>
          </div>
        </form>
      </div>
    </div>
  )
}
