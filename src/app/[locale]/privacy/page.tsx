import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | inhabitme',
  description: 'Política de privacidad y protección de datos de inhabitme. Información sobre cómo recopilamos, usamos y protegemos tus datos personales.',
};

export default function PrivacyPage() {
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
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
              Política de Privacidad
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
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
            <p className="text-gray-800 leading-relaxed m-0">
              En <strong>inhabitme</strong>, tu privacidad es fundamental. Esta política explica cómo recopilamos, 
              usamos, compartimos y protegemos tu información personal cuando usas nuestra plataforma.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">1. Información que Recopilamos</h2>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1 Información que Proporcionas</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Cuenta:</strong> Nombre, email, contraseña (encriptada)</li>
              <li><strong>Perfil:</strong> Foto, biografía, preferencias de alojamiento</li>
              <li><strong>Propiedades:</strong> Si eres anfitrión, información sobre tus alojamientos</li>
              <li><strong>Comunicaciones:</strong> Mensajes con anfitriones o huéspedes</li>
              <li><strong>Pagos:</strong> Información procesada por Stripe (nunca almacenamos datos completos de tarjetas)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.2 Información Automática</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Uso:</strong> Páginas visitadas, búsquedas realizadas, clics</li>
              <li><strong>Dispositivo:</strong> Tipo de navegador, sistema operativo, dirección IP</li>
              <li><strong>Cookies:</strong> Para mejorar tu experiencia (ver <Link href="/cookies" className="text-blue-600 hover:text-blue-700">Política de Cookies</Link>)</li>
              <li><strong>Analytics:</strong> Datos agregados y anónimos para mejorar el servicio</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">2. Cómo Usamos tu Información</h2>
            </div>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Proporcionar el servicio:</strong> Conectar anfitriones con huéspedes, procesar pagos, facilitar comunicaciones</span>
              </li>
              <li className="flex items-start gap-2">
                <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Mejorar la plataforma:</strong> Analizar uso, optimizar búsquedas, desarrollar nuevas funcionalidades</span>
              </li>
              <li className="flex items-start gap-2">
                <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Comunicaciones:</strong> Enviarte confirmaciones, actualizaciones importantes, newsletter (puedes cancelar en cualquier momento)</span>
              </li>
              <li className="flex items-start gap-2">
                <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Seguridad:</strong> Prevenir fraude, proteger tu cuenta, cumplir con la ley</span>
              </li>
              <li className="flex items-start gap-2">
                <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Personalización:</strong> Recomendaciones basadas en tus preferencias y búsquedas</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">3. Compartir Información</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              <strong>Nunca vendemos tus datos.</strong> Solo compartimos información cuando es necesario:
            </p>
            
            <ul className="space-y-3 text-gray-700">
              <li><strong>Con anfitriones/huéspedes:</strong> Información necesaria para la reserva (nombre, email, fechas)</li>
              <li><strong>Proveedores de servicios:</strong> Stripe (pagos), Clerk (autenticación), Supabase (base de datos), Cloudinary (imágenes)</li>
              <li><strong>Cumplimiento legal:</strong> Si lo requiere la ley, orden judicial o autoridad competente</li>
              <li><strong>Protección:</strong> Para prevenir fraude, proteger derechos o seguridad</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Tus Derechos (GDPR)</h2>
            
            <p className="text-gray-700 mb-4">Bajo el GDPR, tienes derecho a:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">✓ Acceder</h4>
                <p className="text-sm text-gray-600 m-0">Solicitar copia de tus datos personales</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">✓ Rectificar</h4>
                <p className="text-sm text-gray-600 m-0">Corregir datos inexactos o incompletos</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">✓ Eliminar</h4>
                <p className="text-sm text-gray-600 m-0">Solicitar eliminación de tus datos</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">✓ Portabilidad</h4>
                <p className="text-sm text-gray-600 m-0">Recibir tus datos en formato portátil</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">✓ Oposición</h4>
                <p className="text-sm text-gray-600 m-0">Oponerte al procesamiento de tus datos</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">✓ Restricción</h4>
                <p className="text-sm text-gray-600 m-0">Limitar cómo usamos tus datos</p>
              </div>
            </div>
            
            <p className="text-gray-700 mt-6">
              Para ejercer estos derechos, contáctanos en{' '}
              <a href="mailto:privacy@inhabitme.com" className="text-blue-600 hover:text-blue-700 font-medium">
                privacy@inhabitme.com
              </a>
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de Datos</h2>
            
            <p className="text-gray-700 mb-4">Implementamos medidas de seguridad robustas:</p>
            
            <ul className="space-y-2 text-gray-700">
              <li>🔒 <strong>Encriptación:</strong> HTTPS/TLS en todas las comunicaciones</li>
              <li>🔒 <strong>Contraseñas:</strong> Hasheadas con bcrypt, nunca almacenadas en texto plano</li>
              <li>🔒 <strong>Acceso limitado:</strong> Solo personal autorizado puede acceder a datos sensibles</li>
              <li>🔒 <strong>Monitoreo:</strong> Sistemas de detección de intrusiones y alertas</li>
              <li>🔒 <strong>Backups:</strong> Copias de seguridad cifradas y regulares</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retención de Datos</h2>
            
            <p className="text-gray-700">
              Conservamos tu información personal mientras tu cuenta esté activa o según sea necesario 
              para proporcionar servicios. Puedes solicitar la eliminación de tu cuenta en cualquier momento. 
              Algunos datos pueden retenerse por razones legales (ej: registros fiscales) según lo requiera la ley.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies y Tecnologías Similares</h2>
            
            <p className="text-gray-700">
              Usamos cookies para mejorar tu experiencia. Consulta nuestra{' '}
              <Link href="/cookies" className="text-blue-600 hover:text-blue-700 font-medium">
                Política de Cookies
              </Link>{' '}
              para más información sobre qué cookies usamos y cómo controlarlas.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferencias Internacionales</h2>
            
            <p className="text-gray-700">
              Tus datos pueden ser procesados en servidores ubicados en la Unión Europea y Estados Unidos. 
              Todos nuestros proveedores cumplen con GDPR o están cubiertos por mecanismos de transferencia 
              aprobados (ej: Standard Contractual Clauses).
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Edad</h2>
            
            <p className="text-gray-700">
              inhabitme no está dirigido a menores de 18 años. No recopilamos intencionadamente información 
              de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cambios a esta Política</h2>
            
            <p className="text-gray-700">
              Podemos actualizar esta política ocasionalmente. Te notificaremos cambios significativos por 
              email o mediante un aviso destacado en la plataforma. El uso continuado del servicio después 
              de los cambios constituye tu aceptación de la nueva política.
            </p>
          </section>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6 rounded-r-xl mt-12">
            <div className="flex items-start gap-3">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 m-0">¿Preguntas sobre Privacidad?</h3>
                <p className="text-gray-700 mb-3 text-base">
                  Si tienes preguntas sobre esta política o sobre cómo manejamos tus datos, contáctanos:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="m-0">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@inhabitme.com" className="text-blue-600 hover:text-blue-700">
                      privacy@inhabitme.com
                    </a>
                  </p>
                  <p className="m-0">
                    <strong>Responsable:</strong> inhabitme, Madrid, España
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
