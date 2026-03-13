import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { PageContent } from '@/types/api.types'

const VALID_SLUGS = ['guides', 'excursions', 'about', 'owners', 'contact'] as const
type ValidSlug = typeof VALID_SLUGS[number]

function getDataFilePath(slug: string): string {
  return path.join(process.cwd(), 'data', `page-${slug}.json`)
}

function isValidSlug(slug: string): slug is ValidSlug {
  return VALID_SLUGS.includes(slug as ValidSlug)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page slug' },
        { status: 400 }
      )
    }

    const filePath = getDataFilePath(slug)
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const pageContent: PageContent = JSON.parse(fileContent)
      
      return NextResponse.json({
        success: true,
        data: pageContent
      })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page slug' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    if (!body.hero || !body.sections || !body.cards || !body.contact || !body.seo) {
      return NextResponse.json(
        { success: false, error: 'Invalid page content structure' },
        { status: 400 }
      )
    }

    const pageContent: PageContent = {
      hero: body.hero,
      sections: body.sections,
      cards: body.cards,
      contact: body.contact,
      seo: body.seo
    }

    const filePath = getDataFilePath(slug)
    
    try {
      await fs.writeFile(filePath, JSON.stringify(pageContent, null, 2), 'utf-8')
      
      return NextResponse.json({
        success: true,
        data: pageContent
      })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to save page content' },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
