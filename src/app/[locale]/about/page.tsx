import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Heart, Target, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | inhabitme',
  description: 'Conoce la historia de inhabitme y nuestra misión de conectar nómadas digitales con alojamientos perfectos.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900">Sobre inhabitme</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mt-0">Nuestra Misión</h2>
            <p className="text-gray-700 text-lg mb-0">
              Hacer que encontrar el hogar perfecto para trabajar remoto sea simple, transparente y confiable.
            </p>
          </div>

          <h2>El Problema que Resolvemos</h2>
          <p>
            Los nómadas digitales y trabajadores remotos enfrentan un desafío único: necesitan alojamientos 
            de mediano plazo (1-6 meses) con <strong>WiFi confiable</strong> y <strong>espacios de trabajo adecuados</strong>. 
            Las plataformas tradicionales no están diseñadas para esto.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">WiFi Verificado</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">
                Todos los alojamientos tienen velocidad de internet confirmada, crucial para trabajo remoto.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">Estancias Medias</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">
                Enfocados en 1-12 meses, el sweet spot para nómadas digitales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">Comunidad</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">
                Conectamos anfitriones que entienden las necesidades de los remotos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">Sin Sorpresas</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">
                Descripciones honestas, fotos reales, comunicación directa.
              </p>
            </div>
          </div>

          <h2>Cómo Funciona</h2>
          <ol>
            <li><strong>Huéspedes buscan</strong> alojamientos filtrados por ciudad, precio, WiFi</li>
            <li><strong>Encuentran el perfecto</strong> con toda la información clara</li>
            <li><strong>Contactan al anfitrión</strong> directamente (no intermediarios)</li>
            <li><strong>Acuerdan directamente</strong> contrato, fechas, detalles</li>
          </ol>

          <h2>Por Qué inhabitme</h2>
          <ul>
            <li>✅ <strong>Transparencia total:</strong> Precios claros, sin tarifas ocultas</li>
            <li>✅ <strong>Enfocados en remotos:</strong> Entendemos tus necesidades específicas</li>
            <li>✅ <strong>Verificación:</strong> WiFi, espacios de trabajo, amenities confirmados</li>
            <li>✅ <strong>Directo al anfitrión:</strong> Sin intermediarios innecesarios</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mt-10">
            <h2 className="text-white mt-0">¿Listo para Encontrar tu Próximo Hogar?</h2>
            <p className="text-blue-100 mb-6">
              Miles de alojamientos verificados esperándote en las mejores ciudades para nómadas digitales.
            </p>
            <Link href="/search">
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition">
                Explorar Alojamientos →
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
