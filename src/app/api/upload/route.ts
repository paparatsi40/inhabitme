import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

// Carpetas permitidas dentro del bucket. `folder` llega del cliente, asi que no
// puede pasar en crudo al path: se elige de esta lista o se rechaza.
const ALLOWED_FOLDERS = ['uploads', 'listing-logos', 'listing-backgrounds'] as const

// MIME permitidos y su extension canonica. SVG queda FUERA a proposito: se
// sirve desde la URL publica de Supabase y puede ejecutar script (XSS
// almacenado en ese dominio).
const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Limite por usuario: cada peticion escribe hasta 10MB en el bucket, y la
    // sesion de Clerk no es por si sola un limite de volumen.
    const { success: withinLimit } = await rateLimit(`user:${userId}`, 20, 60)
    if (!withinLimit) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const requestedFolder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validar carpeta contra la whitelist (nunca interpolar el valor recibido)
    if (!ALLOWED_FOLDERS.includes(requestedFolder as (typeof ALLOWED_FOLDERS)[number])) {
      return NextResponse.json(
        { error: 'Invalid folder' },
        { status: 400 }
      )
    }
    const folder = requestedFolder

    // Validar tipo de archivo contra la whitelist
    const fileExt = ALLOWED_MIME[file.type]
    if (!fileExt) {
      return NextResponse.json(
        { error: 'Unsupported image type. Allowed: JPEG, PNG, WebP, AVIF' },
        { status: 400 }
      )
    }

    // Validar tamaño (max 10MB)
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be between 1 byte and 10MB' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Nombre único. La extension sale del MIME ya validado, no de file.name:
    // asi el nombre que manda el cliente nunca toca el path.
    const fileName = `${userId.replace(/[^a-zA-Z0-9_-]/g, '')}_${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Convertir File a ArrayBuffer y luego a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[Upload API] Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image', code: 'upload_failed' },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath)

    console.log('[Upload API] ✅ Image uploaded:', publicUrlData.publicUrl)

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    })

  } catch (error) {
    console.error('[Upload API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
