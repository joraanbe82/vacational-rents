import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { ContactInfo, ContactResponse } from '@/types/api.types'

const DATA_FILE = path.join(process.cwd(), 'data', 'contact.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const data: ContactInfo = JSON.parse(fileContent)
    
    const response: ContactResponse = {
      success: true,
      data
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: ContactResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al leer la información de contacto'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.email || !body.phone || !body.addressLine1 || !body.addressLine2 || !body.brandName || !body.copyright) {
      const response: ContactResponse = {
        success: false,
        error: 'Todos los campos son requeridos'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      const response: ContactResponse = {
        success: false,
        error: 'Formato de email inválido'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const data: ContactInfo = {
      email: body.email.trim(),
      phone: body.phone.trim(),
      addressLine1: body.addressLine1.trim(),
      addressLine2: body.addressLine2.trim(),
      brandName: body.brandName.trim(),
      copyright: body.copyright.trim()
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    
    const response: ContactResponse = {
      success: true,
      data
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: ContactResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error al guardar la información de contacto'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}
