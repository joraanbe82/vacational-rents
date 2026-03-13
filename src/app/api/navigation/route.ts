import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { NavigationData, NavigationResponse } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'navigation.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const data: NavigationData = JSON.parse(fileContent)
    
    const response: NavigationResponse = {
      success: true,
      data
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: NavigationResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al leer la configuración de navegación'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.items || !Array.isArray(body.items)) {
      const response: NavigationResponse = {
        success: false,
        error: 'Formato de datos inválido'
      }
      return NextResponse.json(response, { status: 400 })
    }

    for (const item of body.items) {
      if (!item.id || !item.label || !item.href || typeof item.visible !== 'boolean' || typeof item.protected !== 'boolean') {
        const response: NavigationResponse = {
          success: false,
          error: 'Cada item debe tener id, label, href, visible y protected'
        }
        return NextResponse.json(response, { status: 400 })
      }
    }

    const data: NavigationData = body
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    
    const response: NavigationResponse = {
      success: true,
      data
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: NavigationResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al guardar la configuración de navegación'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}
