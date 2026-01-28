-- FarmersMarkets.io Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- Core markets table
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Location
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(50),
  state_code VARCHAR(2),
  zip_code VARCHAR(10),
  county VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Contact
  phone VARCHAR(20),
  website VARCHAR(500),
  email VARCHAR(255),
  social_facebook VARCHAR(255),
  social_instagram VARCHAR(255),

  -- Schedule (JSONB for flexibility)
  schedule JSONB,
  season_start DATE,
  season_end DATE,

  -- Enriched data (from Outscraper)
  google_place_id VARCHAR(255),
  google_rating DECIMAL(2, 1),
  google_reviews_count INTEGER DEFAULT 0,
  directions_url VARCHAR(500),
  business_status VARCHAR(50),
  price_range VARCHAR(10),
  popular_times JSONB,

  -- Products offered (from USDA)
  products JSONB,
  payment_methods JSONB,

  -- Media
  featured_image VARCHAR(500),
  photos JSONB,

  -- SEO & Status
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_enriched_at TIMESTAMPTZ
);

-- Reviews table (user-generated + scraped)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source VARCHAR(50) DEFAULT 'user',
  author_name VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories/Tags
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50)
);

CREATE TABLE market_categories (
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (market_id, category_id)
);

-- Locations hierarchy for SEO pages
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  state_code VARCHAR(2),
  parent_id UUID REFERENCES locations(id),
  market_count INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  UNIQUE(type, slug, state_code)
);

-- User claims for market ownership
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  verification_document VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  is_market_owner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites/saved markets
CREATE TABLE favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, market_id)
);

-- Sponsored/Featured listings (monetization)
CREATE TABLE sponsored_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_paid DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad placements tracking
CREATE TABLE ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement VARCHAR(50) NOT NULL,
  page_type VARCHAR(50),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  date DATE NOT NULL,
  UNIQUE(placement, page_type, date)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_markets_state ON markets(state_code);
