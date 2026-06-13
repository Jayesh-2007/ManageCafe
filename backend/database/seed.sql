INSERT IGNORE INTO users (name, email, password, role, status)
VALUES
  (
    'Admin User',
    'admin@cafepos.com',
    '$2a$10$kX5LCpeoz95YZBqQ9RTF6OHNTFccxFTD3Ggi5WAUgl.aIMZm3V8.2',
    'admin',
    'active'
  );

UPDATE users
SET
  password = '$2a$10$kX5LCpeoz95YZBqQ9RTF6OHNTFccxFTD3Ggi5WAUgl.aIMZm3V8.2',
  role = 'admin',
  status = 'active'
WHERE email = 'admin@cafepos.com';

INSERT IGNORE INTO product_categories (name, color)
VALUES
  ('Beverages', '#4F8A8B'),
  ('Snacks', '#F6C85F'),
  ('Meals', '#6B8E23'),
  ('Breakfast', '#F97316'),
  ('Desserts', '#DB2777'),
  ('Combos', '#2563EB');

INSERT IGNORE INTO products (name, category_id, price, tax_rate, description, is_archived)
VALUES
  (
    'Masala Tea',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    25.00,
    '5',
    'Spiced Indian tea',
    FALSE
  ),
  (
    'Coffee',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    40.00,
    '5',
    'Fresh brewed coffee',
    FALSE
  ),
  (
    'Veg Sandwich',
    (SELECT id FROM product_categories WHERE name = 'Snacks'),
    90.00,
    '5',
    'Vegetable sandwich',
    FALSE
  ),
  (
    'Cappuccino',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    80.00,
    '5',
    'Espresso coffee with steamed milk',
    FALSE
  ),
  (
    'Cold Coffee',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    95.00,
    '5',
    'Chilled coffee served with milk and ice',
    FALSE
  ),
  (
    'Lemon Iced Tea',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    70.00,
    '5',
    'Fresh lemon iced tea',
    FALSE
  ),
  (
    'Samosa',
    (SELECT id FROM product_categories WHERE name = 'Snacks'),
    30.00,
    '5',
    'Crispy potato stuffed samosa',
    FALSE
  ),
  (
    'Paneer Sandwich',
    (SELECT id FROM product_categories WHERE name = 'Snacks'),
    120.00,
    '5',
    'Grilled sandwich with paneer filling',
    FALSE
  ),
  (
    'Veg Burger',
    (SELECT id FROM product_categories WHERE name = 'Snacks'),
    110.00,
    '5',
    'Vegetable patty burger with house sauce',
    FALSE
  ),
  (
    'Poha',
    (SELECT id FROM product_categories WHERE name = 'Breakfast'),
    60.00,
    '5',
    'Light flattened rice breakfast with peanuts',
    FALSE
  ),
  (
    'Idli Sambar',
    (SELECT id FROM product_categories WHERE name = 'Breakfast'),
    75.00,
    '5',
    'Two idlis served with sambar and chutney',
    FALSE
  ),
  (
    'Veg Thali',
    (SELECT id FROM product_categories WHERE name = 'Meals'),
    180.00,
    '5',
    'Rice, roti, dal, sabzi, salad, and pickle',
    FALSE
  ),
  (
    'Paneer Butter Masala Meal',
    (SELECT id FROM product_categories WHERE name = 'Meals'),
    220.00,
    '5',
    'Paneer butter masala served with rice or roti',
    FALSE
  ),
  (
    'White Sauce Pasta',
    (SELECT id FROM product_categories WHERE name = 'Meals'),
    170.00,
    '5',
    'Creamy white sauce pasta with vegetables',
    FALSE
  ),
  (
    'Chocolate Brownie',
    (SELECT id FROM product_categories WHERE name = 'Desserts'),
    95.00,
    '5',
    'Warm chocolate brownie',
    FALSE
  ),
  (
    'Gulab Jamun',
    (SELECT id FROM product_categories WHERE name = 'Desserts'),
    70.00,
    '5',
    'Two pieces of gulab jamun',
    FALSE
  ),
  (
    'Tea And Samosa Combo',
    (SELECT id FROM product_categories WHERE name = 'Combos'),
    50.00,
    '5',
    'Masala tea with one samosa',
    FALSE
  ),
  (
    'Breakfast Combo',
    (SELECT id FROM product_categories WHERE name = 'Combos'),
    130.00,
    '5',
    'Poha with masala tea and fruit bowl',
    FALSE
  ),
  (
    'Family Snack Combo',
    (SELECT id FROM product_categories WHERE name = 'Combos'),
    320.00,
    '5',
    'Two sandwiches, two samosas, and two drinks',
    FALSE
  );

INSERT IGNORE INTO customers (name, email, phone)
VALUES
  ('Rohan Mehta', 'rohan.mehta@example.com', '9876543210'),
  ('Priya Shah', 'priya.shah@example.com', '9876543211'),
  ('Amit Patel', 'amit.patel@example.com', '9876543212'),
  ('Neha Sharma', 'neha.sharma@example.com', '9876543213'),
  ('Karan Joshi', 'karan.joshi@example.com', '9876543214'),
  ('Anjali Desai', 'anjali.desai@example.com', '9876543215'),
  ('Vivek Iyer', 'vivek.iyer@example.com', '9876543216'),
  ('Meera Nair', 'meera.nair@example.com', '9876543217');

INSERT IGNORE INTO payment_methods (name, type, upi_id, is_active)
VALUES
  ('Cash', 'cash', NULL, TRUE),
  ('UPI', 'upi', NULL, TRUE),
  ('Card', 'card', NULL, TRUE);

INSERT IGNORE INTO promotions
  (name, type, coupon_code, discount_type, discount_value, min_qty, min_order_amount, is_active)
VALUES
  ('Welcome 10 Percent Off', 'coupon', 'WELCOME10', 'percentage', 10.00, NULL, 150.00, TRUE),
  ('Cafe 50 Off', 'coupon', 'CAFE50', 'fixed', 50.00, NULL, 300.00, TRUE),
  ('Tea Pair Offer', 'product_promo', NULL, 'fixed', 10.00, 2, NULL, TRUE),
  ('Lunch Bill Offer', 'order_promo', NULL, 'percentage', 5.00, NULL, 500.00, TRUE);

INSERT IGNORE INTO cafe_tables (table_number, status)
VALUES
  (1, 'available'),
  (2, 'available'),
  (3, 'available'),
  (4, 'available'),
  (5, 'available'),
  (6, 'available'),
  (7, 'available'),
  (8, 'available'),
  (9, 'available'),
  (10, 'available'),
  (11, 'available'),
  (12, 'available'),
  (13, 'available'),
  (14, 'available'),
  (15, 'available'),
  (16, 'available');
