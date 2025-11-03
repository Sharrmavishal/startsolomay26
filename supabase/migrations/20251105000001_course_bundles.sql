-- ============================================
-- Course Bundles & Discounts
-- ============================================
-- Allows mentors and admins to create course bundles with discounts

-- ============================================
-- 1. Create course_bundles table
-- ============================================
CREATE TABLE IF NOT EXISTS course_bundles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Creator info
  creator_id uuid NOT NULL, -- mentor_id or admin user_id
  creator_type text NOT NULL CHECK (creator_type IN ('mentor', 'admin')),
  
  -- Bundle details
  title text NOT NULL,
  description text,
  
  -- Discount configuration
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'promo_code')),
  discount_value decimal(10, 2) NOT NULL CHECK (discount_value >= 0),
  promo_code text, -- Only used when discount_type = 'promo_code'
  
  -- Status
  is_active boolean DEFAULT true,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique promo code per bundle
  UNIQUE(promo_code)
);

-- ============================================
-- 2. Create course_bundle_items table
-- ============================================
CREATE TABLE IF NOT EXISTS course_bundle_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id uuid NOT NULL REFERENCES course_bundles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  
  -- Prevent duplicate courses in same bundle
  UNIQUE(bundle_id, course_id)
);

-- ============================================
-- 3. Add bundle_id to course_enrollments
-- ============================================
ALTER TABLE course_enrollments
ADD COLUMN IF NOT EXISTS bundle_id uuid REFERENCES course_bundles(id) ON DELETE SET NULL;

-- ============================================
-- 4. Function: Calculate bundle total price
-- ============================================
CREATE OR REPLACE FUNCTION calculate_bundle_price(p_bundle_id uuid)
RETURNS decimal(10, 2) AS $$
DECLARE
  total_price decimal(10, 2) := 0;
BEGIN
  SELECT COALESCE(SUM(mc.price), 0)
  INTO total_price
  FROM course_bundle_items cbi
  JOIN mentor_courses mc ON cbi.course_id = mc.id
  WHERE cbi.bundle_id = p_bundle_id;
  
  RETURN total_price;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 5. Function: Calculate bundle discount amount
-- ============================================
CREATE OR REPLACE FUNCTION calculate_bundle_discount(p_bundle_id uuid)
RETURNS decimal(10, 2) AS $$
DECLARE
  bundle_record RECORD;
  total_price decimal(10, 2);
  discount_amount decimal(10, 2) := 0;
BEGIN
  -- Get bundle details
  SELECT discount_type, discount_value
  INTO bundle_record
  FROM course_bundles
  WHERE id = p_bundle_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate total price
  total_price := calculate_bundle_price(p_bundle_id);
  
  -- Calculate discount based on type
  IF bundle_record.discount_type = 'percentage' THEN
    discount_amount := total_price * (bundle_record.discount_value / 100);
  ELSIF bundle_record.discount_type = 'fixed_amount' THEN
    discount_amount := LEAST(bundle_record.discount_value, total_price);
  END IF;
  
  RETURN discount_amount;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 6. Function: Get bundle final price
-- ============================================
CREATE OR REPLACE FUNCTION get_bundle_final_price(p_bundle_id uuid)
RETURNS decimal(10, 2) AS $$
DECLARE
  total_price decimal(10, 2);
  discount_amount decimal(10, 2);
BEGIN
  total_price := calculate_bundle_price(p_bundle_id);
  discount_amount := calculate_bundle_discount(p_bundle_id);
  
  RETURN GREATEST(total_price - discount_amount, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_bundle_price(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_bundle_discount(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_bundle_final_price(uuid) TO authenticated;

-- ============================================
-- 7. Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_course_bundles_creator ON course_bundles(creator_id, creator_type);
CREATE INDEX IF NOT EXISTS idx_course_bundles_active ON course_bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_course_bundles_promo_code ON course_bundles(promo_code) WHERE promo_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_course_bundle_items_bundle ON course_bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_course_bundle_items_course ON course_bundle_items(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_bundle ON course_enrollments(bundle_id);

-- ============================================
-- 8. RLS Policies
-- ============================================
ALTER TABLE course_bundles ENABLE ROW LEVEL SECURITY;

-- Anyone can view active bundles
CREATE POLICY "Anyone can view active bundles" ON course_bundles
  FOR SELECT
  USING (is_active = true OR creator_id IN (
    SELECT CASE 
      WHEN creator_type = 'mentor' THEN id
      WHEN creator_type = 'admin' THEN user_id::uuid
    END FROM community_members WHERE user_id = auth.uid()
  ));

-- Mentors can create bundles for their own courses
CREATE POLICY "Mentors can create bundles" ON course_bundles
  FOR INSERT
  WITH CHECK (
    creator_type = 'mentor' AND
    creator_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() AND role = 'mentor'
    )
  );

-- Admins can create bundles
CREATE POLICY "Admins can create bundles" ON course_bundles
  FOR INSERT
  WITH CHECK (
    creator_type = 'admin' AND
    creator_id IN (
      SELECT user_id::uuid FROM community_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Creators can update their own bundles
CREATE POLICY "Creators can update their own bundles" ON course_bundles
  FOR UPDATE
  USING (
    creator_id IN (
      SELECT CASE 
        WHEN creator_type = 'mentor' THEN id
        WHEN creator_type = 'admin' THEN user_id::uuid
      END FROM community_members WHERE user_id = auth.uid()
    )
  );

-- Creators can delete their own bundles
CREATE POLICY "Creators can delete their own bundles" ON course_bundles
  FOR DELETE
  USING (
    creator_id IN (
      SELECT CASE 
        WHEN creator_type = 'mentor' THEN id
        WHEN creator_type = 'admin' THEN user_id::uuid
      END FROM community_members WHERE user_id = auth.uid()
    )
  );

-- Bundle items policies
ALTER TABLE course_bundle_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view bundle items for active bundles
CREATE POLICY "Anyone can view bundle items" ON course_bundle_items
  FOR SELECT
  USING (
    bundle_id IN (
      SELECT id FROM course_bundles 
      WHERE is_active = true OR creator_id IN (
        SELECT CASE 
          WHEN creator_type = 'mentor' THEN id
          WHEN creator_type = 'admin' THEN user_id::uuid
        END FROM community_members WHERE user_id = auth.uid()
      )
    )
  );

-- Bundle creators can manage items
CREATE POLICY "Bundle creators can manage items" ON course_bundle_items
  FOR ALL
  USING (
    bundle_id IN (
      SELECT id FROM course_bundles 
      WHERE creator_id IN (
        SELECT CASE 
          WHEN creator_type = 'mentor' THEN id
          WHEN creator_type = 'admin' THEN user_id::uuid
        END FROM community_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- 9. Triggers
-- ============================================
DROP TRIGGER IF EXISTS update_course_bundles_updated_at ON course_bundles;
CREATE TRIGGER update_course_bundles_updated_at
BEFORE UPDATE ON course_bundles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. Add event_product_commission_rate to admin_settings if not exists
-- ============================================
INSERT INTO admin_settings (key, value, description) VALUES
  ('event_product_commission_rate', '15', 'Commission percentage for event products')
ON CONFLICT (key) DO NOTHING;

-- Note: Bundle commission is handled at the course level (each course in bundle has its own commission)

