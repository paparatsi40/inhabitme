'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { CheckCircle, Users, Sparkles, Clock } from 'lucide-react';

export default function FoundingHostsPage() {
  const t = useTranslations('foundingHosts');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 rounded-full px-6 py-2 mb-6">
            <span className="font-bold">🏆 FOUNDING HOST PROGRAM</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black mb-6">
            Sé uno de los primeros<br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              10 Founding Hosts
            </span>
          </h1>

          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Publica GRATIS durante todo 2026.<br />
            Sin comisiones. Sin trucos. Solo 10 spots.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/founding-hosts/apply"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition"
            >
              Aplicar Ahora - 5 min
            </Link>
            <button className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/40">
              Ver Founding Hosts
            </button>
          </div>

          <div className="inline-flex items-center gap-3 bg-black/30 rounded-full px-6 py-3">
            <Clock className="w-5 h-5" />
            <span className="font-bold">⏰ Quedan 7 de 10 spots</span>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            ¿Qué Obtienes como Founding Host?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gratis Todo 2026</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Publica sin límites</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cero comisiones en cada contrato</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Featured listings gratis</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Badge Exclusivo</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Badge "Founding Host #[X] of 10"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Apareces en homepage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Reconocimiento permanente</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Construye con Nosotros</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>WhatsApp directo con founder</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Input en roadmap de producto</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Primera fila en el crecimiento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Hosts actuales */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Founding Hosts
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 flex items-center gap-4 border-2 border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <div className="font-bold text-lg">Ana M.</div>
                <div className="text-gray-600">Malasaña, Madrid • Joined Jan 15</div>
              </div>
              <div className="ml-auto">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                  Founding Host #1
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 flex items-center gap-4 border-2 border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <div className="font-bold text-lg">Carlos R.</div>
                <div className="text-gray-600">Gràcia, Barcelona • Joined Jan 16</div>
              </div>
              <div className="ml-auto">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                  Founding Host #2
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 flex items-center gap-4 border-2 border-green-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <div className="font-bold text-lg">Laura S.</div>
                <div className="text-gray-600">El Carmen, Valencia • Joined Jan 18</div>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  Founding Host #3
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 flex items-center gap-4 border-2 border-gray-200 opacity-50">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div>
                <div className="font-bold text-lg text-gray-400">Spot #4 - OPEN</div>
                <div className="text-gray-400">¿Será el tuyo?</div>
              </div>
            </div>

            {/* Repeat para spots 5-10 */}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/founding-hosts/apply"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition shadow-xl"
            >
              Aplicar para Spot #4
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-6">
            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                ¿Realmente gratis para siempre?
              </summary>
              <p className="mt-4 text-gray-700">
                Gratis durante todo 2026. Desde 2027, pricing regular aplica
                (como todos los demás hosts). El badge de Founding Host se
                mantiene para siempre como reconocimiento histórico.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                ¿Por qué solo 10?
              </summary>
              <p className="mt-4 text-gray-700">
                Media estancia no necesita miles de propiedades. Queremos
                construir con propietarios comprometidos que nos ayuden a
                dar feedback y mejorar el producto. 10 es suficiente para
                validar y lo suficientemente pequeño para cuidar bien.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                ¿Qué pasa en 2027?
              </summary>
              <p className="mt-4 text-gray-700">
                Pricing regular: Success fee de €50 por contrato cerrado o
                suscripción Premium de €29/mes. El badge de Founding Host se
                mantiene pero sin beneficios económicos adicionales.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                ¿Qué requisitos tengo que cumplir?
              </summary>
              <p className="mt-4 text-gray-700">
                Propiedad verificada, responder leads en menos de 24hrs,
                mantener rating superior a 4.5 estrellas. Si incumples,
                pierdes beneficios de Founding (pero nunca pagas retroactivo).
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            ¿Listo para ser Founding Host?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Solo quedan 7 spots. Después del #10, se acabó.
          </p>
          <Link
            href="/founding-hosts/apply"
            className="inline-block bg-white text-purple-600 px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition shadow-xl"
          >
            Aplicar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
