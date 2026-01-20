'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, Mail, Phone, Calendar, MapPin, Euro } from 'lucide-react';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  property_address: string;
  property_type: string;
  monthly_price: number;
  available_from: string;
  about_you?: string;
  why_join: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function FoundingHostsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/founding-hosts');
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        console.error('API did not return an array:', data);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`¿Seguro que quieres ${action === 'approve' ? 'ACEPTAR' : 'RECHAZAR'} esta aplicación?`)) {
      return;
    }

    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/founding-hosts/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        alert(`Aplicación ${action === 'approve' ? 'ACEPTADA' : 'RECHAZADA'} exitosamente`);
        fetchApplications();
        setSelectedApp(null);
      } else {
        alert('Error al procesar la acción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la acción');
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: '⏳ Pendiente',
      approved: '✅ Aceptado',
      rejected: '❌ Rechazado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando aplicaciones...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-4">Founding Hosts Applications</h1>
        <p className="text-gray-600">Manage applications for the Founding Host Program (10 spots total)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-black mb-2">{stats.total}</div>
          <div className="text-gray-600">Total Aplicaciones</div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="text-3xl font-black mb-2 text-yellow-800">{stats.pending}</div>
          <div className="text-yellow-700 font-medium">Pendientes</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="text-3xl font-black mb-2 text-green-800">{stats.approved}</div>
          <div className="text-green-700 font-medium">Aceptados</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="text-3xl font-black mb-2 text-red-800">{stats.rejected}</div>
          <div className="text-red-700 font-medium">Rechazados</div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Ciudad</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Precio/Mes</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Fecha</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay aplicaciones aún
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{app.full_name}</div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{app.city}</div>
                      <div className="text-sm text-gray-500">{app.property_address}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      €{app.monthly_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(app.id, 'approve')}
                              disabled={actionLoading === app.id}
                              className="p-2 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                              title="Aceptar"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleAction(app.id, 'reject')}
                              disabled={actionLoading === app.id}
                              className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black mb-2">{selectedApp.full_name}</h2>
                {getStatusBadge(selectedApp.status)}
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold mb-4">Información de Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`https://wa.me/${selectedApp.phone.replace(/\D/g, '')}`} target="_blank" className="text-blue-600 hover:underline">
                      {selectedApp.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div>
                <h3 className="font-bold mb-4">Información de la Propiedad</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedApp.city}</div>
                      <div className="text-sm text-gray-600">{selectedApp.property_address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-gray-400">🏠</span>
                    </div>
                    <span className="capitalize">{selectedApp.property_type.replace('br', ' bedroom').replace('studio', 'Studio')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Euro className="w-5 h-5 text-gray-400" />
                    <span className="font-bold">€{selectedApp.monthly_price.toLocaleString()}/mes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>Disponible desde: {new Date(selectedApp.available_from).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {/* Why Join */}
              <div>
                <h3 className="font-bold mb-2">¿Por qué quiere ser Founding Host?</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.why_join}</p>
              </div>

              {/* About */}
              {selectedApp.about_you && (
                <div>
                  <h3 className="font-bold mb-2">Sobre el Aplicante</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.about_you}</p>
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={() => handleAction(selectedApp.id, 'approve')}
                    disabled={actionLoading === selectedApp.id}
                    className="flex-1 bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    ✅ Aceptar
                  </button>
                  <button
                    onClick={() => handleAction(selectedApp.id, 'reject')}
                    disabled={actionLoading === selectedApp.id}
                    className="flex-1 bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    ❌ Rechazar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
