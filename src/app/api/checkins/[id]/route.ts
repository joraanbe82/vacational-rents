import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { CheckinRecord } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'checkins.json')

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const checkins: CheckinRecord[] = JSON.parse(fileContent)
    
    const checkin = checkins.find(c => c.id === id)
    
    if (!checkin) {
      return NextResponse.json(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: checkin
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al cargar el registro' },
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
    
    if (!body.status || !['pending', 'confirmed', 'cancelled'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Estado inválido' },
        { status: 400 }
      )
    }
    
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const checkins: CheckinRecord[] = JSON.parse(fileContent)
    
    const index = checkins.findIndex(c => c.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      )
    }
    
    checkins[index] = {
      ...checkins[index],
      status: body.status
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(checkins, null, 2), 'utf-8')
    
    return NextResponse.json({
      success: true,
      data: checkins[index]
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el registro' },
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
    const checkins: CheckinRecord[] = JSON.parse(fileContent)
    
    const index = checkins.findIndex(c => c.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      )
    }
    
    checkins.splice(index, 1)
    
    await fs.writeFile(DATA_FILE, JSON.stringify(checkins, null, 2), 'utf-8')
    
    return NextResponse.json({
      success: true,
      data: null
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el registro' },
      { status: 500 }
    )
  }
}
