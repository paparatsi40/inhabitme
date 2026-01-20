import { pgTable, text, integer, decimal, boolean, timestamp, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table
export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerkId').notNull().unique(),
  email: text('email').notNull().unique(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  imageUrl: text('imageUrl'),
  role: text('role').notNull().default('GUEST'), // GUEST, HOST, BOTH, ADMIN
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Property table
export const properties = pgTable('Property', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  
  // Location
  city: text('city').notNull(),
  country: text('country').notNull(),
  address: text('address').notNull(),
  zipCode: text('zipCode'),
  latitude: decimal('latitude'),
  longitude: decimal('longitude'),
  
  // Pricing
  monthlyPrice: decimal('monthlyPrice', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('EUR'),
  depositAmount: decimal('depositAmount', { precision: 10, scale: 2 }).notNull(),
  
  // Property details
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  squareMeters: integer('squareMeters'),
  floor: integer('floor'),
  hasElevator: boolean('hasElevator').default(false),
  
  // WORKSPACE (inhabitme differentiator)
  hasDesk: boolean('hasDesk').default(false),
  hasErgonomicChair: boolean('hasErgonomicChair').default(false),
  wifiSpeed: integer('wifiSpeed'), // Mbps
  wifiVerified: boolean('wifiVerified').default(false),
  hasSecondMonitor: boolean('hasSecondMonitor').default(false),
  
  // Amenities
  hasWifi: boolean('hasWifi').default(true),
  hasAC: boolean('hasAC').default(false),
  hasHeating: boolean('hasHeating').default(true),
  hasWashingMachine: boolean('hasWashingMachine').default(false),
  hasDishwasher: boolean('hasDishwasher').default(false),
  hasTV: boolean('hasTV').default(false),
  hasParkingSpace: boolean('hasParkingSpace').default(false),
  petsAllowed: boolean('petsAllowed').default(false),
  smokingAllowed: boolean('smokingAllowed').default(false),
  
  // Status
  status: text('status').notNull().default('DRAFT'), // DRAFT, PENDING_REVIEW, ACTIVE, INACTIVE, ARCHIVED
  isVerified: boolean('isVerified').default(false),
  verifiedAt: timestamp('verifiedAt'),
  
  // Availability
  availableFrom: timestamp('availableFrom'),
  availableTo: timestamp('availableTo'),
  minStayMonths: integer('minStayMonths').default(1),
  maxStayMonths: integer('maxStayMonths').default(6),
  
  // Relations
  hostId: text('hostId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// PropertyImage table
export const propertyImages = pgTable('PropertyImage', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text('url').notNull(),
  caption: text('caption'),
  order: integer('order').default(0),
  isMain: boolean('isMain').default(false),
  propertyId: text('propertyId').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Booking table
export const bookings = pgTable('Booking', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // Dates
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate').notNull(),
  months: integer('months').notNull(),
  
  // Pricing
  monthlyPrice: decimal('monthlyPrice', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('totalPrice', { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal('depositAmount', { precision: 10, scale: 2 }).notNull(),
  
  // Status
  status: text('status').notNull().default('PENDING'), // PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED
  
  // Relations
  guestId: text('guestId').notNull().references(() => users.id),
  propertyId: text('propertyId').notNull().references(() => properties.id),
  
  confirmedAt: timestamp('confirmedAt'),
  cancelledAt: timestamp('cancelledAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Payment table
export const payments = pgTable('Payment', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  // Details
  type: text('type').notNull(), // DEPOSIT, MONTHLY_RENT, REFUND
  status: text('status').notNull().default('PENDING'), // PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
  stripePaymentId: text('stripePaymentId').unique(),
  
  // Relations
  bookingId: text('bookingId').notNull().references(() => bookings.id),
  
  paidAt: timestamp('paidAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Review table
export const reviews = pgTable('Review', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment').notNull(),
  
  // Relations
  bookingId: text('bookingId').notNull().unique().references(() => bookings.id),
  authorId: text('authorId').notNull().references(() => users.id),
  propertyId: text('propertyId').notNull().references(() => properties.id),
  
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Property Waitlist table
export const propertyWaitlist = pgTable('property_waitlist', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  citySlug: text('city_slug').notNull(),
  notified: boolean('notified').notNull().default(false),
  notifiedAt: timestamp('notified_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Property Availability Periods table (SISTEMA PROFESIONAL)
export const propertyAvailabilityPeriods = pgTable('property_availability_periods', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull(), // references listings table
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  status: text('status').notNull().default('available'), // 'available', 'rented', 'blocked', 'maintenance'
  notes: text('notes'),
  tenantReference: text('tenant_reference'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: text('created_by'),
});

// Availability table
export const availability = pgTable('Availability', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: timestamp('date').notNull(),
  isAvailable: boolean('isAvailable').default(true),
  propertyId: text('propertyId').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Message table
export const messages = pgTable('Message', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  isRead: boolean('isRead').default(false),
  
  // Relations
  senderId: text('senderId').notNull().references(() => users.id),
  bookingId: text('bookingId').references(() => bookings.id),
  
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  bookings: many(bookings),
  reviews: many(reviews),
  messages: many(messages),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  host: one(users, { fields: [properties.hostId], references: [users.id] }),
  images: many(propertyImages),
  bookings: many(bookings),
  reviews: many(reviews),
  availability: many(availability),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  guest: one(users, { fields: [bookings.guestId], references: [users.id] }),
  property: one(properties, { fields: [bookings.propertyId], references: [properties.id] }),
  payments: many(payments),
  review: one(reviews),
  messages: many(messages),
}));