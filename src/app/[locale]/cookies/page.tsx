import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies | inhabitme',
  description: 'Información sobre el uso de cookies en inhabitme y cómo gestionarlas.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <Cookie className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">Política de Cookies</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 lead">
            inhabitme utiliza cookies para mejorar tu experiencia. Esta política explica qué son las cookies, 
            cómo las usamos y cómo puedes controlarlas.
          </p>

          <h2>¿Qué son las Cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.</p>

          <h2>Cookies que Usamos</h2>
          
          <h3>Esenciales (Necesarias)</h3>
          <ul>
            <li><strong>Autenticación:</strong> Mantienen tu sesión activa (Clerk)</li>
            <li><strong>Seguridad:</strong> Protegen contra CSRF y ataques</li>
          </ul>

          <h3>Funcionales</h3>
          <ul>
            <li><strong>Preferencias:</strong> Idioma, configuración de UI</li>
            <li><strong>Búsquedas:</strong> Guardan tus filtros de búsqueda</li>
          </ul>

          <h3>Analíticas</h3>
          <ul>
            <li><strong>Analytics:</strong> Entender cómo usas la plataforma (anónimo)</li>
          </ul>

          <h2>Gestionar Cookies</h2>
          <p>Puedes controlar cookies desde tu navegador. Ten en cuenta que bloquear cookies esenciales puede afectar la funcionalidad.</p>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-r-lg">
            <p className="m-0">
              <strong>¿Preguntas?</strong> Contáctanos en{' '}
              <a href="mailto:privacy@inhabitme.com" className="text-orange-600 hover:text-orange-700">
                privacy@inhabitme.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
