-- DripCycle MVP — Initial Database Schema
-- Run this in your Supabase SQL Editor at: https://app.supabase.com

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE product_status AS ENUM (
  'DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED'
);

CREATE TYPE product_condition AS ENUM (
  'New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Vintage/Distressed'
);

CREATE TYPE order_status AS ENUM (
  'REQUESTED', 'RESERVED', 'PAYMENT_PENDING', 'PAID', 'CANCELLED', 'COMPLETED'
);

-- ============================================
-- PROFILES (linked to Supabase Auth)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  size TEXT NOT NULL,
  condition product_condition NOT NULL,
  brand TEXT,
  color TEXT,
  fit TEXT,
  material TEXT,
  measurements JSONB,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status product_status DEFAULT 'DRAFT' NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  is_new_drop BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_new_drop ON products(is_new_drop) WHERE is_new_drop = TRUE;
CREATE INDEX idx_products_name_search ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_tags ON products USING gin(tags);

-- ============================================
-- PRODUCT IMAGES
-- ============================================
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================
-- COLLECTIONS
-- ============================================
CREATE TABLE collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_collections_slug ON collections(slug);

-- ============================================
-- COLLECTION PRODUCTS (many-to-many)
-- ============================================
CREATE TABLE collection_products (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX idx_collection_products_product ON collection_products(product_id);

-- ============================================
-- HOMEPAGE SECTIONS
-- ============================================
CREATE TABLE homepage_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content JSONB,
  image_url TEXT,
  cta_label TEXT,
  cta_link TEXT,
  is_visible BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- CONTENT PAGES
-- ============================================
CREATE TABLE content_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- ORDER REQUESTS
-- ============================================
CREATE TABLE order_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status DEFAULT 'REQUESTED' NOT NULL,
  payment_note TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_requests_status ON order_requests(status);
CREATE INDEX idx_order_requests_created ON order_requests(created_at DESC);

-- ============================================
-- SITE SETTINGS (singleton)
-- ============================================
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  whatsapp_number TEXT DEFAULT '' NOT NULL,
  store_name TEXT DEFAULT 'DripCycle' NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  instagram_handle TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  footer_text TEXT,
  meta_title TEXT DEFAULT 'DripCycle — Premium Thrift Fashion',
  meta_description TEXT DEFAULT 'Discover unique pre-loved fashion at DripCycle. Curated thrift finds — premium, sustainable, one-of-one.',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_pages_updated_at BEFORE UPDATE ON content_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_requests_updated_at BEFORE UPDATE ON order_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, is_admin)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE POLICY "Profiles: own read" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Profiles: admin write" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Profiles: own update" ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Categories: public read" ON categories FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Categories: admin write" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Products: public read" ON products FOR SELECT USING (status IN ('AVAILABLE', 'RESERVED', 'SOLD') OR is_admin());
CREATE POLICY "Products: admin write" ON products FOR ALL USING (is_admin());

CREATE POLICY "Product images: public read" ON product_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND (p.status IN ('AVAILABLE', 'RESERVED', 'SOLD') OR is_admin()))
);
CREATE POLICY "Product images: admin write" ON product_images FOR ALL USING (is_admin());

CREATE POLICY "Collections: public read" ON collections FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Collections: admin write" ON collections FOR ALL USING (is_admin());

CREATE POLICY "Collection products: public read" ON collection_products FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections c WHERE c.id = collection_id AND (c.is_active = TRUE OR is_admin()))
);
CREATE POLICY "Collection products: admin write" ON collection_products FOR ALL USING (is_admin());

CREATE POLICY "Homepage sections: public read" ON homepage_sections FOR SELECT USING (is_visible = TRUE OR is_admin());
CREATE POLICY "Homepage sections: admin write" ON homepage_sections FOR ALL USING (is_admin());

CREATE POLICY "Content pages: public read" ON content_pages FOR SELECT USING (is_published = TRUE OR is_admin());
CREATE POLICY "Content pages: admin write" ON content_pages FOR ALL USING (is_admin());

CREATE POLICY "Order requests: admin only" ON order_requests FOR ALL USING (is_admin());

CREATE POLICY "Site settings: public read" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Site settings: admin write" ON site_settings FOR ALL USING (is_admin());

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO site_settings (whatsapp_number, store_name, instagram_handle, meta_title, meta_description, footer_text)
VALUES ('', 'DripCycle', 'dripcycle', 'DripCycle — Premium Thrift Fashion', 'Discover unique pre-loved fashion at DripCycle. Curated thrift finds — premium, sustainable, one-of-one.', '© 2026 DripCycle. All rights reserved. Thrift × Style × Sustainability.');

