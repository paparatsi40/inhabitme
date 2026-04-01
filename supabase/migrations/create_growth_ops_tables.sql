-- ============================================
-- GROWTH OPS TABLES (30-day execution system)
-- InhabitMe
-- ============================================

-- Pipeline of host acquisition leads
CREATE TABLE IF NOT EXISTS growth_pipeline_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Austin',
  full_name TEXT,
  contact_value TEXT NOT NULL,
  contact_type VARCHAR(20) NOT NULL DEFAULT 'email', -- email, phone, whatsapp, dm
  source_channel TEXT NOT NULL DEFAULT 'manual',
  stage VARCHAR(40) NOT NULL DEFAULT 'lead',
  quality_score INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_contact_at TIMESTAMP,
  next_follow_up_at TIMESTAMP,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_growth_pipeline_owner_stage ON growth_pipeline_leads(owner_id, stage, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_pipeline_owner_followup ON growth_pipeline_leads(owner_id, next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_growth_pipeline_city ON growth_pipeline_leads(city, stage);

-- Activity feed for execution tracking
CREATE TABLE IF NOT EXISTS growth_lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES growth_pipeline_leads(id) ON DELETE SET NULL,
  owner_id TEXT NOT NULL,
  actor_id TEXT,
  activity_type VARCHAR(40) NOT NULL, -- outbound, follow_up, reply, call, onboarding, published, inquiry, note
  summary TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_growth_activities_owner_time ON growth_lead_activities(owner_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_activities_lead_time ON growth_lead_activities(lead_id, occurred_at DESC);

-- Daily KPI board
CREATE TABLE IF NOT EXISTS growth_daily_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  kpi_date DATE NOT NULL,
  outbound_sent INTEGER NOT NULL DEFAULT 0,
  contacted_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  interested_count INTEGER NOT NULL DEFAULT 0,
  listings_started INTEGER NOT NULL DEFAULT 0,
  listings_published INTEGER NOT NULL DEFAULT 0,
  followups_done INTEGER NOT NULL DEFAULT 0,
  onboarding_calls INTEGER NOT NULL DEFAULT 0,
  inquiries_generated INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(owner_id, kpi_date)
);

CREATE INDEX IF NOT EXISTS idx_growth_daily_kpis_owner_date ON growth_daily_kpis(owner_id, kpi_date DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_growth_pipeline_stage'
  ) THEN
    ALTER TABLE growth_pipeline_leads
    ADD CONSTRAINT chk_growth_pipeline_stage
    CHECK (stage IN (
      'lead',
      'contacted',
      'replied',
      'interested',
      'started_listing',
      'published',
      'live_inquiry',
      'lost'
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_growth_pipeline_contact_type'
  ) THEN
    ALTER TABLE growth_pipeline_leads
    ADD CONSTRAINT chk_growth_pipeline_contact_type
    CHECK (contact_type IN ('email', 'phone', 'whatsapp', 'dm'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_growth_pipeline_leads_updated_at ON growth_pipeline_leads;
CREATE TRIGGER trg_growth_pipeline_leads_updated_at
BEFORE UPDATE ON growth_pipeline_leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_growth_daily_kpis_updated_at ON growth_daily_kpis;
CREATE TRIGGER trg_growth_daily_kpis_updated_at
BEFORE UPDATE ON growth_daily_kpis
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
