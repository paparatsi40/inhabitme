import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getTranslations } from 'next-intl/server';
import { 
  ArrowLeft, HelpCircle, Home, Search, CreditCard, 
  Shield, MessageCircle, Calendar
} from 'lucide-react';

export default async function FAQPage() {
  const t = await getTranslations('faq');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-blue-200 rounded-2xl mb-6">
            <HelpCircle className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas rápidas a las preguntas más comunes sobre inhabitme
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          
          {/* General */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">General</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="q1" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Qué es inhabitme?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  inhabitme es una plataforma especializada en estancias medias (1-6 meses) para trabajadores remotos y nómadas digitales. 
                  Conectamos hosts con espacios verificados con guests que buscan alojamiento de calidad con WiFi rápido y espacios de trabajo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿En qué se diferencia de Airbnb o Booking?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Estamos especializados en estancias medias (no noches cortas). Verificamos WiFi, tenemos precios transparentes sin sorpresas, 
                  y cobramos una tarifa única (€79-239) según la duración de la estancia, no comisiones mensuales.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿En qué ciudades están disponibles?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Actualmente tenemos propiedades en Madrid, Barcelona, Valencia, Sevilla, Málaga, Lisboa y otras ciudades principales de España y Portugal. 
                  Estamos expandiéndonos constantemente a nuevas ubicaciones.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Para Guests */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Para Guests (Inquilinos)</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="g1" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cómo funciona el proceso de reserva?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  1) Busca y encuentra tu alojamiento ideal. 2) Solicita una reserva con tus fechas. 3) El host revisa y aprueba tu solicitud. 
                  4) Pagas de forma segura. 5) Recibes los detalles de acceso antes de tu llegada.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="g2" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cuánto cuesta usar inhabitme?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Cobramos una tarifa de servicio única según la duración: €79 (1-2 meses), €139 (3-4 meses), o €239 (5-6 meses). 
                  Sin comisiones mensuales, sin costos ocultos. El precio que ves es el precio final.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="g3" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Qué incluye el alojamiento?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Todos los alojamientos incluyen WiFi verificado (mínimo 50 Mbps), espacio de trabajo, y amenidades básicas. 
                  Algunos incluyen servicios adicionales como limpieza, coworking, o gimnasio. Revisa cada listado para detalles específicos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="g4" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Puedo cancelar mi reserva?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Sí. La política de cancelación depende de cada host. Generalmente: cancelación gratuita hasta 30 días antes, 
                  50% de reembolso hasta 14 días antes, sin reembolso después. Revisa la política específica antes de reservar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Para Hosts */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Para Hosts (Propietarios)</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="h1" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cuánto cobra inhabitme a los hosts?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Cobramos un 3% del valor total de la reserva al host. Esto es significativamente menor que otras plataformas 
                  que cobran 15-20%. Recibes el pago 24 horas después de que el guest se haya registrado.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="h2" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cómo publicar mi propiedad?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  1) Crea una cuenta gratuita. 2) Completa el formulario con detalles de tu propiedad. 3) Sube fotos de calidad. 
                  4) Verifica tu WiFi. 5) Publicamos tu listado en 24-48 horas después de revisión.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="h3" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Qué requisitos debe cumplir mi propiedad?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Requisitos mínimos: WiFi >50 Mbps verificado, espacio de trabajo dedicado, disponibilidad mínima de 1 mes, 
                  fotos de calidad, descripción completa, y precio competitivo. Propiedades con mejores amenidades reciben más reservas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="h4" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cómo recibo los pagos?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Los pagos se procesan de forma segura a través de Stripe. Recibes tu pago (menos la comisión del 3%) 
                  24 horas después de que el guest se haya registrado en tu propiedad. Los fondos llegan directamente a tu cuenta bancaria.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Pagos y Seguridad */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Pagos y Seguridad</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="p1" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Es seguro pagar a través de inhabitme?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Absolutamente. Todos los pagos se procesan a través de Stripe, uno de los procesadores de pago más seguros del mundo. 
                  Nunca almacenamos tu información de tarjeta de crédito. Tus datos están encriptados y protegidos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="p2" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Qué métodos de pago aceptan?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express), 
                  así como transferencias bancarias SEPA para estancias más largas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="p3" className="bg-white border-2 border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Qué pasa si hay un problema con la propiedad?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Si la propiedad no cumple con lo prometido, contáctanos inmediatamente. Tenemos un equipo de soporte 
                  disponible para mediar y resolver cualquier problema. En casos graves, ofrecemos reembolsos o reubicación.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-black mb-3">
            ¿No encuentras tu respuesta?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contactar Soporte
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
