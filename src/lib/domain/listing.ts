// src/lib/domain/listing.ts

export type City = {
  country: string
  name: string
}

export type Neighborhood = {
  name: string
  city: City
}

export type ListingAmenities = {
  wifiSpeedMbps?: number
  hasDesk: boolean
  hasSecondMonitor?: boolean
  furnished: boolean
}

export type ListingAvailability = {
  availableFrom: Date
  availableTo?: Date
  minMonths: number
  maxMonths: number
}

export type ListingPrice = {
  monthly: number
  currency: 'EUR'
}

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'paused'
  | 'archived'

export type Listing = {
  id: string

  title: string
  description: string

  city: City
  neighborhood?: Neighborhood

  bedrooms: number
  bathrooms: number

  amenities: ListingAmenities
  availability: ListingAvailability
  price: ListingPrice

  ownerId: string
  status: ListingStatus

  createdAt: Date
  updatedAt: Date
}
