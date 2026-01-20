'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FoundingHostApplyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    propertyAddress: '',
    propertyType: '',
    monthlyPrice: '',
    availableFrom: '',
    aboutYou: '',
    whyJoin: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/founding-hosts/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la aplicación');
      }

      router.push('/founding-hosts/thank-you');
    } catch (err) {
      setError('Hubo un error al enviar tu aplicación. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            Aplicación Founding Host
          </h1>
          <p className="text-xl text-gray-600">
            5 minutos para completar. Revisamos en 24-48hrs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          {/* Información Personal */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Sobre Ti</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="Ana María García"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="ana@gmail.com"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="+34 612 345 678"
                />
              </div>
            </div>
          </div>

          {/* Información de Propiedad */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Tu Propiedad</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Ciudad *</label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                >
                  <option value="">Selecciona ciudad</option>
                  <option value="madrid">Madrid</option>
                  <option value="barcelona">Barcelona</option>
                  <option value="valencia">Valencia</option>
                  <option value="sevilla">Sevilla</option>
                  <option value="malaga">Málaga</option>
                  <option value="other">Otra</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">Dirección (Barrio) *</label>
                <input
                  type="text"
                  required
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="Malasaña, Madrid"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Tipo de Propiedad *</label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                >
                  <option value="">Selecciona tipo</option>
                  <option value="studio">Estudio</option>
                  <option value="1br">1 dormitorio</option>
                  <option value="2br">2 dormitorios</option>
                  <option value="3br">3+ dormitorios</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">Precio Mensual (€) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({...formData, monthlyPrice: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="1200"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Disponible desde *</label>
                <input
                  type="date"
                  required
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Motivación */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Cuéntanos</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">
                  ¿Por qué quieres ser Founding Host? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({...formData, whyJoin: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="Me interesa porque..."
                />
              </div>

              <div>
                <label className="block font-bold mb-2">
                  Sobre ti y tu propiedad (opcional)
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutYou}
                  onChange={(e) => setFormData({...formData, aboutYou: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                  placeholder="Soy arquitecta, vivo en Barcelona, alquilo mi piso cuando viajo..."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4 text-red-700">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Aplicación'}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Revisamos todas las aplicaciones en 24-48hrs y te contactamos.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
