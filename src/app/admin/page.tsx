import Link from 'next/link';
import { Users, ArrowRight, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Founding Hosts Card */}
        <Link 
          href="/admin/founding-hosts"
          className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Founding Hosts</h2>
          <p className="text-gray-600">
            Manage applications for the Founding Host Program
          </p>
        </Link>

        {/* Listings Card */}
        <Link 
          href="/admin/listings"
          className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Manage Listings</h2>
          <p className="text-gray-600">
            View and delete all property listings
          </p>
        </Link>
      </div>
    </div>
  );
}
