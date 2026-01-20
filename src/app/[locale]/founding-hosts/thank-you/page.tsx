'use client';

import { Link } from '@/i18n/routing';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-black mb-4">
            ¡Aplicación Recibida!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Gracias por aplicar al Founding Host Program de inhabitme.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-bold text-lg mb-3">📬 Próximos Pasos:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Revisaremos tu aplicación en las próximas <strong>24-48 horas</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Te contactaremos por <strong>email</strong> o <strong>WhatsApp</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Si eres aceptado, te guiaremos en el proceso de verificación</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-600 mb-8">
            Mientras tanto, revisa tu email (incluyendo spam) y mantén tu WhatsApp activo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/founding-hosts"
              className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-bold hover:border-blue-600 transition"
            >
              Ver Programa
            </Link>
          </div>
        </div>

        <p className="mt-8 text-gray-600">
          ¿Preguntas? Escríbenos a <a href="mailto:hello@inhabitme.com" className="text-blue-600 font-bold">hello@inhabitme.com</a>
        </p>
      </div>
    </div>
  );
}
