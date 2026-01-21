'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, MapPin, Wifi, Monitor, Bed, Bath, Home, 
  CheckCircle, X, Euro, Calendar, ArrowLeft, Share2, Mail, Lock, Clock
} from 'lucide-react';
import { Breadcrumbs, generateBreadcrumbSchema } from '@/components/ui/breadcrumbs';
import { TrustBadges } from '@/components/trust/TrustBadges';
import { ContactConfirmModal } from '@/components/leads/ContactConfirmModal';
import { BookingRequestModal } from '@/components/bookings/BookingRequestModal';
import { getLeadPrice, formatLeadPrice } from '@/lib/pricing/lead-pricing';
import { getPropertyStats } from '@/lib/analytics/activity';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activityStats, setActivityStats] = useState<any>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        if (!res.ok) throw new Error('Property not found');
        
        const result = await res.json();
        setProperty(result.data);
        
        // Calcular stats de actividad desde la propiedad cargada
        const stats = getPropertyStats(result.data);
        setActivityStats(stats);
      } catch (err) {
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  // Mostrar modal de confirmación primero
  const handleContactHost = () => {
    setShowConfirmModal(true);
  };

  // Confirmar y proceder al pago (después del modal)
  const handleConfirmAndPay = async () => {
    setCreatingCheckout(true);
    
    try {
      const res = await fetch('/api/leads/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: params.id,
          propertyTitle: property.title,
          city: property.city.name,
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout');

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout:', err);
      alert('Error al crear la sesión de pago. Por favor intenta de nuevo.');
    } finally {
      setCreatingCheckout(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <Building2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-6">La propiedad que buscas no existe o fue eliminada.</p>
          <Button onClick={() => router.push('/search')}>
            Buscar otras propiedades
          </Button>
        </div>
      </div>
    );
  }

  // Computed values (safe after null check)
  const propertyImages = (property.images && property.images.length > 0) ? property.images : [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
  ];

  const totalFor3Months = (property.price.monthly * 3) + (property.depositAmount || 0);
  const leadPricing = getLeadPrice(property.city.name || 'Madrid');
  const leadPrice = formatLeadPrice(leadPricing);

  // Breadcrumb items
  const breadcrumbItems = [{ name: property.city.name, href: `/${property.city.name.toLowerCase()}` }];
  if (property.neighborhood) {
    const slug = property.neighborhood.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    breadcrumbItems.push({ name: property.neighborhood.name, href: `/${property.city.name.toLowerCase()}/${slug}` });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Breadcrumbs con mejor contraste */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs
            items={breadcrumbItems}
            current={property.title}
          />
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems, property.title, `/properties/${params.id}`)),
        }}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* HERO PREMIUM - Con badges y micro-copy contextual */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {/* Badge contextual */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                <Monitor className="h-4 w-4" />
                Listo para trabajar remoto en {property.city.name}
              </div>
              
              {/* Título con mejor jerarquía */}
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                {property.title}
              </h1>
              
              {/* Ubicación destacada */}
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-base">{property.neighborhood && `${property.neighborhood.name}, `}{property.city.name}, {property.city.country}</span>
              </div>
              
              {/* Quick features CHIPS - Mejor diseñados */}
              <div className="flex flex-wrap gap-2">
                {property.amenities.wifiSpeedMbps && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-sm">
                    <Wifi className="h-4 w-4" />
                    WiFi {property.amenities.wifiSpeedMbps} Mbps
                  </div>
                )}
                {property.amenities.furnished && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Amueblado
                  </div>
                )}
                {property.amenities.hasDesk && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 font-medium text-sm">
                    <Monitor className="h-4 w-4" />
                    Escritorio
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 font-medium text-sm">
                  <Calendar className="h-4 w-4" />
                  {property.availability.minMonths}-{property.availability.maxMonths} meses
                </div>
              </div>
            </div>

            {/* GALERÍA PREMIUM - Con hover effects y mejor diseño */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              {propertyImages.length === 1 ? (
                <div className="relative overflow-hidden group">
                  <img
                    src={propertyImages[0]}
                    alt={property.title}
                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-3">
                  {/* Imagen principal - ocupa 2 columnas con overlay */}
                  <div className="col-span-2 relative overflow-hidden rounded-xl group cursor-pointer">
                    <img
                      src={propertyImages[0]}
                      alt={property.title}
                      className="w-full h-72 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    {/* Badge "Foto principal" */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                      📸 Foto principal
                    </div>
                  </div>
                  
                  {/* Imágenes secundarias con hover */}
                  {propertyImages.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-xl group cursor-pointer">
                      <img
                        src={img}
                        alt={`${property.title} - imagen ${idx + 2}`}
                        className="w-full h-40 lg:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      {/* Badge de número */}
                      {idx === 3 && propertyImages.length > 5 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <span className="text-white text-2xl font-bold">+{propertyImages.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features detalladas - Diseño tipo Airbnb */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Lo que ofrece este espacio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Habitaciones y baños */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Bed className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                    <p className="text-sm text-gray-600">Habitación{property.bedrooms > 1 ? 'es' : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Bath className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                    <p className="text-sm text-gray-600">Baño{property.bathrooms > 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                {/* Workspace features */}
                {property.hasDesk && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Monitor className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Escritorio</p>
                      <p className="text-sm text-gray-600">Para trabajar</p>
                    </div>
                  </div>
                )}
                
                {property.wifiSpeed && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Wifi className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{property.wifiSpeed} Mbps</p>
                      <p className="text-sm text-gray-600">WiFi verificado</p>
                    </div>
                  </div>
                )}
                
                {/* Más amenidades */}
                {property.hasSecondMonitor && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-200">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Monitor className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Monitor extra</p>
                      <p className="text-sm text-gray-600">Disponible</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description - Mejor legibilidad */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Sobre este espacio</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar PREMIUM (DESKTOP ONLY) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-4 space-y-6 border-2 border-blue-100 hover:shadow-2xl transition-shadow">
              
              {/* PRICING JERÁRQUICO - Diseño mejorado */}
              <div className="space-y-4">
                {/* Precio mensual - MÁS PROMINENTE */}
                <div className="pb-5 border-b-2 border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">Precio mensual</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      €{property.monthlyPrice?.toLocaleString()}
                    </p>
                    <span className="text-gray-500 text-lg">/mes</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Total {property.minStayMonths} meses: <strong>€{((property.monthlyPrice || 0) * (property.minStayMonths || 1)).toLocaleString()}</strong>
                  </p>
                </div>
                
                {/* Coste de reserva - Claridad visual */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Solo pagas cuando confirma</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-3xl font-bold text-purple-600">
                      €79-239
                    </p>
                    <span className="text-sm text-gray-600">+ mes 1 + depósito</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Fee según duración de estancia</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Cero riesgo
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Pago seguro
                  </div>
                </div>
              </div>

              {/* CTA PRINCIPAL - Más atractivo */}
              <Button 
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                size="lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Request to Book →
                </span>
              </Button>

              {/* Micro-copy de seguridad */}
              <div className="text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3 text-green-600" />
                  Pago 100% seguro con Stripe
                </p>
              </div>

              {/* Qué obtienes - Diseño mejorado */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  Cómo funciona
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700"><strong>Envía solicitud</strong> gratis (sin pagar)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Host <strong>acepta o rechaza</strong> en &lt;24h</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700"><strong>Si acepta</strong>, pagas y obtienes contacto</span>
                  </li>
                </ul>
              </div>

              {/* Trust Badges & Activity */}
              <div className="pt-4 border-t-2 border-gray-100">
                <TrustBadges
                  property={property}
                  stats={activityStats}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY CTA MOBILE PREMIUM (Fixed Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-blue-100 p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-2">
            {/* Precio visible - Mejor jerarquía */}
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500 font-medium">Desde</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                €{property.monthlyPrice?.toLocaleString()}<span className="text-base text-gray-600">/mes</span>
              </p>
            </div>
            
            {/* CTA Mobile - Más grande y atractivo */}
            <Button 
              onClick={() => setShowBookingModal(true)}
              className="flex-1 max-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 shadow-lg active:scale-95 transition-transform"
              size="lg"
            >
              {creatingCheckout ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Cargando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contactar
                </span>
              )}
            </Button>
          </div>
          
          {/* Micro-copy mobile - Más visible */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Lock className="h-3 w-3 text-green-600" />
            <span><strong>{leadPrice}</strong> pago único · Pago seguro</span>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ContactConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAndPay}
        property={property}
        leadPrice={leadPrice}
        isLoading={creatingCheckout}
      />

      {/* Modal de Booking Request */}
      <BookingRequestModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
      />
    </div>
  );
}
