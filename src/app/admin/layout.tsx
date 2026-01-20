import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Users, Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-xl">Admin</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/admin/founding-hosts"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Founding Hosts
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Sitio</span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
