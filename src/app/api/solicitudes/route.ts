import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BookingRequest } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'solicitudes.json')

function generateSolicitudId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'SOL-2026-'
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const solicitudes: BookingRequest[] = JSON.parse(fileContent)
    
    const sorted = solicitudes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: sorted
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al cargar las solicitudes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.propertyId || !body.propertyName || !body.checkInDate || !body.checkOutDate || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const solicitudes: BookingRequest[] = JSON.parse(fileContent)
    
    const newSolicitud: BookingRequest = {
      id: generateSolicitudId(),
      propertyId: body.propertyId,
      propertyName: body.propertyName,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      nights: body.nights || 0,
      email: body.email,
      phone: body.phone,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    
    solicitudes.push(newSolicitud)
    
    await fs.writeFile(DATA_FILE, JSON.stringify(solicitudes, null, 2), 'utf-8')
    
    return NextResponse.json(
      { success: true, data: newSolicitud },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear la solicitud' },
      { status: 500 }
    )
  }
}
