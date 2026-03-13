import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { CheckinRecord, GuestData } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'checkins.json')

function generateRegistrationId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'REG-2026-'
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const checkins: CheckinRecord[] = JSON.parse(fileContent)
    
    const sorted = checkins.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: sorted
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al cargar los registros' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.propertyId || !body.guests || !Array.isArray(body.guests) || body.guests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const checkins: CheckinRecord[] = JSON.parse(fileContent)
    
    const guestsWithIds: GuestData[] = body.guests.map((guest: GuestData, index: number) => ({
      ...guest,
      id: `GUEST-${Date.now()}-${index}`
    }))
    
    const newCheckin: CheckinRecord = {
      id: generateRegistrationId(),
      propertyId: body.propertyId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      guests: guestsWithIds,
      mainGuest: guestsWithIds[0].id
    }
    
    checkins.push(newCheckin)
    
    await fs.writeFile(DATA_FILE, JSON.stringify(checkins, null, 2), 'utf-8')
    
    return NextResponse.json(
      { success: true, data: newCheckin },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear el registro' },
      { status: 500 }
    )
  }
}
