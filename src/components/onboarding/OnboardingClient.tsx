'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, User, Check } from 'lucide-react';

export default function OnboardingClient() {
  const router = useRouter();
  const locale = useLocale();
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<'guest' | 'host' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    
    try {
      // Actualizar rol en la base de datos
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clerkId: user.id,
          role: selectedRole.toUpperCase() 
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Error updating role');
        // Redirigir de todas formas
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">¡Bienvenido a inhabitme! 🎉</h1>
          <p className="text-xl text-gray-600">
            Para personalizar tu experiencia, dinos cómo planeas usar inhabitme
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Guest Card */}
          <Card 
            className={`cursor-pointer transition-all border-2 ${
              selectedRole === 'guest' 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('guest')}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                {selectedRole === 'guest' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">Soy Huésped</CardTitle>
              <CardDescription className="text-base">
                Busco alojamiento para estancias de 1-6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Buscar y reservar alojamientos verificados</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Gestionar tus reservas y pagos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Acceso a la comunidad de nómadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Contratos y facturación automática</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Host Card */}
          <Card 
            className={`cursor-pointer transition-all border-2 ${
              selectedRole === 'host' 
                ? 'border-purple-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('host')}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                {selectedRole === 'host' && (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">Soy Anfitrión</CardTitle>
              <CardDescription className="text-base">
                Quiero publicar mis propiedades para alquilar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Publicar propiedades con verificación</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Gestionar reservas y calendario</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Pagos seguros y automáticos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-700">Contratos legales generados automáticamente</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Both Option */}
        <Card 
          className={`cursor-pointer transition-all border-2 mb-8 ${
            selectedRole === 'guest' || selectedRole === 'host'
              ? 'border-gray-200' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                💡 <strong>Tip:</strong> Puedes cambiar tu rol o agregar ambos más tarde desde tu perfil
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleComplete}
            disabled={!selectedRole || isLoading}
            className="px-12"
          >
            {isLoading ? 'Guardando...' : 'Continuar al Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
}
