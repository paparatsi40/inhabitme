import { redirect as nextRedirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { getTranslations } from 'next-intl/server';
import { 
  ArrowLeft, CreditCard, CheckCircle, XCircle, 
  Clock, Search, DollarSign
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  payment_date: string;
  booking: {
    property_id: string;
    guest_name: string;
    start_date: string;
    end_date: string;
  };
}

export default async function PaymentsPage() {
  const { userId } = await auth();
  const t = await getTranslations('dashboard');

  if (!userId) {
    nextRedirect('/sign-in');
  }

  const supabase = getSupabaseServerClient();

  // Obtener pagos del host
  const { data: payments } = await supabase
    .from('host_payments')
    .select(`
      id,
      booking_id,
      amount,
      status,
      payment_date,
      bookings!inner(
        property_id,
        guest_name,
        start_date,
        end_date,
        listings!inner(
          owner_id
        )
      )
    `)
    .eq('bookings.listings.owner_id', userId)
    .order('payment_date', { ascending: false });

  const paymentsList: Payment[] = (payments || []).map((p: any) => ({
    id: p.id,
    booking_id: p.booking_id,
    amount: p.amount,
    status: p.status,
    payment_date: p.payment_date,
    booking: {
      property_id: p.bookings.property_id,
      guest_name: p.bookings.guest_name,
      start_date: p.bookings.start_date,
      end_date: p.bookings.end_date,
    },
  }));

  // Calcular totales
  const totalEarnings = paymentsList
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = paymentsList
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
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
            <div className="flex items-center gap-3">
              <Link href="/search">
                <Button variant="ghost" className="font-semibold">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Configuración
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
                Pagos y Facturación
              </h1>
              <p className="text-gray-600 mt-1">
                Historial de pagos recibidos por tus reservas
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          <Card className="border-2 border-green-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Recibido
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                €{totalEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pagos completados
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Pendientes
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                €{pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                En proceso
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Transacciones
              </CardTitle>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                {paymentsList.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Historial completo
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-black text-gray-900">
              Historial de Pagos
            </h2>
            <p className="text-gray-600 mt-1">
              Todos tus pagos recibidos por reservas confirmadas
            </p>
          </div>

          {paymentsList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Huésped
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Estancia
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentsList.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {payment.booking.guest_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(payment.booking.start_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                          {' - '}
                          {new Date(payment.booking.end_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-gray-900">
                          €{payment.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {payment.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                            <CheckCircle className="h-4 w-4" />
                            Completado
                          </span>
                        )}
                        {payment.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold">
                            <Clock className="h-4 w-4" />
                            Pendiente
                          </span>
                        )}
                        {payment.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                            <XCircle className="h-4 w-4" />
                            Fallido
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                <CreditCard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No hay pagos registrados
              </h3>
              <p className="text-gray-600 mb-6">
                Los pagos aparecerán aquí cuando tus guests completen sus reservas
              </p>
              <Link href="/dashboard">
                <Button>
                  Ir al Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
