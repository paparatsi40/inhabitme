'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export default function FoundingHostJoinPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<any>(null);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await fetch('/api/founding-host/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.valid) {
        setValid(true);
        setInvitationData(data.invitation);
        setValidating(false);
      } else {
        setError(data.error || 'Invalid invitation');
        setValidating(false);
      }
    } catch (err) {
      setError('Error validating invitation');
      setValidating(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validando tu invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitación Inválida
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/en/founding-hosts')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
          >
            Volver a Founding Hosts
          </button>
        </div>
      </div>
    );
  }

  // Show SignUp component with invitation data
  if (valid && invitationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with benefits */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold mb-4">
              🏆 Founding Host #{invitationData.foundingHostNumber} of 10
            </div>
            <h1 className="text-4xl font-black mb-4">
              Crea Tu Cuenta de Founding Host
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Completa tu registro para activar tus beneficios exclusivos
            </p>
          </div>

          {/* Benefits cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-4 text-center border-2 border-blue-200">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-bold">Gratis Todo 2026</div>
              <div className="text-sm text-gray-600">Sin comisiones</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-purple-200">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-bold">Featured Gratis</div>
              <div className="text-sm text-gray-600">Máxima visibilidad</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-green-200">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold">Badge Exclusivo</div>
              <div className="text-sm text-gray-600">Founding Host #{invitationData.foundingHostNumber}</div>
            </div>
          </div>

          {/* SignUp component */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <SignUp 
              routing="hash"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                  footerActionLink: 'text-blue-600 hover:text-blue-700'
                }
              }}
              unsafeMetadata={{
                role: 'founding_host',
                founding_host_number: invitationData.foundingHostNumber,
                founding_host_year: 2026,
                invitation_token: token
              }}
              afterSignUpUrl="/en/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
