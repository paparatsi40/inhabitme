import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft, FileText, AlertCircle, Scale, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Servicio | inhabitme',
  description: 'Términos y condiciones de uso de la plataforma inhabitme. Lee nuestras reglas y políticas antes de usar el servicio.',
};

export default function TermsPage() {
  const lastUpdated = 'Enero 13, 2026';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
              Términos de Servicio
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Última actualización: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-8">
            <p className="text-gray-800 leading-relaxed m-0">
              Bienvenido a <strong>inhabitme</strong>. Al acceder o usar nuestra plataforma, aceptas estos 
              Términos de Servicio. Por favor, léelos cuidadosamente.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">1. Aceptación de Términos</h2>
            </div>
            
            <p className="text-gray-700">
              Al registrarte, acceder o usar inhabitme, confirmas que:
            </p>
            
            <ul className="space-y-2 text-gray-700">
              <li>Tienes al menos 18 años de edad</li>
              <li>Tienes capacidad legal para celebrar contratos</li>
              <li>Aceptas cumplir con estos Términos y todas las leyes aplicables</li>
              <li>Proporcionarás información veraz y actualizada</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
            
            <p className="text-gray-700 mb-4">
              inhabitme es una plataforma que conecta anfitriones que ofrecen alojamientos de mediano plazo 
              con huéspedes (principalmente nómadas digitales y trabajadores remotos).
            </p>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 m-0">inhabitme actúa como intermediario:</h3>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Facilitamos la conexión entre anfitriones y huéspedes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Procesamos pagos de forma segura a través de Stripe</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No somos parte del contrato de arrendamiento entre anfitrión y huésped</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cuentas de Usuario</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Registro</h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>Debes proporcionar información precisa y completa</li>
              <li>Mantendrás tu contraseña segura y confidencial</li>
              <li>Eres responsable de toda actividad en tu cuenta</li>
              <li>Notificarás inmediatamente cualquier uso no autorizado</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Suspensión y Terminación</h3>
            <p className="text-gray-700">
              Nos reservamos el derecho de suspender o terminar tu cuenta si:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Violas estos Términos</li>
              <li>Proporcionas información falsa</li>
              <li>Participas en actividades fraudulentas</li>
              <li>Recibes múltiples quejas de otros usuarios</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades de Anfitriones</h2>
            
            <p className="text-gray-700 mb-4">Como anfitrión, te comprometes a:</p>
            
            <ul className="space-y-2 text-gray-700">
              <li>Proporcionar descripciones precisas de tu propiedad</li>
              <li>Cumplir con todas las leyes locales (licencias, impuestos, zonificación)</li>
              <li>Mantener estándares de calidad y limpieza</li>
              <li>Responder de manera oportuna a las consultas</li>
              <li>Respetar la privacidad de los huéspedes</li>
              <li>No discriminar por raza, religión, género, nacionalidad, etc.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilidades de Huéspedes</h2>
            
            <p className="text-gray-700 mb-4">Como huésped, te comprometes a:</p>
            
            <ul className="space-y-2 text-gray-700">
              <li>Tratar la propiedad con respeto y cuidado</li>
              <li>Cumplir con las reglas de la casa establecidas por el anfitrión</li>
              <li>Comunicar de manera respetuosa y honesta</li>
              <li>Reportar cualquier problema o daño inmediatamente</li>
              <li>Pagar todas las tarifas acordadas a tiempo</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Pagos y Tarifas</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Procesamiento de Pagos</h3>
            <p className="text-gray-700 mb-4">
              Todos los pagos se procesan a través de Stripe. inhabitme cobra una comisión por facilitar 
              la conexión entre anfitriones y huéspedes.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Comisiones</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Huéspedes:</strong> Pagan una tarifa de servicio por cada lead generado</li>
              <li><strong>Anfitriones:</strong> Los leads te llegan directamente al email sin comisión adicional</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Reembolsos</h3>
            <p className="text-gray-700">
              Las tarifas de servicio de inhabitme no son reembolsables una vez que se ha facilitado 
              el contacto. Disputas sobre el alojamiento deben resolverse directamente entre anfitrión y huésped.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
            
            <p className="text-gray-700 mb-4">
              Todo el contenido de inhabitme (diseño, código, marca, logo) es propiedad de inhabitme o 
              sus licenciantes. No puedes copiar, modificar o distribuir nuestro contenido sin permiso.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Contenido de Usuario</h3>
            <p className="text-gray-700">
              Al publicar contenido (fotos, descripciones), nos otorgas una licencia mundial, no exclusiva 
              y libre de regalías para usar, mostrar y distribuir ese contenido en nuestra plataforma.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitación de Responsabilidad</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 m-0 mb-2">IMPORTANTE</h3>
                  <p className="text-gray-700 m-0 mb-3">
                    inhabitme actúa únicamente como intermediario. No somos responsables de:
                  </p>
                  <ul className="space-y-1 text-gray-700 text-sm mb-0">
                    <li>• Calidad, seguridad o legalidad de las propiedades</li>
                    <li>• Veracidad de las descripciones de anfitriones</li>
                    <li>• Comportamiento de anfitriones o huéspedes</li>
                    <li>• Daños, pérdidas o lesiones durante la estancia</li>
                    <li>• Disputas entre anfitriones y huéspedes</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mt-4">
              En ningún caso inhabitme será responsable por daños indirectos, incidentales o 
              consecuentes. Nuestra responsabilidad máxima está limitada al monto pagado por los 
              servicios en los últimos 12 meses.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disputas y Resolución</h2>
            
            <p className="text-gray-700 mb-4">
              Cualquier disputa relacionada con estos Términos se regirá por las leyes de España. 
              Aceptas intentar resolver disputas de buena fe antes de iniciar procedimientos legales.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Jurisdicción</h3>
            <p className="text-gray-700">
              Para cualquier disputa que no pueda resolverse amigablemente, las partes se someten 
              a la jurisdicción de los tribunales de Madrid, España.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cambios a los Términos</h2>
            
            <p className="text-gray-700">
              Podemos modificar estos Términos ocasionalmente. Te notificaremos cambios significativos 
              por email o mediante aviso en la plataforma. El uso continuado después de los cambios 
              constituye tu aceptación.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Disposiciones Generales</h2>
            
            <ul className="space-y-2 text-gray-700">
              <li><strong>Divisibilidad:</strong> Si alguna disposición es inválida, el resto permanece en vigor</li>
              <li><strong>No renuncia:</strong> La falta de ejercicio de un derecho no constituye renuncia</li>
              <li><strong>Cesión:</strong> No puedes ceder estos Términos sin nuestro consentimiento</li>
              <li><strong>Acuerdo completo:</strong> Estos Términos constituyen el acuerdo completo entre las partes</li>
            </ul>
          </section>

          {/* Contact */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600 p-6 rounded-r-xl mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-2 m-0">¿Preguntas sobre los Términos?</h3>
            <p className="text-gray-700 mb-3 text-base">
              Si tienes dudas sobre estos Términos de Servicio, contáctanos:
            </p>
            <p className="text-sm m-0">
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@inhabitme.com" className="text-purple-600 hover:text-purple-700">
                legal@inhabitme.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
