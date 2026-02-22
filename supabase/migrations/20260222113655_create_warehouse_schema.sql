/*
  # Smart Warehouse Database Schema

  ## Overview
  This migration creates the complete database schema for the Smart Warehouse Space Utilization Dashboard.

  ## New Tables
  
  ### 1. `warehouse_racks`
  Stores information about warehouse rack slots (digital twin representation)
  - `id` (uuid, primary key)
  - `rack_id` (text) - Human-readable rack identifier
  - `zone` (text) - Zone classification (A, B, C, etc.)
  - `row_position` (integer) - Row position in grid (0-9)
  - `col_position` (integer) - Column position in grid (0-9)
  - `utilization_percentage` (integer) - Current utilization (0-100)
  - `capacity` (integer) - Maximum capacity in units
  - `current_stock` (integer) - Current stock level
  - `last_updated` (timestamptz)
  - `created_at` (timestamptz)

  ### 2. `products`
  Stores product/SKU information
  - `id` (uuid, primary key)
  - `sku` (text, unique) - Stock keeping unit
  - `name` (text) - Product name
  - `category` (text) - Product category
  - `quantity` (integer) - Current quantity
  - `rack_id` (uuid) - Foreign key to warehouse_racks
  - `last_movement_date` (timestamptz) - Last time product moved
  - `status` (text) - active, dead_stock, fast_moving
  - `created_at` (timestamptz)

  ### 3. `utilization_history`
  Tracks utilization over time for analytics
  - `id` (uuid, primary key)
  - `date` (date) - Date of record
  - `hour` (integer) - Hour of day (0-23)
  - `zone` (text) - Zone identifier
  - `utilization_percentage` (integer)
  - `congestion_index` (integer) - 0-100 scale
  - `created_at` (timestamptz)

  ### 4. `cameras`
  Warehouse camera information
  - `id` (uuid, primary key)
  - `camera_id` (text) - Camera identifier
  - `name` (text) - Camera name/description
  - `zone` (text) - Zone covered
  - `video_url` (text) - Video stream URL
  - `status` (text) - online, offline, maintenance
  - `created_at` (timestamptz)

  ### 5. `admin_profiles`
  Admin user profiles
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Links to auth.users
  - `full_name` (text)
  - `email` (text)
  - `role` (text) - admin, manager, viewer
  - `department` (text)
  - `phone` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `warehouse_info`
  General warehouse information
  - `id` (uuid, primary key)
  - `name` (text) - Warehouse name
  - `location` (text) - Physical location
  - `total_capacity` (integer) - Total capacity in units
  - `total_zones` (integer) - Number of zones
  - `total_racks` (integer) - Number of racks
  - `efficiency_score` (integer) - Overall efficiency (0-100)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated access
*/

-- Create warehouse_racks table
CREATE TABLE IF NOT EXISTS warehouse_racks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rack_id text NOT NULL UNIQUE,
  zone text NOT NULL DEFAULT 'A',
  row_position integer NOT NULL,
  col_position integer NOT NULL,
  utilization_percentage integer NOT NULL DEFAULT 0 CHECK (utilization_percentage >= 0 AND utilization_percentage <= 100),
  capacity integer NOT NULL DEFAULT 100,
  current_stock integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  quantity integer NOT NULL DEFAULT 0,
  rack_id uuid REFERENCES warehouse_racks(id) ON DELETE SET NULL,
  last_movement_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dead_stock', 'fast_moving')),
  created_at timestamptz DEFAULT now()
);

-- Create utilization_history table
CREATE TABLE IF NOT EXISTS utilization_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  hour integer CHECK (hour >= 0 AND hour <= 23),
  zone text NOT NULL,
  utilization_percentage integer NOT NULL CHECK (utilization_percentage >= 0 AND utilization_percentage <= 100),
  congestion_index integer NOT NULL DEFAULT 0 CHECK (congestion_index >= 0 AND congestion_index <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create cameras table
CREATE TABLE IF NOT EXISTS cameras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id text NOT NULL UNIQUE,
  name text NOT NULL,
  zone text NOT NULL,
  video_url text,
  status text NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  created_at timestamptz DEFAULT now()
);

-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer')),
  department text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create warehouse_info table
CREATE TABLE IF NOT EXISTS warehouse_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  total_capacity integer NOT NULL DEFAULT 10000,
  total_zones integer NOT NULL DEFAULT 3,
  total_racks integer NOT NULL DEFAULT 100,
  efficiency_score integer NOT NULL DEFAULT 75 CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE warehouse_racks ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_info ENABLE ROW LEVEL SECURITY;

-- Create policies for warehouse_racks
CREATE POLICY "Allow public read access to warehouse_racks"
  ON warehouse_racks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to warehouse_racks"
  ON warehouse_racks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to warehouse_racks"
  ON warehouse_racks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for products
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to products"
  ON products FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to products"
  ON products FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for utilization_history
CREATE POLICY "Allow public read access to utilization_history"
  ON utilization_history FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to utilization_history"
  ON utilization_history FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for cameras
CREATE POLICY "Allow public read access to cameras"
  ON cameras FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to cameras"
  ON cameras FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to cameras"
  ON cameras FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for admin_profiles
CREATE POLICY "Allow public read access to admin_profiles"
  ON admin_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to admin_profiles"
  ON admin_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to admin_profiles"
  ON admin_profiles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for warehouse_info
CREATE POLICY "Allow public read access to warehouse_info"
  ON warehouse_info FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public update to warehouse_info"
  ON warehouse_info FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_warehouse_racks_zone ON warehouse_racks(zone);
CREATE INDEX IF NOT EXISTS idx_warehouse_racks_utilization ON warehouse_racks(utilization_percentage);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_rack_id ON products(rack_id);
CREATE INDEX IF NOT EXISTS idx_utilization_history_date ON utilization_history(date);
CREATE INDEX IF NOT EXISTS idx_utilization_history_zone ON utilization_history(zone);