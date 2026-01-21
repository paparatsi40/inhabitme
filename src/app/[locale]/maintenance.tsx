'use client'

import { useTranslations } from 'next-intl'
import { Settings, Clock, Zap } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-white/20 backdrop-blur-lg rounded-2xl">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
              <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white">inhabitme</h1>
        </div>

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-full border-2 border-white/20">
              <Settings className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
          Estamos mejorando tu experiencia
        </h2>
        
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Nuestro equipo está trabajando en mejoras importantes para ofrecerte 
          un mejor servicio. Volveremos muy pronto.
        </p>

        {/* Features coming */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <Zap className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
            <p className="text-white font-semibold">Nuevas funcionalidades</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <Settings className="h-8 w-8 text-blue-300 mx-auto mb-3" />
            <p className="text-white font-semibold">Mejor rendimiento</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <Clock className="h-8 w-8 text-green-300 mx-auto mb-3" />
            <p className="text-white font-semibold">Más transparencia</p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <p className="text-white/90 mb-2">¿Tienes preguntas?</p>
          <a 
            href="mailto:hola@inhabitme.com" 
            className="text-white font-bold hover:underline text-lg"
          >
            hola@inhabitme.com
          </a>
        </div>

        {/* Footer */}
        <p className="text-white/70 text-sm mt-12">
          © 2026 InhabitMe - Volveremos pronto
        </p>
      </div>
    </div>
  )
}
