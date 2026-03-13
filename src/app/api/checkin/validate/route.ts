import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BookingRequest } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'solicitudes.json')

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token no proporcionado' },
        { status: 400 }
      )
    }
    
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const solicitudes: BookingRequest[] = JSON.parse(fileContent)
    
    const solicitud = solicitudes.find(s => s.checkinToken === token)
    
    if (!solicitud) {
      return NextResponse.json(
        { success: false, error: 'Token no válido' },
        { status: 404 }
      )
    }
    
    if (solicitud.tokenExpiresAt && new Date(solicitud.tokenExpiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Token expirado' },
        { status: 410 }
      )
    }
    
    if (solicitud.checkinCompletedAt) {
      return NextResponse.json(
        { success: false, error: 'Check-in ya completado' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        solicitudId: solicitud.id,
        propertyId: solicitud.propertyId,
        propertyName: solicitud.propertyName,
        checkInDate: solicitud.checkInDate,
        checkOutDate: solicitud.checkOutDate,
        nights: solicitud.nights,
        email: solicitud.email
      }
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al validar el token' },
      { status: 500 }
    )
  }
}
