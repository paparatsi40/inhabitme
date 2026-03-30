'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, ArrowRight, Copy, Check } from 'lucide-react'

export default function LeadSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams?.get('session_id')
  const propertyId = searchParams?.get('property_id')
  
  const [loading, setLoading] = useState(true)
  const [hostEmail, setHostEmail] = useState<string | null>(null)
  const [propertyTitle, setPropertyTitle] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId || !propertyId) {
      setError('Sesión inválida')
      setLoading(false)
      return
    }

    // Verificar el pago y obtener email del host
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/leads/verify-payment?session_id=${sessionId}&property_id=${propertyId}`)
        const data = await response.json()

        if (data.success && data.hostEmail) {
          setHostEmail(data.hostEmail)
          setPropertyTitle(data.propertyTitle || 'esta propiedad')
        } else {
          setError('No se pudo verificar el pago')
        }
      } catch (err) {
        console.error('Error verifying payment:', err)
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, propertyId])

  const copyEmail = () => {
    if (hostEmail) {
      navigator.clipboard.writeText(hostEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  if (error || !hostEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'No se pudo obtener la información del anfitrión'}</p>
          <Link href="/search">
            <Button>Volver a búsqueda</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header de éxito */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Pago Exitoso!</h1>
          <p className="text-green-100">
            Ya puedes contactar directamente al anfitrión
          </p>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          {/* Email del host */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Email del Anfitrión</h2>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <span className="flex-1 font-mono text-lg text-blue-900 break-all">
                {hostEmail}
              </span>
              <Button
                onClick={copyEmail}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg mb-4">📋 Próximos pasos:</h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                  1
                </span>
                <span>
                  <strong>Envía un email al anfitrión</strong> presentándote brevemente y mencionando que vienes de inhabitme
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                  2
                </span>
                <span>
                  <strong>Menciona tus fechas</strong> de estancia y cualquier pregunta específica sobre la propiedad
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                  3
                </span>
                <span>
                  <strong>Coordina una visita</strong> (virtual o presencial) y detalles del contrato directamente con el anfitrión
                </span>
              </li>
            </ol>
          </div>

          {/* Plantilla de email sugerida */}
          <details className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600">
              💡 Ver plantilla de email sugerida
            </summary>
            <div className="mt-4 p-4 bg-white rounded border border-gray-200 text-sm text-gray-700 font-mono">
              <p className="mb-2">Hola,</p>
              <p className="mb-2">
                Me interesa {propertyTitle}. Vi tu propiedad en inhabitme y me gustaría saber más detalles.
              </p>
              <p className="mb-2">
                Estoy buscando alojamiento para [X meses] a partir de [fecha]. Soy [profesión/estudiante] y trabajo/estudio remotamente.
              </p>
              <p className="mb-2">
                ¿Estaría disponible para una visita [virtual/presencial]?
              </p>
              <p>Saludos,<br />[Tu nombre]</p>
            </div>
          </details>

          {/* CTAs finales */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/properties/${propertyId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver propiedad de nuevo
              </Button>
            </Link>
            <Link href="/search" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <ArrowRight className="h-4 w-4 mr-2" />
                Explorar más propiedades
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer con trust signal */}
        <div className="px-8 py-6 bg-gray-50 border-t text-center text-sm text-gray-600">
          <p>
            <strong className="text-gray-900">Nota:</strong> inhabitme no participa en la transacción final. 
            El contrato y pago del alquiler se negocian directamente entre tú y el anfitrión.
          </p>
        </div>
      </div>
    </div>
  )
}
