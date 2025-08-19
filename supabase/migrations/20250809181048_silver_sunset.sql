/*
  # Create establishments tables for Aparecida Tourism Portal

  1. New Tables
    - `hotels` - Hotel and accommodation listings
      - `id` (integer, primary key)
      - `name` (text, establishment name)
      - `category` (text, type/category of establishment)
      - `rating` (numeric, rating score)
      - `address` (text, full address)
      - `phone` (text, contact phone)
      - `whatsapp` (text, WhatsApp number)
      - `image` (text, main image URL)
      - `description` (text, detailed description)
      - `featured` (boolean, whether featured on homepage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `restaurants` - Restaurant and food service listings
    - `shops` - Religious shops and souvenir stores
    - `attractions` - Tourist attractions and points of interest

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated insert/update (for admin panel later)

  3. Indexes
    - Add indexes on commonly queried fields (featured, rating)
*/

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attractions table
CREATE TABLE IF NOT EXISTS attractions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on hotels"
  ON hotels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on restaurants"
  ON restaurants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on shops"
  ON shops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on attractions"
  ON attractions FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update (for admin panel)
CREATE POLICY "Allow authenticated users to insert hotels"
  ON hotels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hotels"
  ON hotels FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update restaurants"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert shops"
  ON shops FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update shops"
  ON shops FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert attractions"
  ON attractions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update attractions"
  ON attractions FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_featured ON hotels(featured);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating DESC);
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON restaurants(featured);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX IF NOT EXISTS idx_shops_featured ON shops(featured);
CREATE INDEX IF NOT EXISTS idx_shops_rating ON shops(rating DESC);
CREATE INDEX IF NOT EXISTS idx_attractions_featured ON attractions(featured);
CREATE INDEX IF NOT EXISTS idx_attractions_rating ON attractions(rating DESC);