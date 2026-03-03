'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Trash2, 
  Eye, 
  MapPin, 
  Euro, 
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Home,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Listing {
  id: string
  title: string
  city: {
    name: string
    country: string
  }
  neighborhood?: {
    name: string
  }
  bedrooms: number
  price: {
    monthly: number
    currency: string
  }
  ownerId: string
  status: string
  createdAt: string
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const fetchListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/admin/listings')
      
      if (!res.ok) {
        throw new Error('Failed to fetch listings')
      }
      
      const data = await res.json()
      setListings(data.listings || [])
    } catch (err) {
      setError('Error loading listings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async (listing: Listing) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${listing.title}"?\n\nLocation: ${listing.city.name}\nPrice: €${listing.price.monthly}/month\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(listing.id)

    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete')
      }

      // Remove from local state
      setListings(prev => prev.filter(l => l.id !== listing.id))
    } catch (err) {
      alert('Error deleting listing')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.neighborhood?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading listings...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900">Error loading listings</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <Button 
              onClick={fetchListings} 
              variant="outline" 
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/admin"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <h1 className="text-3xl font-black">Manage Listings</h1>
          <p className="text-gray-600 mt-1">
            {listings.length} total listings • {filteredListings.length} shown
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchListings}
            variant="outline"
            className="border-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title, city, or neighborhood..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 py-3 text-base border-2"
        />
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchTerm ? 'No listings match your search' : 'No listings found'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Listings will appear here once created'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredListings.map((listing) => (
            <div 
              key={listing.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                      <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {listing.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {listing.city.name}
                          {listing.neighborhood && `, ${listing.neighborhood.name}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {listing.price.monthly} {listing.price.currency}/month
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {listing.bedrooms} bed
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          listing.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        ID: {listing.id} • Created: {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/properties/${listing.id}`}
                    target="_blank"
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  
                  <Button
                    onClick={() => handleDelete(listing)}
                    disabled={deletingId === listing.id}
                    variant="outline"
                    size="sm"
                    className="border-2 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {deletingId === listing.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
