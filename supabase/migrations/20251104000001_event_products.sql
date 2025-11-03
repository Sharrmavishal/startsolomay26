-- Migration: Event Products with Razorpay Integration
-- Allows mentors to add paid products to events with commission tracking

-- Create event_products table
CREATE TABLE IF NOT EXISTS event_products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Product details
  product_name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  
  -- Commission (can be overridden per product, defaults to admin setting)
  commission_rate decimal(5, 2) DEFAULT 10 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  commission_amount decimal(10, 2) DEFAULT 0,
  mentor_payout decimal(10, 2) DEFAULT 0,
  
  -- Razorpay integration
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  
  -- Product status
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  
  -- Tracking
  purchase_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_product_purchases table (similar to course_enrollments)
CREATE TABLE IF NOT EXISTS event_product_purchases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES event_products(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Payment details
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_amount decimal(10, 2) NOT NULL,
  commission_amount decimal(10, 2) NOT NULL,
  mentor_payout decimal(10, 2) NOT NULL,
  
  -- Razorpay integration
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  
  -- Purchase status
  purchase_status text NOT NULL DEFAULT 'active' CHECK (purchase_status IN ('active', 'cancelled', 'refunded')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(product_id, buyer_id)
);

-- Add admin setting for event product commission rate
INSERT INTO admin_settings (key, value, description) VALUES
  ('event_product_commission_rate', '10', 'Commission percentage for event products')
ON CONFLICT (key) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_products_event ON event_products(event_id);
CREATE INDEX IF NOT EXISTS idx_event_products_mentor ON event_products(mentor_id);
CREATE INDEX IF NOT EXISTS idx_event_products_active ON event_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_event_product_purchases_product ON event_product_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_event_product_purchases_buyer ON event_product_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_event_product_purchases_payment_status ON event_product_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_product_purchases_razorpay_payment_id ON event_product_purchases(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_event_product_purchases_razorpay_order_id ON event_product_purchases(razorpay_order_id);

-- Update purchase count trigger
CREATE OR REPLACE FUNCTION update_event_product_purchase_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.payment_status = 'paid' THEN
    UPDATE event_products
    SET purchase_count = purchase_count + 1
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.payment_status = 'paid' AND NEW.payment_status != 'paid' THEN
      UPDATE event_products
      SET purchase_count = GREATEST(0, purchase_count - 1)
      WHERE id = NEW.product_id;
    ELSIF OLD.payment_status != 'paid' AND NEW.payment_status = 'paid' THEN
      UPDATE event_products
      SET purchase_count = purchase_count + 1
      WHERE id = NEW.product_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_product_purchase_count
  AFTER INSERT OR UPDATE ON event_product_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_event_product_purchase_count();

-- Update updated_at trigger
CREATE TRIGGER update_event_products_updated_at BEFORE UPDATE ON event_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_product_purchases_updated_at BEFORE UPDATE ON event_product_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE event_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_product_purchases ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products for events
CREATE POLICY "Anyone can view active event products" ON event_products
  FOR SELECT
  USING (is_active = true);

-- Mentors can manage their own products
CREATE POLICY "Mentors can manage their own event products" ON event_products
  FOR ALL
  USING (
    mentor_id IN (
      SELECT id FROM community_members
      WHERE user_id = auth.uid()
    )
  );

-- Admins can manage all products
CREATE POLICY "Admins can manage all event products" ON event_products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases" ON event_product_purchases
  FOR SELECT
  USING (
    buyer_id IN (
      SELECT id FROM community_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can create purchases
CREATE POLICY "Users can create purchases" ON event_product_purchases
  FOR INSERT
  WITH CHECK (
    buyer_id IN (
      SELECT id FROM community_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update their own purchases
CREATE POLICY "Users can update their own purchases" ON event_product_purchases
  FOR UPDATE
  USING (
    buyer_id IN (
      SELECT id FROM community_members
      WHERE user_id = auth.uid()
    )
  );

-- Mentors can view purchases for their products
CREATE POLICY "Mentors can view purchases for their products" ON event_product_purchases
  FOR SELECT
  USING (
    product_id IN (
      SELECT id FROM event_products
      WHERE mentor_id IN (
        SELECT id FROM community_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases" ON event_product_purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

COMMENT ON TABLE event_products IS 'Products that mentors can sell during events';
COMMENT ON TABLE event_product_purchases IS 'Purchase records for event products with payment tracking';

