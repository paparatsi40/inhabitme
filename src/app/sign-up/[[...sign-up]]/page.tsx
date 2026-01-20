'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  
  // Check if this is a founding host signup
  const isFoundingHost = searchParams.get('founding_host') === 'true';
  const foundingHostNumber = searchParams.get('founding_host_number');
  const invitationToken = searchParams.get('invitation_token');

  const unsafeMetadata = isFoundingHost ? {
    role: 'founding_host',
    founding_host_number: parseInt(foundingHostNumber || '0'),
    founding_host_year: 2026,
    invitation_token: invitationToken
  } : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        {isFoundingHost && (
          <div className="mb-6 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold mb-2">
              🏆 Founding Host #{foundingHostNumber} of 10
            </div>
            <p className="text-gray-600">Creando tu cuenta de Founding Host</p>
          </div>
        )}
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
          unsafeMetadata={unsafeMetadata}
        />
      </div>
    </div>
  );
}