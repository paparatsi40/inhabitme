-- Create property_waitlist table
CREATE TABLE IF NOT EXISTS property_waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  notified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_city_slug ON property_waitlist(city_slug);
CREATE INDEX IF NOT EXISTS idx_waitlist_notified ON property_waitlist(notified);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON property_waitlist(email);

-- Enable RLS (Row Level Security)
ALTER TABLE property_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for subscribing)
CREATE POLICY "Anyone can subscribe to waitlist" ON property_waitlist
  FOR INSERT WITH CHECK (true);

-- Create policy to allow service role to read and update
CREATE POLICY "Service role can manage waitlist" ON property_waitlist
  FOR ALL USING (true);
