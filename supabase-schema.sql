-- ============================================================
-- ReviewPlus — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Campaigns table
CREATE TABLE campaigns (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name               TEXT NOT NULL,
  business_name      TEXT NOT NULL,
  google_review_link TEXT NOT NULL,
  qr_code_data_url   TEXT,
  active             BOOLEAN DEFAULT TRUE,
  total_reviews      INTEGER DEFAULT 0,
  positive_redirects INTEGER DEFAULT 0,
  negative_feedbacks INTEGER DEFAULT 0,
  total_rating       INTEGER DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  rating              INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  generated_review    TEXT,
  redirected_to_google BOOLEAN DEFAULT FALSE,
  answers             JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────────────

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews   ENABLE ROW LEVEL SECURITY;

-- Campaigns: users manage only their own rows
CREATE POLICY "Users manage own campaigns" ON campaigns
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reviews: campaign owners can read their reviews
CREATE POLICY "Campaign owners read reviews" ON reviews
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = reviews.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

-- NOTE: Review inserts and campaign stat updates are done
-- server-side via Vercel functions using the service-role key,
-- so no INSERT/UPDATE policies are needed on these tables.