CREATE INDEX idx_markets_city ON markets(city, state_code);
CREATE INDEX idx_markets_location ON markets USING GIST (
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_markets_rating ON markets(google_rating DESC NULLS LAST);
CREATE INDEX idx_markets_slug ON markets(slug);
CREATE INDEX idx_markets_active ON markets(is_active) WHERE is_active = true;
CREATE INDEX idx_markets_name_search ON markets USING gin(to_tsvector('english', name));

CREATE INDEX idx_reviews_market ON reviews(market_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE INDEX idx_locations_type_state ON locations(type, state_code);
CREATE INDEX idx_locations_slug ON locations(slug);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_market ON favorites(market_id);

CREATE INDEX idx_sponsored_active ON sponsored_listings(is_active, start_date, end_date)
  WHERE is_active = true;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_listings ENABLE ROW LEVEL SECURITY;

-- Markets: Public read
CREATE POLICY "Markets are viewable by everyone" ON markets
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage markets" ON markets
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Reviews: Public read, authenticated write own
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Categories: Public read
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Market categories: Public read
CREATE POLICY "Market categories are viewable by everyone" ON market_categories
  FOR SELECT USING (true);

-- Locations: Public read
CREATE POLICY "Locations are viewable by everyone" ON locations
  FOR SELECT USING (true);

-- Claims: Users can view own, create own
CREATE POLICY "Users can view own claims" ON claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Profiles: Public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Favorites: Own only
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Sponsored listings: Public read active
CREATE POLICY "Active sponsored listings are viewable" ON sponsored_listings
  FOR SELECT USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_markets_updated_at
  BEFORE UPDATE ON markets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update location market counts
CREATE OR REPLACE FUNCTION update_location_market_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update state count
  UPDATE locations
  SET market_count = (
    SELECT COUNT(*) FROM markets
    WHERE state_code = NEW.state_code AND is_active = true
  )
  WHERE type = 'state' AND state_code = NEW.state_code;

  -- Update city count
  UPDATE locations
  SET market_count = (
    SELECT COUNT(*) FROM markets
    WHERE LOWER(city) = LOWER(
      (SELECT name FROM locations WHERE type = 'city' AND slug = LOWER(REPLACE(NEW.city, ' ', '-')) AND state_code = NEW.state_code)
    )
    AND state_code = NEW.state_code
    AND is_active = true
  )
  WHERE type = 'city' AND state_code = NEW.state_code AND slug = LOWER(REPLACE(NEW.city, ' ', '-'));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_market_change
  AFTER INSERT OR UPDATE ON markets
  FOR EACH ROW
  EXECUTE FUNCTION update_location_market_count();

-- Increment ad impressions function
CREATE OR REPLACE FUNCTION increment_ad_impression(
  p_placement VARCHAR,
  p_page_type VARCHAR
) RETURNS void AS $$
BEGIN
  INSERT INTO ad_impressions (placement, page_type, date, impressions)
  VALUES (p_placement, p_page_type, CURRENT_DATE, 1)
  ON CONFLICT (placement, page_type, date)
  DO UPDATE SET impressions = ad_impressions.impressions + 1;
END;
$$ LANGUAGE plpgsql;

-- Increment ad clicks function
CREATE OR REPLACE FUNCTION increment_ad_click(
  p_placement VARCHAR,
  p_page_type VARCHAR
) RETURNS void AS $$
BEGIN
  INSERT INTO ad_impressions (placement, page_type, date, clicks)
  VALUES (p_placement, p_page_type, CURRENT_DATE, 1)
  ON CONFLICT (placement, page_type, date)
  DO UPDATE SET clicks = ad_impressions.clicks + 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA: Categories
-- ============================================

INSERT INTO categories (name, slug, description, icon) VALUES
  ('Organic', 'organic', 'Certified organic produce and products', 'leaf'),
  ('Vegetables', 'vegetables', 'Fresh vegetables and greens', 'carrot'),
  ('Fruits', 'fruits', 'Fresh fruits and berries', 'apple'),
  ('Dairy', 'dairy', 'Milk, cheese, eggs and dairy products', 'milk'),
  ('Meat', 'meat', 'Fresh meat and poultry', 'beef'),
  ('Seafood', 'seafood', 'Fresh fish and seafood', 'fish'),
  ('Baked Goods', 'baked-goods', 'Fresh bread, pastries and baked items', 'croissant'),
  ('Honey', 'honey', 'Local honey and bee products', 'droplet'),
  ('Flowers', 'flowers', 'Cut flowers and plants', 'flower'),
  ('Crafts', 'crafts', 'Handmade crafts and artisan goods', 'palette'),
  ('Prepared Foods', 'prepared-foods', 'Ready-to-eat meals and snacks', 'utensils'),
  ('Beverages', 'beverages', 'Juices, cider, and other drinks', 'cup-soda');

-- ============================================
-- SEED DATA: US States
-- ============================================

INSERT INTO locations (type, name, slug, state_code, market_count) VALUES
  ('state', 'Alabama', 'alabama', 'AL', 0),
  ('state', 'Alaska', 'alaska', 'AK', 0),
  ('state', 'Arizona', 'arizona', 'AZ', 0),
  ('state', 'Arkansas', 'arkansas', 'AR', 0),
  ('state', 'California', 'california', 'CA', 0),
  ('state', 'Colorado', 'colorado', 'CO', 0),
  ('state', 'Connecticut', 'connecticut', 'CT', 0),
  ('state', 'Delaware', 'delaware', 'DE', 0),
  ('state', 'Florida', 'florida', 'FL', 0),
  ('state', 'Georgia', 'georgia', 'GA', 0),
  ('state', 'Hawaii', 'hawaii', 'HI', 0),
  ('state', 'Idaho', 'idaho', 'ID', 0),
  ('state', 'Illinois', 'illinois', 'IL', 0),
  ('state', 'Indiana', 'indiana', 'IN', 0),
  ('state', 'Iowa', 'iowa', 'IA', 0),
  ('state', 'Kansas', 'kansas', 'KS', 0),
  ('state', 'Kentucky', 'kentucky', 'KY', 0),
  ('state', 'Louisiana', 'louisiana', 'LA', 0),
  ('state', 'Maine', 'maine', 'ME', 0),
  ('state', 'Maryland', 'maryland', 'MD', 0),
  ('state', 'Massachusetts', 'massachusetts', 'MA', 0),
  ('state', 'Michigan', 'michigan', 'MI', 0),
  ('state', 'Minnesota', 'minnesota', 'MN', 0),
  ('state', 'Mississippi', 'mississippi', 'MS', 0),
  ('state', 'Missouri', 'missouri', 'MO', 0),
  ('state', 'Montana', 'montana', 'MT', 0),
  ('state', 'Nebraska', 'nebraska', 'NE', 0),
  ('state', 'Nevada', 'nevada', 'NV', 0),
  ('state', 'New Hampshire', 'new-hampshire', 'NH', 0),
  ('state', 'New Jersey', 'new-jersey', 'NJ', 0),
  ('state', 'New Mexico', 'new-mexico', 'NM', 0),
  ('state', 'New York', 'new-york', 'NY', 0),
  ('state', 'North Carolina', 'north-carolina', 'NC', 0),
  ('state', 'North Dakota', 'north-dakota', 'ND', 0),
  ('state', 'Ohio', 'ohio', 'OH', 0),
  ('state', 'Oklahoma', 'oklahoma', 'OK', 0),
  ('state', 'Oregon', 'oregon', 'OR', 0),
  ('state', 'Pennsylvania', 'pennsylvania', 'PA', 0),
  ('state', 'Rhode Island', 'rhode-island', 'RI', 0),
  ('state', 'South Carolina', 'south-carolina', 'SC', 0),
  ('state', 'South Dakota', 'south-dakota', 'SD', 0),
  ('state', 'Tennessee', 'tennessee', 'TN', 0),
  ('state', 'Texas', 'texas', 'TX', 0),
  ('state', 'Utah', 'utah', 'UT', 0),
  ('state', 'Vermont', 'vermont', 'VT', 0),
  ('state', 'Virginia', 'virginia', 'VA', 0),
  ('state', 'Washington', 'washington', 'WA', 0),
  ('state', 'West Virginia', 'west-virginia', 'WV', 0),
  ('state', 'Wisconsin', 'wisconsin', 'WI', 0),
  ('state', 'Wyoming', 'wyoming', 'WY', 0),
  ('state', 'District of Columbia', 'district-of-columbia', 'DC', 0),
  ('state', 'Puerto Rico', 'puerto-rico', 'PR', 0);
