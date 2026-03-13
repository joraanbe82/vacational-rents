'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, TrendingUp } from 'lucide-react'
import { RENTAL_PROPERTIES } from '@/lib/data'
import { ADMIN_RECENT_PROPERTIES_LIMIT } from '@/lib/constants'

export default function DashboardPage() {
  const totalProperties = RENTAL_PROPERTIES.length
  const totalGuests = RENTAL_PROPERTIES.reduce((sum, p) => sum + p.specs.guests, 0)
  const avgPrice = Math.round(
    RENTAL_PROPERTIES.reduce((sum, p) => sum + p.price, 0) / totalProperties
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-deep-espresso">Dashboard</h1>
        <p className="text-dusty-cocoa mt-2">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
            <Building2 className="h-4 w-4 text-dusty-cocoa" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-warm-sand mt-1">Propiedades registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
            <Users className="h-4 w-4 text-dusty-cocoa" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
            <p className="text-xs text-warm-sand mt-1">Huéspedes totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-dusty-cocoa" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPrice}€</div>
            <p className="text-xs text-warm-sand mt-1">Por noche</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Propiedades</CardTitle>
          <CardDescription>
            Las 3 propiedades más recientes del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RENTAL_PROPERTIES.slice(0, ADMIN_RECENT_PROPERTIES_LIMIT).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 border border-warm-sand rounded-lg bg-white"
              >
                <div>
                  <p className="font-semibold text-deep-espresso">{property.title}</p>
                  <p className="text-sm text-dusty-cocoa">{property.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-deep-espresso">{property.price}€</p>
                  <p className="text-sm text-dusty-cocoa">por noche</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
