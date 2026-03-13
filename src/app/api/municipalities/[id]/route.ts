import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Municipality, MunicipalityResponse, MunicipalityUpdateRequest } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'municipalities.json')

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: MunicipalityUpdateRequest = await request.json()
    
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      const response: MunicipalityResponse = {
        success: false,
        error: 'El nombre del municipio es requerido'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const municipalities: Municipality[] = JSON.parse(fileContent)

    const index = municipalities.findIndex(m => m.id === id)
    if (index === -1) {
      const response: MunicipalityResponse = {
        success: false,
        error: 'Municipio no encontrado'
      }
      return NextResponse.json(response, { status: 404 })
    }

    municipalities[index] = {
      ...municipalities[index],
      name: body.name.trim()
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(municipalities, null, 2), 'utf-8')
    
    const response: MunicipalityResponse = {
      success: true,
      data: municipalities[index]
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: MunicipalityResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el municipio'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const municipalities: Municipality[] = JSON.parse(fileContent)

    const index = municipalities.findIndex(m => m.id === id)
    if (index === -1) {
      const response: MunicipalityResponse = {
        success: false,
        error: 'Municipio no encontrado'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const deleted = municipalities.splice(index, 1)[0]
    await fs.writeFile(DATA_FILE, JSON.stringify(municipalities, null, 2), 'utf-8')
    
    const response: MunicipalityResponse = {
      success: true,
      data: deleted
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: MunicipalityResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar el municipio'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}