INSERT INTO homepage_sections (section_key, title, subtitle, content, cta_label, cta_link, is_visible, sort_order) VALUES
('hero', 'FIND YOUR NEXT DRIP.', 'Pre-loved. Unique. Sustainable.', '{"secondary_cta_label": "EXPLORE VINTAGE", "secondary_cta_link": "/collections"}'::jsonb, 'SHOP NEW ARRIVALS', '/shop', TRUE, 1),
('new_drop', 'NEW DROP', 'Fresh finds, just landed.', NULL, 'VIEW ALL', '/shop?filter=new_drop', TRUE, 2),
('featured', 'FEATURED DRIP', 'Curated picks from our collection.', NULL, 'SHOP ALL', '/shop', TRUE, 3),
('categories', 'SHOP BY CATEGORY', NULL, NULL, NULL, NULL, TRUE, 4),
('brand_story', 'THRIFT × STYLE × SUSTAINABILITY', 'We curate one-of-one pre-loved fashion pieces that carry stories worth wearing.', '{"body": "DripCycle started with a simple belief: great fashion should not cost the earth — literally or financially."}'::jsonb, 'LEARN OUR STORY', '/about', TRUE, 5),
('sustainability', 'WEAR IT AGAIN.', 'Every piece you buy is a choice for the planet.', '{"stats": [{"value": "1 of 1", "label": "Unique pieces"}, {"value": "Pre-loved", "label": "Not new production"}, {"value": "Zero waste", "label": "Fashion goal"}]}'::jsonb, 'OUR SUSTAINABILITY STORY', '/sustainability', TRUE, 6),
('social', 'FOLLOW THE DRIP', 'Tag us in your fits. We love to see it.', NULL, 'FOLLOW ON INSTAGRAM', 'https://instagram.com/dripcycle', TRUE, 7);

INSERT INTO categories (name, slug, is_active, sort_order) VALUES
('Jackets & Coats', 'jackets-coats', TRUE, 1),
('Tops & Tees', 'tops-tees', TRUE, 2),
('Denim', 'denim', TRUE, 3),
('Trousers & Shorts', 'trousers-shorts', TRUE, 4),
('Footwear', 'footwear', TRUE, 5),
('Accessories', 'accessories', TRUE, 6),
('Co-ords & Sets', 'coords-sets', TRUE, 7),
('Sweatshirts & Hoodies', 'sweatshirts-hoodies', TRUE, 8);

INSERT INTO collections (name, slug, description, is_active, sort_order) VALUES
('New Drop', 'new-drop', 'The latest additions to the DripCycle catalog.', TRUE, 1),
('Vintage', 'vintage', 'Authentic vintage pieces with character and history.', TRUE, 2),
('Streetwear', 'streetwear', 'Street-ready fits and statement pieces.', TRUE, 3),
('Under ₹999', 'under-999', 'Great finds under ₹999.', TRUE, 4);

INSERT INTO content_pages (slug, title, content, meta_title, meta_description, is_published) VALUES
('about', 'About DripCycle', 'DripCycle is a premium thrift fashion destination. We curate one-of-one pre-loved pieces — handpicked for quality, character, and style.

Every item in our collection has been carefully selected and inspected. We believe great fashion should be accessible, sustainable, and uniquely yours.

Our mission is simple: give great clothes a second life, and help you find your next drip.', 'About | DripCycle', 'Learn about DripCycle — premium curated thrift fashion.', TRUE),
('sustainability', 'Sustainability', 'At DripCycle, sustainability is not a marketing term — it is the reason we exist.

Fast fashion is one of the world''s largest polluters. By choosing pre-loved, you are actively reducing demand for new production, saving water, reducing carbon emissions, and keeping clothes out of landfills.

Every purchase from DripCycle is a vote for a more sustainable fashion industry.', 'Sustainability | DripCycle', 'DripCycle sustainability commitment.', TRUE),
('faq', 'Frequently Asked Questions', '[{"question": "How do I order?", "answer": "Browse our products and click ORDER VIA WHATSAPP. We will confirm availability and payment details over WhatsApp."}, {"question": "What payment methods do you accept?", "answer": "We accept UPI payments. Our admin will share payment details over WhatsApp after confirming your order."}, {"question": "Can I return a product?", "answer": "Due to the nature of pre-loved inventory, we generally do not accept returns. If there is a significant discrepancy, please contact us immediately."}, {"question": "How are products graded?", "answer": "We use a 6-point scale: New, Like New, Excellent, Very Good, Good, and Vintage/Distressed."}, {"question": "Are all products one-of-one?", "answer": "Yes. Every product is a unique pre-loved piece. Once sold, it is gone. Act quickly on pieces you love."}]', 'FAQ | DripCycle', 'Common questions about ordering, payments, and shipping.', TRUE),
('contact', 'Contact Us', 'We are happy to help! Reach out to us through WhatsApp or Instagram for the fastest response.', 'Contact | DripCycle', 'Get in touch with the DripCycle team.', TRUE),
('privacy-policy', 'Privacy Policy', 'This Privacy Policy describes how DripCycle collects and uses information. We collect only what is necessary to process your orders. We do not sell your information to third parties.', 'Privacy Policy | DripCycle', 'DripCycle privacy policy.', TRUE),
('terms', 'Terms & Conditions', 'By using the DripCycle website, you agree to these terms. All products are sold as described. DripCycle reserves the right to cancel any order if the product is no longer available.', 'Terms & Conditions | DripCycle', 'DripCycle terms and conditions.', TRUE),
('shipping', 'Shipping Information', 'Shipping information will be confirmed with each order over WhatsApp. We currently ship within India. Delivery timelines and costs will be communicated during the ordering process.', 'Shipping | DripCycle', 'DripCycle shipping information.', TRUE),
('returns', 'Returns & Exchanges', 'Due to the one-of-one nature of our pre-loved inventory, we generally do not accept returns or exchanges. If there is a significant discrepancy between the product as described and received, please contact us within 24 hours.', 'Returns & Exchanges | DripCycle', 'DripCycle returns policy.', TRUE);
