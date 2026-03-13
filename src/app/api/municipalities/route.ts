import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Municipality, MunicipalityResponse, MunicipalityCreateRequest } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'municipalities.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const data: Municipality[] = JSON.parse(fileContent)
    
    const response: MunicipalityResponse = {
      success: true,
      data
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: MunicipalityResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al leer los municipios'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body: MunicipalityCreateRequest = await request.json()
    
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      const response: MunicipalityResponse = {
        success: false,
        error: 'El nombre del municipio es requerido'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const municipalities: Municipality[] = JSON.parse(fileContent)

    const maxId = municipalities.reduce((max, m) => Math.max(max, parseInt(m.id)), 0)
    const newMunicipality: Municipality = {
      id: (maxId + 1).toString(),
      name: body.name.trim(),
      createdAt: new Date().toISOString()
    }

    municipalities.push(newMunicipality)
    await fs.writeFile(DATA_FILE, JSON.stringify(municipalities, null, 2), 'utf-8')
    
    const response: MunicipalityResponse = {
      success: true,
      data: newMunicipality
    }
    
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: MunicipalityResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear el municipio'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}
