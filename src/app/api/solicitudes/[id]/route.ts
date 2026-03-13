import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BookingRequest } from '@/types/api.types'
import { randomUUID } from 'crypto'

const DATA_FILE = path.join(process.cwd(), 'data', 'solicitudes.json')

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const solicitudes: BookingRequest[] = JSON.parse(fileContent)
    
    const solicitud = solicitudes.find(s => s.id === id)
    
    if (!solicitud) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: solicitud
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al cargar la solicitud' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const solicitudes: BookingRequest[] = JSON.parse(fileContent)
    
    const index = solicitudes.findIndex(s => s.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }
    
    if (body.action === 'confirm') {
      const token = randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 48)
      
      solicitudes[index] = {
        ...solicitudes[index],
        status: 'confirmed',
        checkinToken: token,
        tokenExpiresAt: expiresAt.toISOString()
      }
    } else if (body.action === 'reject') {
      solicitudes[index] = {
        ...solicitudes[index],
        status: 'rejected'
      }
    } else if (body.checkinCompletedAt) {
      solicitudes[index] = {
        ...solicitudes[index],
        checkinCompletedAt: body.checkinCompletedAt
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Acción no válida' },
        { status: 400 }
      )
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(solicitudes, null, 2), 'utf-8')
    
    return NextResponse.json({
      success: true,
      data: solicitudes[index]
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la solicitud' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const solicitudes: BookingRequest[] = JSON.parse(fileContent)
    
    const index = solicitudes.findIndex(s => s.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }
    
    solicitudes.splice(index, 1)
    
    await fs.writeFile(DATA_FILE, JSON.stringify(solicitudes, null, 2), 'utf-8')
    
    return NextResponse.json({
      success: true,
      data: null
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la solicitud' },
      { status: 500 }
    )
  }
}
