/**
 * Sentry tunnel route — bypassea ad-blockers reenviando eventos del cliente
 * al endpoint real de Sentry desde nuestro propio dominio.
 *
 * El SDK del cliente envía POSTs a /monitoring?o=ORG_ID&p=PROJECT_ID&r=REGION
 * Aquí los reenviamos al endpoint correspondiente de ingest.us.sentry.io.
 *
 * El middleware (middleware.ts) ya excluye /monitoring del redirect de next-intl.
 *
 * Ref: https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option
 */

import { NextRequest, NextResponse } from 'next/server'

// Run on Edge runtime for low latency forwarding (no cold starts)
export const runtime = 'edge'

// El project ID del DSN — debe coincidir con el proyecto configurado.
// Solo aceptamos forwarding a este project para evitar abuse del tunnel.
const ALLOWED_PROJECT_IDS = new Set([
  '4511315217285120', // inhabitme
])

const ALLOWED_HOSTS = new Set([
  'o4511311397060608.ingest.us.sentry.io',
  'o4511311397060608.ingest.de.sentry.io',
])

export async function POST(request: NextRequest) {
  try {
    // Leer el envelope (body raw, no JSON parseable directamente)
    const envelopeBytes = await request.arrayBuffer()
    const envelopeText = new TextDecoder().decode(envelopeBytes)

    // El primer line del envelope es un JSON con el `dsn` header
    const firstLine = envelopeText.split('\n', 1)[0]
    const header = JSON.parse(firstLine)
    const dsnUrl = header?.dsn
    if (typeof dsnUrl !== 'string') {
      return NextResponse.json({ error: 'Missing DSN in envelope' }, { status: 400 })
    }

    const dsn = new URL(dsnUrl)
    const projectId = dsn.pathname.replace(/^\//, '')

    // Validar destino
    if (!ALLOWED_HOSTS.has(dsn.host)) {
      return NextResponse.json({ error: 'Unauthorized host' }, { status: 403 })
    }
    if (!ALLOWED_PROJECT_IDS.has(projectId)) {
      return NextResponse.json({ error: 'Unauthorized project' }, { status: 403 })
    }

    // Reenviar al endpoint real de Sentry
    const upstreamUrl = `https://${dsn.host}/api/${projectId}/envelope/`
    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      body: envelopeBytes,
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
      },
    })

    // Pasar la respuesta tal cual (Sentry devuelve { id: '...' })
    const responseBody = await upstream.text()
    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Tunnel error', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
